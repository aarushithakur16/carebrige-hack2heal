import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles, verifyPatientConsentForCaregiver } from '../middleware/authMiddleware';
import { logAudit } from '../utils/auditLogger';

const router = Router();

// GET /patients/:id/care-plan
router.get('/:id/care-plan', authenticateToken, authorizeRoles('PATIENT', 'CAREGIVER', 'CLINICIAN'), verifyPatientConsentForCaregiver, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = req.params.id;
    const userId = (req as any).user?.id;

    if ((req as any).user?.role === 'PATIENT' && patientId !== userId) {
      return res.status(403).json({ error: 'Cannot access another patient\'s care plan.' });
    }

    const meds = await query('SELECT * FROM medications WHERE patient_id = $1 AND verified = true', [patientId]);
    const appts = await query('SELECT * FROM appointments WHERE patient_id = $1', [patientId]);
    const tests = await query('SELECT * FROM tests WHERE patient_id = $1', [patientId]);
    const tasks = await query('SELECT * FROM care_tasks WHERE patient_id = $1', [patientId]);

    await logAudit(userId, 'ACCESS_CARE_PLAN', `Patient ${patientId}`);

    return res.status(200).json({
      medications: meds.rows,
      appointments: appts.rows,
      tests: tests.rows,
      care_tasks: tasks.rows
    });
  } catch (error) {
    next(error);
  }
});

// GET /patients/:id/follow-up-summary
router.get('/:id/follow-up-summary', authenticateToken, authorizeRoles('CLINICIAN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = req.params.id;
    const userId = (req as any).user?.id;

    // Build the concise summary manually without diagnosing
    const meds = await query('SELECT * FROM medications WHERE patient_id = $1', [patientId]);
    const tasks = await query('SELECT * FROM care_tasks WHERE patient_id = $1', [patientId]);
    const appts = await query('SELECT * FROM appointments WHERE patient_id = $1', [patientId]);
    const checkins = await query('SELECT * FROM checkins WHERE patient_id = $1 ORDER BY timestamp DESC LIMIT 10', [patientId]);

    const summary = {
      patientInformation: `Patient ID: ${patientId}`,
      medicationAdherence: meds.rows,
      completedTasks: tasks.rows.filter(t => t.status === 'COMPLETED'),
      missedTasks: tasks.rows.filter(t => t.status === 'MISSED'),
      delayedTasks: tasks.rows.filter(t => t.status === 'DELAYED'),
      upcomingAppointments: appts.rows,
      patientEnteredNotes: checkins.rows.map(c => c.note).filter(Boolean)
    };

    await logAudit(userId, 'ACCESS_CLINICIAN_SUMMARY', `Patient ${patientId}`);

    return res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
});

export default router;
