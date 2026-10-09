import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_for_hackathon', (err: any, decoded: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = decoded;
    next();
  });
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized role access.' });
    }
    next();
  };
};

export const verifyPatientConsentForCaregiver = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === 'CAREGIVER') {
    const targetPatientId = req.params.patientId || req.body.patientId;
    if (!targetPatientId) {
      return res.status(400).json({ error: 'Missing patient ID for consent verification.' });
    }

    try {
      // Very simple mock mapping of caregiver to patient consent. 
      // In reality, this would be a junction table like caregiver_patient_access.
      // We'll just verify the patient has consent_status = true.
      const patientRes = await query('SELECT consent_status FROM patients WHERE id = $1', [targetPatientId]);
      if (patientRes.rowCount === 0 || !patientRes.rows[0].consent_status) {
        return res.status(403).json({ error: 'Patient consent required for caregiver access.' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Database error checking consent.' });
    }
  }
  next();
};
