import { apiFetch } from './api';

export const uploadDocument = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('document', file);
  
  return await apiFetch('/documents/upload', {
    method: 'POST',
    body: formData,
  });
};

export const extractDocument = async (documentId: string): Promise<any> => {
  return await apiFetch(`/documents/${documentId}/extract`, {
    method: 'POST',
  });
};

export const verifyExtraction = async (documentId: string, verifiedData: any, status: 'confirmed' | 'rejected'): Promise<any> => {
  return await apiFetch(`/documents/${documentId}/verify`, {
    method: 'POST',
    body: JSON.stringify({ verifiedData, status }),
  });
};
