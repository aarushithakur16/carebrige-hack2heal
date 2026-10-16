import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

let pool: Pool | null = null;
let isConnected = false;

// Attempt to initialize PG Pool if configured
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/carebridge',
    connectionTimeoutMillis: 1500,
  });

  pool.on('error', (err) => {
    // Prevent unhandled errors from crashing the Node process
    isConnected = false;
  });
} catch (e) {
  pool = null;
  isConnected = false;
}

// In-Memory Fallback Store (for robust hackathon demo when local Postgres is not running)
const memoryStore = {
  users: [
    {
      id: 'p-1',
      name: 'Aarushi Thakur',
      email: 'patient@carebridge.com',
      password_hash: bcrypt.hashSync('password123', 8),
      role: 'PATIENT',
      contact: '555-0199',
      created_at: new Date().toISOString()
    },
    {
      id: 'c-1',
      name: 'Dr. Sarah Jenkins',
      email: 'clinician@carebridge.com',
      password_hash: bcrypt.hashSync('password123', 8),
      role: 'CLINICIAN',
      contact: '555-0144',
      created_at: new Date().toISOString()
    },
    {
      id: 'cg-1',
      name: 'Jane Doe',
      email: 'caregiver@carebridge.com',
      password_hash: bcrypt.hashSync('password123', 8),
      role: 'CAREGIVER',
      contact: '555-0188',
      created_at: new Date().toISOString()
    }
  ],
  patients: [
    { id: 'p-1', user_id: 'p-1', basic_profile: 'Post-op recovery', consent_status: true }
  ],
  documents: [
    {
      id: 'doc-1',
      patient_id: 'p-1',
      file_path: 'uploads/sample_discharge_summary.pdf',
      document_type: 'Discharge Summary',
      upload_time: new Date().toISOString(),
      status: 'draft_extracted',
      draft_extraction: JSON.stringify({
        medicines: [
          { name: 'Amoxicillin', dose_text: '500mg', doseText: '500mg', frequency: 'Twice daily', timing: 'Morning and evening with meals' },
          { name: 'Ibuprofen', dose_text: '400mg', doseText: '400mg', frequency: 'Every 8 hours as needed', timing: 'After meals for pain control' }
        ],
        appointments: [
          { date: '2026-10-22', department: 'Cardiology Follow-Up' }
        ],
        tests: [
          { test_name: 'Complete Blood Count (CBC)', due_date: '2026-10-18' },
          { test_name: 'Chest X-Ray', due_date: '2026-10-24' }
        ],
        care_instructions: [
          { instruction: 'Keep surgical incision site dry. Avoid lifting heavy objects (>10 lbs) for 7 days.' }
        ]
      })
    }
  ] as any[],
  medications: [
    {
      id: 'med-1',
      patient_id: 'p-1',
      name: 'Amoxicillin',
      dose_text: '500mg',
      doseText: '500mg',
      frequency: 'Twice daily',
      timing: 'Morning and evening with meals',
      status: 'pending',
      verified: true
    },
    {
      id: 'med-2',
      patient_id: 'p-1',
      name: 'Ibuprofen',
      dose_text: '400mg',
      doseText: '400mg',
      frequency: 'Every 8 hours as needed',
      timing: 'After meals',
      status: 'taken',
      verified: true
    },
    {
      id: 'med-3',
      patient_id: 'p-1',
      name: 'Lisinopril',
      dose_text: '10mg',
      doseText: '10mg',
      frequency: 'Once daily',
      timing: 'Morning',
      status: 'pending',
      verified: true
    }
  ],
  care_tasks: [
    {
      id: 'task-1',
      patient_id: 'p-1',
      task_text: 'Morning surgical site inspection & clean dressing',
      title: 'Morning surgical site inspection & clean dressing',
      time: '08:00 AM',
      type: 'exercise',
      status: 'completed'
    },
    {
      id: 'task-2',
      patient_id: 'p-1',
      task_text: 'Take Amoxicillin 500mg with breakfast',
      title: 'Take Amoxicillin 500mg with breakfast',
      time: '09:00 AM',
      type: 'medication',
      status: 'pending'
    },
    {
      id: 'task-3',
      patient_id: 'p-1',
      task_text: '20-minute gentle walking exercise',
      title: '20-minute gentle walking exercise',
      time: '02:00 PM',
      type: 'exercise',
      status: 'pending'
    },
    {
      id: 'task-4',
      patient_id: 'p-1',
      task_text: 'Log evening temperature & pain level',
      title: 'Log evening temperature & pain level',
      time: '07:00 PM',
      type: 'checkup',
      status: 'pending'
    }
  ],
  appointments: [
    {
      id: 'app-1',
      patient_id: 'p-1',
      doctor_name: 'Dr. Sarah Jenkins',
      doctorName: 'Dr. Sarah Jenkins',
      department: 'Cardiology & Surgical Follow-Up',
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time: '10:30 AM',
      location: 'Building B, Room 410',
      status: 'scheduled'
    },
    {
      id: 'app-2',
      patient_id: 'p-1',
      doctor_name: 'Dr. Michael Chen',
      doctorName: 'Dr. Michael Chen',
      department: 'Physical Therapy Consultation',
      date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      time: '02:00 PM',
      location: 'Rehab Center Suite 12',
      status: 'scheduled'
    }
  ],
  tests: [
    {
      id: 'test-1',
      patient_id: 'p-1',
      test_name: 'Complete Blood Count (CBC)',
      testName: 'Complete Blood Count (CBC)',
      due_date: 'Oct 20',
      dueDate: 'Oct 20',
      status: 'pending'
    },
    {
      id: 'test-2',
      patient_id: 'p-1',
      test_name: 'Chest X-Ray (Follow-Up)',
      testName: 'Chest X-Ray (Follow-Up)',
      due_date: 'Oct 24',
      dueDate: 'Oct 24',
      status: 'scheduled'
    }
  ],
  checkins: [
    {
      id: 'chk-1',
      patient_id: 'p-1',
      task_id: 'task-1',
      timestamp: new Date().toISOString(),
      status: 'completed',
      note: 'Dressing changed, healing cleanly without redness.'
    }
  ],
  audit_logs: [
    {
      id: 'log-1',
      user_id: 'p-1',
      action: 'PATIENT_LOGIN',
      resource: 'Auth System',
      timestamp: new Date().toISOString()
    },
    {
      id: 'log-2',
      user_id: 'cg-1',
      action: 'UPDATE_MEDICATION_STATUS',
      resource: 'Medication med-2 marked as taken',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]
};

export const query = async (text: string, params: any[] = []): Promise<{ rows: any[], rowCount: number }> => {
  // If pool is available and successfully connected, query postgres
  if (pool && isConnected) {
    try {
      const res = await pool.query(text, params);
      return { rows: res.rows, rowCount: res.rowCount ?? res.rows.length };
    } catch (err) {
      console.warn('[Database] Postgres query failed, falling back to memory store.');
      isConnected = false;
    }
  }

  // Memory Store Query Evaluator
  const sql = text.trim();
  const upper = sql.toUpperCase();

  // 1. SELECT 1 AS status
  if (upper.includes('SELECT 1')) {
    return { rows: [{ status: 1 }], rowCount: 1 };
  }

  // 2. Users
  if (upper.startsWith('SELECT * FROM USERS WHERE EMAIL = $1')) {
    const user = memoryStore.users.find(u => u.email.toLowerCase() === (params[0] || '').toLowerCase());
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  if (upper.startsWith('INSERT INTO USERS')) {
    const id = 'user-' + Date.now();
    const newUser = {
      id,
      name: params[0],
      email: params[1],
      password_hash: params[2],
      role: params[3],
      contact: params[4] || '',
      created_at: new Date().toISOString()
    };
    memoryStore.users.push(newUser);
    return { rows: [newUser], rowCount: 1 };
  }

  // 3. Patients
  if (upper.startsWith('INSERT INTO PATIENTS')) {
    const patient = {
      id: params[0],
      user_id: params[0],
      basic_profile: 'New patient',
      consent_status: true
    };
    memoryStore.patients.push(patient);
    return { rows: [patient], rowCount: 1 };
  }

  if (upper.includes('FROM PATIENTS WHERE ID = $1')) {
    const pat = memoryStore.patients.find(p => p.id === params[0] || p.user_id === params[0]);
    return { rows: pat ? [pat] : [{ consent_status: true }], rowCount: 1 };
  }

  // 4. Documents
  if (upper.startsWith('INSERT INTO DOCUMENTS')) {
    const docId = 'doc-' + Date.now();
    const newDoc = {
      id: docId,
      patient_id: params[0],
      file_path: params[1],
      upload_time: params[2],
      document_type: params[3],
      status: 'uploaded',
      draft_extraction: null,
      verified_extraction: null
    };
    memoryStore.documents.push(newDoc);
    return { rows: [newDoc], rowCount: 1 };
  }

  if (upper.startsWith('SELECT * FROM DOCUMENTS WHERE ID = $1')) {
    const doc = memoryStore.documents.find(d => d.id === params[0]);
    return { rows: doc ? [doc] : [], rowCount: doc ? 1 : 0 };
  }

  if (upper.includes('FROM DOCUMENTS WHERE PATIENT_ID = $1')) {
    const docs = memoryStore.documents.filter(d => !d.patient_id || d.patient_id === params[0]);
    return { rows: docs, rowCount: docs.length };
  }

  if (upper.includes('FROM DOCUMENTS')) {
    return { rows: memoryStore.documents, rowCount: memoryStore.documents.length };
  }

  if (upper.includes('UPDATE DOCUMENTS SET DRAFT_EXTRACTION = $1')) {
    const doc = memoryStore.documents.find(d => d.id === params[2]);
    if (doc) {
      doc.draft_extraction = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
      doc.status = params[1];
    }
    return { rows: doc ? [doc] : [], rowCount: doc ? 1 : 0 };
  }

  if (upper.includes('UPDATE DOCUMENTS SET VERIFIED_EXTRACTION = $1')) {
    const doc = memoryStore.documents.find(d => d.id === params[2]);
    if (doc) {
      doc.verified_extraction = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
      doc.status = params[1];
    }
    return { rows: doc ? [doc] : [], rowCount: doc ? 1 : 0 };
  }

  // 5. Medications
  if (upper.startsWith('INSERT INTO MEDICATIONS')) {
    const medId = 'med-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newMed = {
      id: medId,
      patient_id: params[0],
      source_document_id: params[1],
      name: params[2],
      dose_text: params[3],
      doseText: params[3],
      frequency: params[4],
      timing: params[5],
      status: 'pending',
      verified: params[6] !== undefined ? params[6] : true
    };
    memoryStore.medications.push(newMed);
    return { rows: [newMed], rowCount: 1 };
  }

  if (upper.includes('FROM MEDICATIONS WHERE PATIENT_ID = $1')) {
    const patientId = params[0];
    const meds = memoryStore.medications.filter(m => m.patient_id === patientId || patientId === 'p-1' || !m.patient_id);
    return { rows: meds, rowCount: meds.length };
  }

  if (upper.startsWith('UPDATE MEDICATIONS SET STATUS = $1 WHERE ID = $2')) {
    const med = memoryStore.medications.find(m => m.id === params[1]);
    if (med) {
      med.status = (params[0] || '').toLowerCase();
    }
    return { rows: med ? [med] : [], rowCount: med ? 1 : 0 };
  }

  // 6. Care Tasks
  if (upper.startsWith('INSERT INTO CARE_TASKS')) {
    const taskId = 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newTask = {
      id: taskId,
      patient_id: params[0],
      task_text: params[1],
      title: params[1],
      time: '10:00 AM',
      type: 'medication',
      status: (params[2] || 'pending').toLowerCase(),
      source_document_id: params[3]
    };
    memoryStore.care_tasks.push(newTask);
    return { rows: [newTask], rowCount: 1 };
  }

  if (upper.includes('FROM CARE_TASKS WHERE PATIENT_ID = $1')) {
    const patientId = params[0];
    const tasks = memoryStore.care_tasks.filter(t => t.patient_id === patientId || patientId === 'p-1' || !t.patient_id);
    return { rows: tasks, rowCount: tasks.length };
  }

  if (upper.startsWith('UPDATE CARE_TASKS SET STATUS = $1 WHERE ID = $2')) {
    const task = memoryStore.care_tasks.find(t => t.id === params[1]);
    if (task) {
      task.status = (params[0] || '').toLowerCase();
    }
    return { rows: task ? [task] : [], rowCount: task ? 1 : 0 };
  }

  // 7. Appointments
  if (upper.startsWith('INSERT INTO APPOINTMENTS')) {
    const appId = 'app-' + Date.now();
    const newApp = {
      id: appId,
      patient_id: params[0],
      date: params[1],
      department: params[2],
      doctor_name: 'Dr. Sarah Jenkins',
      doctorName: 'Dr. Sarah Jenkins',
      time: '10:00 AM',
      location: 'Building A, Room 302',
      status: params[3] || 'scheduled',
      source_document_id: params[4]
    };
    memoryStore.appointments.push(newApp);
    return { rows: [newApp], rowCount: 1 };
  }

  if (upper.includes('FROM APPOINTMENTS WHERE PATIENT_ID = $1')) {
    const patientId = params[0];
    const appts = memoryStore.appointments.filter(a => a.patient_id === patientId || patientId === 'p-1' || !a.patient_id);
    return { rows: appts, rowCount: appts.length };
  }

  // 8. Tests
  if (upper.startsWith('INSERT INTO TESTS')) {
    const testId = 'test-' + Date.now();
    const newTest = {
      id: testId,
      patient_id: params[0],
      test_name: params[1],
      testName: params[1],
      due_date: params[2],
      dueDate: params[2],
      status: params[3] || 'pending'
    };
    memoryStore.tests.push(newTest);
    return { rows: [newTest], rowCount: 1 };
  }

  if (upper.includes('FROM TESTS WHERE PATIENT_ID = $1')) {
    const patientId = params[0];
    const tests = memoryStore.tests.filter(t => t.patient_id === patientId || patientId === 'p-1' || !t.patient_id);
    return { rows: tests, rowCount: tests.length };
  }

  // 9. Checkins
  if (upper.startsWith('INSERT INTO CHECKINS')) {
    const chkId = 'chk-' + Date.now();
    const newChk = {
      id: chkId,
      patient_id: params[0],
      task_id: params[1],
      timestamp: params[2] || new Date().toISOString(),
      status: params[3] || 'completed',
      note: params[4] || ''
    };
    memoryStore.checkins.unshift(newChk);
    return { rows: [newChk], rowCount: 1 };
  }

  if (upper.includes('FROM CHECKINS WHERE PATIENT_ID = $1')) {
    const patientId = params[0];
    const chks = memoryStore.checkins.filter(c => c.patient_id === patientId || patientId === 'p-1' || !c.patient_id);
    return { rows: chks.slice(0, 10), rowCount: Math.min(chks.length, 10) };
  }

  // 10. Audit Logs
  if (upper.startsWith('INSERT INTO AUDIT_LOGS')) {
    const logId = 'log-' + Date.now();
    const newLog = {
      id: logId,
      user_id: params[0],
      action: params[1],
      resource: params[2],
      timestamp: new Date().toISOString()
    };
    memoryStore.audit_logs.unshift(newLog);
    return { rows: [newLog], rowCount: 1 };
  }

  if (upper.includes('FROM AUDIT_LOGS')) {
    return { rows: memoryStore.audit_logs.slice(0, 100), rowCount: memoryStore.audit_logs.length };
  }

  return { rows: [], rowCount: 0 };
};

export const checkDatabaseHealth = async (): Promise<boolean> => {
  if (pool) {
    try {
      const res = await pool.query('SELECT 1 AS status');
      if (res.rows[0]?.status === 1) {
        isConnected = true;
        return true;
      }
    } catch {
      isConnected = false;
    }
  }
  // Memory store is always healthy
  return true;
};

export default { query, checkDatabaseHealth };
