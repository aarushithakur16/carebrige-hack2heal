import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Uses query params for patient context (e.g. ?patientId=123)
router.get('/appointments', authenticateToken, authorizeRoles('PATIENT', 'CAREGIVER', 'CLINICIAN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = req.query.patientId || (req as any).user?.id;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    if (userRole === 'PATIENT' && patientId !== userId) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    const appts = await query('SELECT date, department, status FROM appointments WHERE patient_id = $1', [patientId]);
    return res.status(200).json(appts.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/tests', authenticateToken, authorizeRoles('PATIENT', 'CAREGIVER', 'CLINICIAN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = req.query.patientId || (req as any).user?.id;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    if (userRole === 'PATIENT' && patientId !== userId) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    const tests = await query('SELECT test_name, due_date, status FROM tests WHERE patient_id = $1', [patientId]);
    return res.status(200).json(tests.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
