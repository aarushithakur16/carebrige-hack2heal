
import type {  Document  } from '../types';
import { mockDocuments } from '../data/documents';
export const getDocuments = async (): Promise<Document[]> => { return [...mockDocuments]; };
export const uploadDocument = async (file: File): Promise<Document> => {
  return new Promise(resolve => setTimeout(() => resolve({ id: Date.now().toString(), name: file.name, type: file.type, size: file.size, status: 'Extraction Ready', uploadedAt: new Date().toISOString() }), 1500));
};
