
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
