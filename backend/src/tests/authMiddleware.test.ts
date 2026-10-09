import request from 'supertest';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, authorizeRoles, verifyPatientConsentForCaregiver } from '../middleware/authMiddleware';
import * as db from '../config/database';

jest.mock('../config/database');

const app = express();
app.use(express.json());

const JWT_SECRET = 'super_secret_jwt_key_for_hackathon';

// Mock test routes
app.get('/protected', authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Success' });
});

app.get('/clinician-only', authenticateToken, authorizeRoles('CLINICIAN'), (req: Request, res: Response) => {
  res.status(200).json({ message: 'Success' });
});

app.post('/caregiver-access', authenticateToken, authorizeRoles('CAREGIVER'), verifyPatientConsentForCaregiver, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Success' });
});

describe('Authorization Middleware Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const generateToken = (role: string) => jwt.sign({ id: 'user123', role }, JWT_SECRET);

  test('1. Missing authentication - should return 401', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Missing authentication token.');
  });

  test('2. Authorized access - valid token works', async () => {
    const token = generateToken('PATIENT');
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('3. Wrong role - should return 403', async () => {
    const token = generateToken('PATIENT');
    const res = await request(app).get('/clinician-only').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Unauthorized role access.');
  });

  test('4. Correct role - should return 200', async () => {
    const token = generateToken('CLINICIAN');
    const res = await request(app).get('/clinician-only').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('5. Missing consent for caregiver - should return 403', async () => {
    const token = generateToken('CAREGIVER');
    
    // Mock the DB response to return no consent
    (db.query as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ consent_status: false }] });

    const res = await request(app).post('/caregiver-access').set('Authorization', `Bearer ${token}`).send({ patientId: 'patient123' });
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Patient consent required for caregiver access.');
  });

  test('6. Valid consent for caregiver - should return 200', async () => {
    const token = generateToken('CAREGIVER');
    
    // Mock the DB response to return valid consent
    (db.query as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ consent_status: true }] });

    const res = await request(app).post('/caregiver-access').set('Authorization', `Bearer ${token}`).send({ patientId: 'patient123' });
    expect(res.status).toBe(200);
  });
});
