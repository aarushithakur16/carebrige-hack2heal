import { apiFetch } from './api';

export const login = async (email: string, password: string): Promise<any> => {
  return await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (name: string, email: string, password: string, role: string): Promise<any> => {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
};
