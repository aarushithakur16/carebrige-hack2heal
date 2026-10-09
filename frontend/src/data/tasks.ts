
import type {  CareTask  } from '../types';
export const mockTasks: CareTask[] = [
  { id: 'tsk1', title: 'Take Amoxicillin (500mg)', time: '08:00 AM', status: 'completed', type: 'medication' },
  { id: 'tsk2', title: 'Breathing Exercises (15 mins)', time: '10:00 AM', status: 'completed', type: 'exercise' },
  { id: 'tsk3', title: 'Afternoon Walk (10 mins)', time: '04:00 PM', status: 'pending', type: 'exercise' }
];
