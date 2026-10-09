import request from 'supertest';
import app from '../server';
import { query } from '../config/database';
import jwt from 'jsonwebtoken';

jest.mock('../config/database');

const JWT_SECRET = 'super_secret_jwt_key_for_hackathon';
const generateToken = (id: string, role: string) => jwt.sign({ id, role }, JWT_SECRET);

describe('Backend Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /health', async () => {
    (query as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ status: 1 }] });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /patients/:id/care-plan with valid PATIENT token', async () => {
    const token = generateToken('patient123', 'PATIENT');
    (query as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [] });
    
    const res = await request(app)
      .get('/patients/patient123/care-plan')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('medications');
  });

  test('GET /patients/:id/care-plan with wrong patient ID', async () => {
    const token = generateToken('patient123', 'PATIENT');
    
    const res = await request(app)
      .get('/patients/patient456/care-plan')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Cannot access another patient's care plan.");
  });

  test('PATCH /medications/:id/status with valid status', async () => {
    const token = generateToken('patient123', 'PATIENT');
    (query as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ id: 'med1', status: 'TAKEN' }] });
    
    const res = await request(app)
      .patch('/medications/med1/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'TAKEN' });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('TAKEN');
  });

  test('PATCH /medications/:id/status with invalid status', async () => {
    const token = generateToken('patient123', 'PATIENT');
    
    const res = await request(app)
      .patch('/medications/med1/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'NOT_A_STATUS' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid status value.');
  });

  test('GET /appointments', async () => {
    const token = generateToken('patient123', 'PATIENT');
    (query as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ id: 'app1' }] });
    
    const res = await request(app)
      .get('/appointments?patientId=patient123')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /patients/:id/follow-up-summary (Clinician only)', async () => {
    const token = generateToken('clinician1', 'CLINICIAN');
    (query as jest.Mock).mockResolvedValue({ rowCount: 0, rows: [] });
    
    const res = await request(app)
      .get('/patients/patient123/follow-up-summary')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('patientInformation');
  });

  test('GET /patients/:id/follow-up-summary (Unauthorized Role)', async () => {
    const token = generateToken('patient123', 'PATIENT');
    
    const res = await request(app)
      .get('/patients/patient123/follow-up-summary')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(403);
  });

  test('GET /audit-logs', async () => {
    const token = generateToken('clinician1', 'CLINICIAN');
    (query as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [{ id: 'log1' }] });
    
    const res = await request(app)
      .get('/audit-logs')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
