import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Uses query params for patient context (e.g. ?patientId=123)
router.get('/appointments', authenticateToken, authorizeRoles('PATIENT', 'CAREGIVER', 'CLINICIAN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = req.query.patientId || req.query.patient_id || (req as any).user?.id;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    if (userRole === 'PATIENT' && patientId !== userId) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    const appts = await query('SELECT * FROM appointments WHERE patient_id = $1', [patientId]);
    const normalized = appts.rows.map(app => ({
      id: app.id,
      doctorName: app.doctor_name || app.doctorName || 'Dr. Sarah Jenkins',
      department: app.department || 'General Medicine',
      date: app.date ? (app.date.includes('T') ? app.date.split('T')[0] : app.date) : 'Upcoming',
      time: app.time || '10:00 AM',
      location: app.location || 'Building A, Room 302',
      status: app.status || 'scheduled'
    }));
    return res.status(200).json(normalized);
  } catch (error) {
    next(error);
  }
});

router.get('/tests', authenticateToken, authorizeRoles('PATIENT', 'CAREGIVER', 'CLINICIAN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = req.query.patientId || req.query.patient_id || (req as any).user?.id;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    if (userRole === 'PATIENT' && patientId !== userId) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    const tests = await query('SELECT * FROM tests WHERE patient_id = $1', [patientId]);
    const normalized = tests.rows.map(t => ({
      id: t.id,
      testName: t.test_name || t.testName || 'Lab Test',
      dueDate: t.due_date || t.dueDate || 'Pending',
      status: (t.status || 'pending').toLowerCase()
    }));
    return res.status(200).json(normalized);
  } catch (error) {
    next(error);
  }
});

export default router;
