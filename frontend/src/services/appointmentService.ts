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

export const createAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
  return await apiFetch('/appointments', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
