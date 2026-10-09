import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'carebridge',
  password: process.env.PG_PASSWORD || 'postgres',
  port: parseInt(process.env.PG_PORT || '5432'),
});

// Mock DB Storage for Hackathon
export const mockDocuments: any[] = [];
export const mockCarePlans: any[] = [];
const USE_MOCK_DB = process.env.USE_MOCK_DB !== 'false'; 

export const query = async (text: string, params: any[]) => {
  if (USE_MOCK_DB) {
    console.log(`[Mock DB Query] ${text.trim().substring(0, 50)}...`);
    const sql = text.trim().toUpperCase();

    if (sql.startsWith('INSERT INTO DOCUMENTS')) {
      const doc = {
        id: params[0],
        patient_id: params[1],
        file_path: params[2],
        upload_time: params[3],
        document_type: params[4],
        draft_extraction: null,
        verified_extraction: null
      };
      mockDocuments.push(doc);
      return { rows: [doc], rowCount: 1 };
    }

    if (sql.startsWith('SELECT * FROM DOCUMENTS WHERE ID = $1')) {
      const doc = mockDocuments.find(d => d.id === params[0]);
      return { rows: doc ? [doc] : [], rowCount: doc ? 1 : 0 };
    }

    if (sql.startsWith('UPDATE DOCUMENTS SET DRAFT_EXTRACTION = $1')) {
      const doc = mockDocuments.find(d => d.id === params[1]);
      if (doc) doc.draft_extraction = params[0];
      return { rows: doc ? [doc] : [], rowCount: doc ? 1 : 0 };
    }
    
    if (sql.startsWith('UPDATE DOCUMENTS SET VERIFIED_EXTRACTION = $1')) {
      const doc = mockDocuments.find(d => d.id === params[1]);
      if (doc) doc.verified_extraction = params[0];
      return { rows: doc ? [doc] : [], rowCount: doc ? 1 : 0 };
    }

    // Care plans insert
    if (sql.startsWith('INSERT INTO CARE_PLANS')) {
      // params: patient_id, medications, appointments, tests, care_tasks
      const cp = {
        patient_id: params[0],
        medications: params[1],
        appointments: params[2],
        tests: params[3],
        care_tasks: params[4]
      };
      mockCarePlans.push(cp);
      return { rows: [cp], rowCount: 1 };
    }

    if (sql.startsWith('SELECT * FROM CARE_PLANS WHERE PATIENT_ID = $1')) {
      // Return combined care plans
      const plans = mockCarePlans.filter(p => p.patient_id === params[0]);
      return { rows: plans, rowCount: plans.length };
    }

    return { rows: [], rowCount: 0 };
  }

  return pool.query(text, params);
};
