import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Documents } from './pages/Documents';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { EmptyState } from './components/EmptyState';
import { Pill, Calendar, Stethoscope, HeartPulse, Users, ActivitySquare } from 'lucide-react';

// Placeholder mock pages for other routes
const MockPage = ({ title, icon }: { title: string, icon: any }) => (
  <div style={{ padding: '24px' }}>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>{title}</h1>
    <EmptyState 
      icon={icon} 
      title={`No ${title.toLowerCase()} found`} 
      description={`You don't have any ${title.toLowerCase()} recorded in the system yet.`} 
    />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="medications" element={<MockPage title="Medications" icon={Pill} />} />
          <Route path="appointments" element={<MockPage title="Appointments" icon={Calendar} />} />
          <Route path="tests" element={<MockPage title="Pending Tests" icon={Stethoscope} />} />
          <Route path="daily-care" element={<MockPage title="Daily Care" icon={HeartPulse} />} />
          <Route path="caregiver" element={<MockPage title="Caregiver" icon={Users} />} />
          <Route path="clinician" element={<MockPage title="Clinician Summary" icon={ActivitySquare} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
