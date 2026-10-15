import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';
import { logAudit } from '../utils/auditLogger';

const router = Router();

router.patch('/tasks/:id/status', authenticateToken, authorizeRoles('PATIENT', 'CAREGIVER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id;
    const rawStatus = req.body.status || '';
    const status = String(rawStatus).toUpperCase();
    const userId = (req as any).user?.id;

    const allowedStatuses = ['PENDING', 'COMPLETED', 'MISSED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const updateRes = await query(
      'UPDATE care_tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status.toLowerCase(), taskId]
    );

    if (updateRes.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    await logAudit(userId, 'UPDATE_TASK_STATUS', `Task ${taskId}`);

    const t = updateRes.rows[0];
    return res.status(200).json({
      ...t,
      title: t.task_text || t.title || 'Task',
      time: t.time || '09:00 AM',
      type: t.type || 'medication',
      status: (t.status || 'pending').toLowerCase()
    });
  } catch (error) {
    next(error);
  }
});

router.post('/checkins', authenticateToken, authorizeRoles('PATIENT'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId, taskId, timestamp, status, note } = req.body;
    const userId = (req as any).user?.id;

    if (patientId && patientId !== userId) {
      return res.status(403).json({ error: 'Cannot create check-in for another patient.' });
    }

    const targetPatient = patientId || userId;

    const insertRes = await query(
      'INSERT INTO checkins (patient_id, task_id, timestamp, status, note) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [targetPatient, taskId || null, timestamp || new Date().toISOString(), status || 'completed', note]
    );

    await logAudit(userId, 'CREATE_CHECKIN', `Patient ${targetPatient}`);

    return res.status(201).json(insertRes.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
