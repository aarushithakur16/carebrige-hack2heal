import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/audit-logs', authenticateToken, authorizeRoles('CLINICIAN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    return res.status(200).json(logs.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
