
import type {  Appointment  } from '../types';
import { mockAppointments } from '../data/appointments';
export const getAppointments = async (): Promise<Appointment[]> => { return [...mockAppointments]; };
