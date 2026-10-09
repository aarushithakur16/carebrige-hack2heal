import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query } from '../db';
import { processDocumentOCR } from '../services/ocrService';
import { authenticateToken, authorizeRoles, verifyPatientConsentForCaregiver } from '../middleware/authMiddleware';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for local storage
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

// 1. Upload Document (Patient or Clinician only)
router.post('/upload', authenticateToken, authorizeRoles('PATIENT', 'CLINICIAN'), upload.single('document'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const documentId = `doc_${Date.now()}`;
    const patientId = req.body.patientId || req.user?.id; // If clinician, they pass patientId in body
    const documentType = req.body.documentType || 'unknown';
    const filePath = req.file.path;
    const uploadTime = new Date().toISOString();

    const sql = `
      INSERT INTO documents (id, patient_id, file_path, upload_time, document_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    await query(sql, [documentId, patientId, filePath, uploadTime, documentType]);

    return res.status(201).json({
      documentId,
      fileName: req.file.originalname,
      documentType,
      uploadedAt: uploadTime,
      status: 'Uploaded'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error during document upload.' });
  }
});

// 2. Extract Document (AI Pipeline)
router.post('/:id/extract', mockAuthAndOwnership, async (req: Request, res: Response) => {
  try {
    const documentId = req.params.id;
    const patientId = req.user?.id;

    // Retrieve document
    const docResult = await query('SELECT * FROM documents WHERE id = $1', [documentId]);
    if (docResult.rowCount === 0) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    const document = docResult.rows[0];

    // Verify ownership
    if (document.patient_id !== patientId) {
      return res.status(403).json({ error: 'Unauthorized access to document.' });
    }

    // OCR -> LLM -> JSON Validation
    const ocrResult = await processDocumentOCR(document.file_path);
    const draftExtraction = await extractMedicalData(ocrResult.text);

    // Store Draft
    await query(
      'UPDATE documents SET draft_extraction = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(draftExtraction), documentId]
    );

    return res.status(200).json({
      status: "draft",
      requiresVerification: true,
      draft: draftExtraction
    });

  } catch (error: any) {
    console.error('Extraction error:', error);
    return res.status(500).json({ error: 'Failed to extract document data.' });
  }
});

// 3. Verify Document Extraction
router.post('/:id/verify', mockAuthAndOwnership, async (req: Request, res: Response) => {
  try {
    const documentId = req.params.id;
    const patientId = req.user?.id;
    const { verifiedData, status } = req.body; 
    // status could be 'confirmed', 'corrected', 'rejected'

    if (!verifiedData || !status) {
      return res.status(400).json({ error: 'Missing verifiedData or status in request body.' });
    }

    // Retrieve doc and verify ownership
    const docResult = await query('SELECT * FROM documents WHERE id = $1', [documentId]);
    if (docResult.rowCount === 0) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    if (docResult.rows[0].patient_id !== patientId) {
      return res.status(403).json({ error: 'Unauthorized access to document.' });
    }

    if (status === 'rejected') {
      await query('UPDATE documents SET verified_extraction = $1 WHERE id = $2', [JSON.stringify({ rejected: true }), documentId]);
      return res.status(200).json({ message: 'Document extraction rejected.' });
    }

    // Store Verified Info
    await query(
      'UPDATE documents SET verified_extraction = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(verifiedData), documentId]
    );

    // Promote verified info to Care Plan
    const cpSql = `
      INSERT INTO care_plans (patient_id, medications, appointments, tests, care_tasks)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await query(cpSql, [
      patientId, 
      JSON.stringify(verifiedData.medicines || []), 
      JSON.stringify(verifiedData.appointments || []), 
      JSON.stringify(verifiedData.tests || []), 
      JSON.stringify([...(verifiedData.care_instructions || []), ...(verifiedData.warning_signs || [])])
    ]);

    return res.status(200).json({
      message: 'Verification complete and active care plan updated.',
      verifiedData
    });

  } catch (error: any) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Failed to verify extraction.' });
  }
});

export default router;
