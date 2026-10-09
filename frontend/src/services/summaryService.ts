import { apiFetch } from './api';

export const getFollowUpSummary = async (patientId: string): Promise<any> => {
  return await apiFetch(`/patients/${patientId}/follow-up-summary`);
};
