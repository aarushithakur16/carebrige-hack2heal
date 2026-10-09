import { apiFetch, getAuthUser } from './api';
import type { Medication } from '../types';

export const getMedications = async (): Promise<Medication[]> => {
  const user = getAuthUser();
  if (!user) return [];
  const res = await apiFetch(`/patients/${user.id}/care-plan`);
  return res.medications || [];
};

export const updateMedicationStatus = async (medId: string, status: string): Promise<Medication> => {
  return await apiFetch(`/medications/${medId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};
