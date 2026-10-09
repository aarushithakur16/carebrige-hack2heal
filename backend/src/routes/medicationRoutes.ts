import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';
import { logAudit } from '../utils/auditLogger';

const router = Router();

// PATCH /medications/:id/status
router.patch('/:id/status', authenticateToken, authorizeRoles('PATIENT', 'CAREGIVER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const medId = req.params.id;
    const { status } = req.body;
    const userId = (req as any).user?.id;

    const allowedStatuses = ['TAKEN', 'MISSED', 'DELAYED', 'PENDING'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    // In a real app we'd verify the med belongs to the patient and the caregiver has consent
    // For this hackathon scope, we just execute the update
    const updateRes = await query(
      'UPDATE medications SET status = $1 WHERE id = $2 RETURNING *',
      [status, medId]
    );

    if (updateRes.rowCount === 0) {
      return res.status(404).json({ error: 'Medication not found.' });
    }

    await logAudit(userId, 'UPDATE_MEDICATION_STATUS', `Medication ${medId}`);

    return res.status(200).json(updateRes.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
