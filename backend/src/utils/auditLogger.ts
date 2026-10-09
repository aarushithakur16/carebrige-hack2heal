import { query } from '../config/database';

export const logAudit = async (userId: string | null, action: string, resource: string) => {
  try {
    await query(
      'INSERT INTO audit_logs (user_id, action, resource) VALUES ($1, $2, $3)',
      [userId, action, resource]
    );
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};
