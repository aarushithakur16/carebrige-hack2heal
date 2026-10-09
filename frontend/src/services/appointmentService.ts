import { apiFetch, getAuthUser } from './api';
import type { Appointment, Test } from '../types';

export const getAppointments = async (): Promise<Appointment[]> => {
  const user = getAuthUser();
  if (!user) return [];
  return await apiFetch(`/appointments?patientId=${user.id}`);
};

export const getTests = async (): Promise<Test[]> => {
  const user = getAuthUser();
  if (!user) return [];
  return await apiFetch(`/tests?patientId=${user.id}`);
};
