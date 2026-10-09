const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const getAuthToken = () => {
  const authStr = localStorage.getItem('cb_auth');
  if (!authStr) return null;
  try {
    const auth = JSON.parse(authStr);
    return auth.token;
  } catch {
    return null;
  }
};

export const getAuthUser = () => {
  const authStr = localStorage.getItem('cb_auth');
  if (!authStr) return null;
  try {
    const auth = JSON.parse(authStr);
    return auth.user;
  } catch {
    return null;
  }
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to application/json if we are not sending FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'API Request Failed');
  }

  return response.json();
};
