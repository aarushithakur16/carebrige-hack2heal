export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: 'Critical' | 'Stable' | 'Discharged';
  lastUpdated: string;
  doctor: string;
}

export const mockPatients: Patient[] = [
  {
    id: 'P-1001',
    name: 'Eleanor Vance',
    age: 72,
    condition: 'Cardiac Arrhythmia',
    status: 'Critical',
    lastUpdated: '10 mins ago',
    doctor: 'Dr. Sarah Jenkins'
  },
  {
    id: 'P-1002',
    name: 'Marcus Chen',
    age: 45,
    condition: 'Post-op Recovery',
    status: 'Stable',
    lastUpdated: '1 hour ago',
    doctor: 'Dr. Michael Chang'
  },
  {
    id: 'P-1003',
    name: 'Aisha Rahman',
    age: 28,
    condition: 'Asthma Exacerbation',
    status: 'Stable',
    lastUpdated: '3 hours ago',
    doctor: 'Dr. Emily Stone'
  },
  {
    id: 'P-1004',
    name: 'James Wilson',
    age: 61,
    condition: 'Pneumonia',
    status: 'Critical',
    lastUpdated: '5 mins ago',
    doctor: 'Dr. Sarah Jenkins'
  }
];
