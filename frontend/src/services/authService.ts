
import type {  User  } from '../types';
export const login = async (email: string, role: 'patient'|'caregiver'|'clinician'): Promise<User> => {
  return new Promise(resolve => setTimeout(() => resolve({ id: 'u1', email, role, name: 'Demo User' }), 500));
};
