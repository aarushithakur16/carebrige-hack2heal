import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Pill, 
  Calendar, 
  Stethoscope, 
  HeartPulse, 
  Users, 
  ActivitySquare 
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/medications', label: 'Medications', icon: Pill },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/tests', label: 'Pending Tests', icon: Stethoscope },
  { path: '/daily-care', label: 'Daily Care', icon: HeartPulse },
  { path: '/caregiver', label: 'Caregiver', icon: Users },
  { path: '/clinician', label: 'Clinician Summary', icon: ActivitySquare },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-logo">
        <ActivitySquare className="logo-icon" size={28} />
        <span className="text-xl font-bold text-gradient">CareBridge</span>
      </div>
      
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="version-info text-muted text-xs">v1.0.0-demo</div>
      </div>
    </aside>
  );
};
