import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Documents } from './pages/Documents';
import { Login } from './pages/Login';
import { Register } from './pages/Register';


import { Medications } from './pages/Medications';
import { Appointments } from './pages/Appointments';
import { PendingTests } from './pages/PendingTests';
import { DailyCare } from './pages/DailyCare';
import { Caregiver } from './pages/Caregiver';
import { ClinicianSummary } from './pages/ClinicianSummary';
import { Verification } from './pages/Verification';

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
          <Route path="verification" element={<Verification />} />
          <Route path="medications" element={<Medications />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="tests" element={<PendingTests />} />
          <Route path="daily-care" element={<DailyCare />} />
          <Route path="caregiver" element={<Caregiver />} />
          <Route path="clinician" element={<ClinicianSummary />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
