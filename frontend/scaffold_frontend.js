import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'src');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir(path.join(src, 'types'));
ensureDir(path.join(src, 'data'));
ensureDir(path.join(src, 'services'));
ensureDir(path.join(src, 'pages'));

const write = (filepath, content) => fs.writeFileSync(path.join(src, filepath), content);

// --- TYPES ---
write('types/index.ts', `
export interface User { id: string; email: string; role: 'patient' | 'caregiver' | 'clinician'; name: string; }
export interface Patient { id: string; name: string; age: number; condition: string; doctor: string; lastUpdated: string; status: 'Critical' | 'Stable'; }
export interface Document { id: string; name: string; type: string; size: number; status: 'Uploading' | 'Processing' | 'Extraction Ready' | 'Verified'; uploadedAt: string; }
export interface Medication { id: string; name: string; doseText: string; frequency: string; timing: string; status: 'taken' | 'missed' | 'delayed' | 'pending'; }
export interface Appointment { id: string; doctorName: string; department: string; date: string; time: string; location: string; }
export interface Test { id: string; testName: string; dueDate: string; status: 'scheduled' | 'pending' | 'completed'; }
export interface CareTask { id: string; title: string; time: string; status: 'completed' | 'pending' | 'missed'; type: 'medication' | 'exercise' | 'checkup'; }
export interface CheckIn { id: string; date: string; painLevel: number; notes: string; }
export interface AuditActivity { id: string; description: string; time: string; type: 'info' | 'success' | 'warning'; }
export interface FollowUpSummary { patientId: string; carePeriod: string; adherenceScore: number; completedTasks: number; missedTasks: number; delayedTasks: number; notes: string; generatedAt: string; }
`);

// --- DATA ---
write('data/patient.ts', `
import { Patient } from '../types';
export const mockPatient: Patient = { id: 'P-1029', name: 'Aarushi', age: 28, condition: 'Post-Surgery Recovery', doctor: 'Dr. Sarah Jenkins', lastUpdated: 'Today', status: 'Stable' };
`);

write('data/medications.ts', `
import { Medication } from '../types';
export const mockMedications: Medication[] = [
  { id: 'm1', name: 'Amoxicillin', doseText: '500mg', frequency: 'Twice daily', timing: 'Morning and Evening', status: 'taken' },
  { id: 'm2', name: 'Ibuprofen', doseText: '400mg', frequency: 'As needed', timing: 'When pain > 5', status: 'pending' }
];
`);

write('data/appointments.ts', `
import { Appointment } from '../types';
export const mockAppointments: Appointment[] = [
  { id: 'a1', doctorName: 'Dr. Sarah Jenkins', department: 'Cardiology', date: 'Tomorrow', time: '10:30 AM', location: 'City Hospital, Room 402' }
];
`);

write('data/tests.ts', `
import { Test } from '../types';
export const mockTests: Test[] = [
  { id: 't1', testName: 'Complete Blood Count (CBC)', dueDate: 'Oct 12', status: 'pending' },
  { id: 't2', testName: 'Chest X-Ray', dueDate: 'Oct 14', status: 'scheduled' }
];
`);

write('data/tasks.ts', `
import { CareTask } from '../types';
export const mockTasks: CareTask[] = [
  { id: 'tsk1', title: 'Take Amoxicillin (500mg)', time: '08:00 AM', status: 'completed', type: 'medication' },
  { id: 'tsk2', title: 'Breathing Exercises (15 mins)', time: '10:00 AM', status: 'completed', type: 'exercise' },
  { id: 'tsk3', title: 'Afternoon Walk (10 mins)', time: '04:00 PM', status: 'pending', type: 'exercise' }
];
`);

write('data/documents.ts', `
import { Document } from '../types';
export const mockDocuments: Document[] = [
  { id: 'doc1', name: 'Discharge_Summary.pdf', type: 'application/pdf', size: 1024000, status: 'Verified', uploadedAt: new Date().toISOString() }
];
`);

write('data/summary.ts', `
import { FollowUpSummary } from '../types';
export const mockSummary: FollowUpSummary = { patientId: 'P-1029', carePeriod: 'Oct 1 - Oct 9', adherenceScore: 85, completedTasks: 12, missedTasks: 1, delayedTasks: 2, notes: 'Patient reports mild discomfort during breathing exercises.', generatedAt: new Date().toISOString() };
`);

// --- SERVICES ---
write('services/authService.ts', `
import { User } from '../types';
export const login = async (email: string, role: 'patient'|'caregiver'|'clinician'): Promise<User> => {
  return new Promise(resolve => setTimeout(() => resolve({ id: 'u1', email, role, name: 'Demo User' }), 500));
};
`);

write('services/documentService.ts', `
import { Document } from '../types';
import { mockDocuments } from '../data/documents';
export const getDocuments = async (): Promise<Document[]> => { return [...mockDocuments]; };
export const uploadDocument = async (file: File): Promise<Document> => {
  return new Promise(resolve => setTimeout(() => resolve({ id: Date.now().toString(), name: file.name, type: file.type, size: file.size, status: 'Extraction Ready', uploadedAt: new Date().toISOString() }), 1500));
};
`);

write('services/medicationService.ts', `
import { Medication } from '../types';
import { mockMedications } from '../data/medications';
export const getMedications = async (): Promise<Medication[]> => { return [...mockMedications]; };
export const updateMedicationStatus = async (id: string, status: Medication['status']): Promise<void> => { console.log('Mock updated med', id, status); };
`);

write('services/appointmentService.ts', `
import { Appointment } from '../types';
import { mockAppointments } from '../data/appointments';
export const getAppointments = async (): Promise<Appointment[]> => { return [...mockAppointments]; };
`);

write('services/taskService.ts', `
import { CareTask } from '../types';
import { mockTasks } from '../data/tasks';
export const getTasks = async (): Promise<CareTask[]> => { return [...mockTasks]; };
export const updateTaskStatus = async (id: string, status: CareTask['status']): Promise<void> => { console.log('Mock updated task', id, status); };
`);

write('services/summaryService.ts', `
import { FollowUpSummary } from '../types';
import { mockSummary } from '../data/summary';
export const getFollowUpSummary = async (): Promise<FollowUpSummary> => {
  return new Promise(resolve => setTimeout(() => resolve({ ...mockSummary }), 800));
};
`);

// --- PAGES ---
write('pages/ClinicianSummary.tsx', `
import React, { useState, useEffect } from 'react';
import { FollowUpSummary } from '../types';
import { getFollowUpSummary } from '../services/summaryService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AlertTriangle, ActivitySquare, FileText, CheckCircle2 } from 'lucide-react';

export const ClinicianSummary: React.FC = () => {
  const [summary, setSummary] = useState<FollowUpSummary | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { getFollowUpSummary().then(setSummary); }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1500);
  };

  if (!summary) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clinician Follow-Up Summary</h1>
          <p className="text-muted">Review patient progress and adherence.</p>
        </div>
        <Button onClick={handleGenerate} isLoading={generating} icon={FileText}>
          Generate Summary
        </Button>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex gap-3 text-amber-500 text-sm mb-6">
        <AlertTriangle size={20} className="shrink-0" />
        <p><strong>Disclaimer:</strong> CareBridge organizes reported information and does not diagnose or prescribe. Do not use this as a substitute for professional medical judgment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ActivitySquare size={20}/> Adherence Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted">Care Period</span>
              <span className="font-semibold">{summary.carePeriod}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted">Adherence Score</span>
              <span className="font-bold text-emerald-400">{summary.adherenceScore}%</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted">Completed Tasks</span>
              <span className="font-semibold text-emerald-400">{summary.completedTasks}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted">Missed Tasks</span>
              <span className="font-semibold text-red-400">{summary.missedTasks}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted">Delayed Tasks</span>
              <span className="font-semibold text-amber-400">{summary.delayedTasks}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Patient Notes</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg text-sm leading-relaxed border border-white/5">
            {summary.notes || "No notes provided by the patient."}
          </div>
          
          <div className="mt-6 flex items-center gap-2 text-emerald-500 text-sm font-semibold">
            <CheckCircle2 size={16} /> Data compiled successfully
          </div>
        </Card>
      </div>
    </div>
  );
};
`);

// Generic Mock Page for the rest to make routes work
const genericPage = (title, desc) => "import React from 'react';\n" +
"import { EmptyState } from '../components/EmptyState';\n" +
"import { ActivitySquare } from 'lucide-react';\n" +
"export const " + title + ": React.FC = () => (\n" +
"  <div className=\"p-8\">\n" +
"    <h1 className=\"text-3xl font-bold mb-6\">" + title + "</h1>\n" +
"    <EmptyState icon={ActivitySquare} title=\"" + title + "\" description=\"" + desc + "\" />\n" +
"  </div>\n" +
");\n";

write('pages/Medications.tsx', genericPage('Medications', 'Track and manage prescribed medications.'));
write('pages/Appointments.tsx', genericPage('Appointments', 'View and schedule upcoming consultations.'));
write('pages/PendingTests.tsx', genericPage('PendingTests', 'Manage required medical tests and screenings.'));
write('pages/DailyCare.tsx', genericPage('DailyCare', 'Log daily vitals and care routines.'));
write('pages/Caregiver.tsx', genericPage('Caregiver', 'Caregiver coordination and task assignment.'));
write('pages/Verification.tsx', genericPage('Verification', 'Review and verify extracted document data before it enters the care plan.'));

console.log("Scaffolding complete.");
