
import type {  Medication  } from '../types';
export const mockMedications: Medication[] = [
  { id: 'm1', name: 'Amoxicillin', doseText: '500mg', frequency: 'Twice daily', timing: 'Morning and Evening', status: 'taken' },
  { id: 'm2', name: 'Ibuprofen', doseText: '400mg', frequency: 'As needed', timing: 'When pain > 5', status: 'pending' }
];
