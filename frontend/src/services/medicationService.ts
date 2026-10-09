
import type {  Medication  } from '../types';
import { mockMedications } from '../data/medications';
export const getMedications = async (): Promise<Medication[]> => { return [...mockMedications]; };
export const updateMedicationStatus = async (id: string, status: Medication['status']): Promise<void> => { console.log('Mock updated med', id, status); };
