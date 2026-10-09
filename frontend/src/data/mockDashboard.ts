export interface MedicationStat {
  total: number;
  taken: number;
  missed: number;
  delayed: number;
}

export interface Task {
  id: string;
  title: string;
  time: string;
  status: 'completed' | 'pending' | 'missed';
  type: 'medication' | 'exercise' | 'checkup';
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
}

export interface PendingTest {
  id: string;
  testName: string;
  requiredBefore: string;
  status: 'scheduled' | 'pending';
}

export interface ProgressDataPoint {
  day: string;
  recoveryScore: number;
  painLevel: number;
}

export interface Activity {
  id: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

export const mockMedicationSummary: MedicationStat = {
  total: 6,
  taken: 4,
  missed: 1,
  delayed: 1
};

export const mockTasks: Task[] = [
  { id: '1', title: 'Take Amoxicillin (500mg)', time: '08:00 AM', status: 'completed', type: 'medication' },
  { id: '2', title: 'Breathing Exercises (15 mins)', time: '10:00 AM', status: 'completed', type: 'exercise' },
  { id: '3', title: 'Take Pain Reliever (if needed)', time: '01:00 PM', status: 'missed', type: 'medication' },
  { id: '4', title: 'Afternoon Walk (10 mins)', time: '04:00 PM', status: 'pending', type: 'exercise' },
  { id: '5', title: 'Log Daily Vitals', time: '08:00 PM', status: 'pending', type: 'checkup' },
];

export const mockAppointments: Appointment[] = [
  { id: '1', doctorName: 'Dr. Sarah Jenkins', specialty: 'Cardiology', date: 'Tomorrow', time: '10:30 AM', location: 'City Hospital, Room 402' },
  { id: '2', doctorName: 'Dr. Mike Ross', specialty: 'Physiotherapy', date: 'Oct 15', time: '02:00 PM', location: 'Wellness Clinic' }
];

export const mockTests: PendingTest[] = [
  { id: '1', testName: 'Complete Blood Count (CBC)', requiredBefore: 'Oct 12', status: 'pending' },
  { id: '2', testName: 'Chest X-Ray', requiredBefore: 'Oct 14', status: 'scheduled' }
];

export const mockProgressData: ProgressDataPoint[] = [
  { day: 'Mon', recoveryScore: 65, painLevel: 6 },
  { day: 'Tue', recoveryScore: 68, painLevel: 5 },
  { day: 'Wed', recoveryScore: 74, painLevel: 4 },
  { day: 'Thu', recoveryScore: 79, painLevel: 3 },
  { day: 'Fri', recoveryScore: 85, painLevel: 2 },
  { day: 'Sat', recoveryScore: 88, painLevel: 2 },
  { day: 'Sun', recoveryScore: 92, painLevel: 1 }
];

export const mockActivities: Activity[] = [
  { id: '1', description: 'Blood pressure recorded: 120/80', time: '2 hours ago', type: 'success' },
  { id: '2', description: 'Missed scheduled medication: Pain Reliever', time: '5 hours ago', type: 'warning' },
  { id: '3', description: 'Completed breathing exercises', time: '8 hours ago', type: 'success' },
  { id: '4', description: 'New document added by Dr. Jenkins', time: '1 day ago', type: 'info' }
];
