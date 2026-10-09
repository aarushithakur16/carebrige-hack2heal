import { apiFetch, getAuthUser } from './api';
import type { CareTask } from '../types';

export const getTasks = async (): Promise<CareTask[]> => {
  const user = getAuthUser();
  if (!user) return [];
  const res = await apiFetch(`/patients/${user.id}/care-plan`);
  return res.care_tasks || [];
};

export const updateTaskStatus = async (taskId: string, status: string): Promise<CareTask> => {
  return await apiFetch(`/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const submitCheckin = async (taskId: string, status: string, note: string): Promise<any> => {
  const user = getAuthUser();
  return await apiFetch(`/checkins`, {
    method: 'POST',
    body: JSON.stringify({ patientId: user.id, taskId, status, note, timestamp: new Date().toISOString() }),
  });
};
