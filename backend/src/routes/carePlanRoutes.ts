import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router({ mergeParams: true });

// Mock Authentication Middleware
const mockAuthAndOwnership = (req: Request, res: Response, next: Function) => {
  const requestUserId = req.headers['x-patient-id'];
  const targetPatientId = req.params.id; // from /patients/:id/...

  if (!requestUserId) {
    return res.status(401).json({ error: 'Authentication failed. Missing x-patient-id header.' });
  }

  // Enforce patient privacy: a patient can only request their own care plan
  if (requestUserId !== targetPatientId) {
    return res.status(403).json({ error: 'Forbidden. You do not have permission to view another patient\'s care plan.' });
  }

  next();
};

router.get('/care-plan', mockAuthAndOwnership, async (req: Request, res: Response) => {
  try {
    const patientId = req.params.id;

    // Retrieve ALL verified care plans for the patient from the db
    const cpResult = await query('SELECT * FROM care_plans WHERE patient_id = $1', [patientId]);
    
    if (cpResult.rowCount === 0) {
      return res.status(200).json({
        medications: [],
        appointments: [],
        tests: [],
        care_tasks: [],
        message: 'No active care plan found.'
      });
    }

    // Since a patient might have multiple care plan inserts over time, we consolidate them
    // (In a real production app, this would be handled via a unified single row or state machine)
    const activeCarePlan = {
      medications: [] as any[],
      appointments: [] as any[],
      tests: [] as any[],
      care_tasks: [] as any[]
    };

    for (const row of cpResult.rows) {
      activeCarePlan.medications.push(...(typeof row.medications === 'string' ? JSON.parse(row.medications) : row.medications || []));
      activeCarePlan.appointments.push(...(typeof row.appointments === 'string' ? JSON.parse(row.appointments) : row.appointments || []));
      activeCarePlan.tests.push(...(typeof row.tests === 'string' ? JSON.parse(row.tests) : row.tests || []));
      activeCarePlan.care_tasks.push(...(typeof row.care_tasks === 'string' ? JSON.parse(row.care_tasks) : row.care_tasks || []));
    }

    return res.status(200).json(activeCarePlan);

  } catch (error: any) {
    console.error('Care Plan error:', error);
    return res.status(500).json({ error: 'Failed to retrieve care plan.' });
  }
});

export default router;
