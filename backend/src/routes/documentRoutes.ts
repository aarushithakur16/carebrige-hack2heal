import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query } from '../config/database';
import { processDocumentOCR } from '../services/ocrService';
import { extractMedicalData } from '../services/extractionService';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 },
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only PDF, PNG, and JPG are allowed.'));
  }
});

// List documents
router.get('/', authenticateToken, authorizeRoles('PATIENT', 'CAREGIVER', 'CLINICIAN'), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    
    let docs;
    if (userRole === 'CLINICIAN') {
      docs = await query('SELECT * FROM documents ORDER BY upload_time DESC');
    } else {
      docs = await query('SELECT * FROM documents WHERE patient_id = $1 ORDER BY upload_time DESC', [userId]);
    }
    return res.status(200).json(docs.rows);
  } catch (error: any) {
    console.error('Fetch documents error:', error);
    return res.status(500).json({ error: 'Failed to fetch documents.' });
  }
});

// Get document by ID
router.get('/:id', authenticateToken, authorizeRoles('PATIENT', 'CAREGIVER', 'CLINICIAN'), async (req: Request, res: Response) => {
  try {
    const docId = req.params.id;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    const docResult = await query('SELECT * FROM documents WHERE id = $1', [docId]);
    if (docResult.rowCount === 0) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    const document = docResult.rows[0];

    if (userRole === 'PATIENT' && document.patient_id && document.patient_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to document.' });
    }

    return res.status(200).json(document);
  } catch (error: any) {
    console.error('Get document error:', error);
    return res.status(500).json({ error: 'Failed to retrieve document.' });
  }
});

// 1. Upload Document
router.post('/upload', authenticateToken, authorizeRoles('PATIENT', 'CLINICIAN'), upload.single('document'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const patientId = req.body.patientId || (req as any).user?.id; 
    const documentType = req.body.documentType || 'Medical Report';
    const filePath = req.file.path;
    const uploadTime = new Date().toISOString();

    const sql = `
      INSERT INTO documents (patient_id, file_path, upload_time, document_type, status)
      VALUES ($1, $2, $3, $4, 'uploaded')
      RETURNING *;
    `;
    const docResult = await query(sql, [patientId, filePath, uploadTime, documentType]);
    const document = docResult.rows[0];

    return res.status(201).json({
      documentId: document.id,
      fileName: req.file.originalname,
      documentType,
      uploadedAt: uploadTime,
      status: 'uploaded'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error during document upload.' });
  }
});

// 2. Extract Document (AI Pipeline)
router.post('/:id/extract', authenticateToken, authorizeRoles('PATIENT', 'CLINICIAN'), async (req: Request, res: Response) => {
  try {
    const documentId = req.params.id;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    const docResult = await query('SELECT * FROM documents WHERE id = $1', [documentId]);
    if (docResult.rowCount === 0) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    const document = docResult.rows[0];

    // Only allow patient who owns it, or any clinician to extract
    if (userRole === 'PATIENT' && document.patient_id && document.patient_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to document.' });
    }

    const ocrResult = await processDocumentOCR(document.file_path);
    const draftExtraction = await extractMedicalData(ocrResult.text);

    await query(
      'UPDATE documents SET draft_extraction = $1, status = $2 WHERE id = $3 RETURNING *',
      [JSON.stringify(draftExtraction.data), 'draft_extracted', documentId]
    );

    return res.status(200).json({
      status: "draft",
      requiresVerification: true,
      documentId,
      draft: draftExtraction.data
    });

  } catch (error: any) {
    console.error('Extraction error:', error);
    return res.status(500).json({ error: 'Failed to extract document data.' });
  }
});

// 3. Verify Document Extraction & Create Care Plan
router.post('/:id/verify', authenticateToken, authorizeRoles('PATIENT', 'CAREGIVER', 'CLINICIAN'), async (req: Request, res: Response) => {
  try {
    const documentId = req.params.id;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    const { verifiedData, status } = req.body; 
    
    if (!verifiedData || !status) {
      return res.status(400).json({ error: 'Missing verifiedData or status in request body.' });
    }

    const docResult = await query('SELECT * FROM documents WHERE id = $1', [documentId]);
    if (docResult.rowCount === 0) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    const document = docResult.rows[0];

    if (userRole === 'PATIENT' && document.patient_id && document.patient_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to document.' });
    }

    if (status === 'rejected') {
      await query('UPDATE documents SET verified_extraction = $1, status = $2 WHERE id = $3', 
        [JSON.stringify({ rejected: true }), 'rejected', documentId]);
      return res.status(200).json({ message: 'Document extraction rejected.' });
    }

    // Update document with verified info
    await query(
      'UPDATE documents SET verified_extraction = $1, status = $2 WHERE id = $3',
      [JSON.stringify(verifiedData), 'verified', documentId]
    );

    // Promote verified info to Care Plan Tables
    const targetPatientId = document.patient_id || userId;
    const { medicines, appointments, tests, care_instructions } = verifiedData;

    // Medicines
    if (medicines && Array.isArray(medicines)) {
      for (const med of medicines) {
        await query(
          'INSERT INTO medications (patient_id, source_document_id, name, dose_text, frequency, timing, verified) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [targetPatientId, documentId, med.name, med.dose_text || med.doseText || '', med.frequency || '', med.timing || '', true]
        );
      }
    }

    // Appointments
    if (appointments && Array.isArray(appointments)) {
      for (const app of appointments) {
        const dateObj = new Date(app.date);
        const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
        
        await query(
          'INSERT INTO appointments (patient_id, date, department, status, source_document_id) VALUES ($1, $2, $3, $4, $5)',
          [targetPatientId, validDate.toISOString(), app.department || 'Consultation', 'scheduled', documentId]
        );
      }
    }

    // Tests
    if (tests && Array.isArray(tests)) {
      for (const test of tests) {
        const testDate = test.due_date || test.dueDate || 'Pending';
        await query(
          'INSERT INTO tests (patient_id, test_name, due_date, status) VALUES ($1, $2, $3, $4)',
          [targetPatientId, test.test_name || test.testName, testDate, 'pending']
        );
      }
    }

    // Care Tasks
    if (care_instructions && Array.isArray(care_instructions)) {
      for (const inst of care_instructions) {
        await query(
          'INSERT INTO care_tasks (patient_id, task_text, status, source_document_id) VALUES ($1, $2, $3, $4)',
          [targetPatientId, inst.instruction || inst.task_text || inst.title || 'Follow care instructions', 'pending', documentId]
        );
      }
    }

    return res.status(200).json({
      message: 'Verification complete and active care plan updated.',
      status: 'verified',
      verifiedData
    });

  } catch (error: any) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Failed to verify extraction.' });
  }
});

export default router;
