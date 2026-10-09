
import type {  CareTask  } from '../types';
import { mockTasks } from '../data/tasks';
export const getTasks = async (): Promise<CareTask[]> => { return [...mockTasks]; };
export const updateTaskStatus = async (id: string, status: CareTask['status']): Promise<void> => { console.log('Mock updated task', id, status); };
