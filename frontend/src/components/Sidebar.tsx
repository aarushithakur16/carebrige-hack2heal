import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Pill, 
  Calendar, 
  Stethoscope, 
  HeartPulse, 
  Users, 
  ActivitySquare,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/documents', label: 'Medical Documents', icon: FileText },
  { path: '/medications', label: 'Medications', icon: Pill },
  { path: '/daily-care', label: 'Daily Care & Symptoms', icon: HeartPulse },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/tests', label: 'Pending Tests', icon: Stethoscope },
  { path: '/caregiver', label: 'Caregiver Hub', icon: Users },
  { path: '/clinician', label: 'Clinician Summary', icon: ActivitySquare },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-badge">
          <ActivitySquare size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold text-gradient leading-tight">CareBridge</div>
          <div className="text-[11px] text-muted font-medium tracking-wide flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Post-Discharge
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="mobile-menu-toggle p-1.5 text-muted hover:text-white"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted/60 px-3 py-1 mb-1">
          Patient Portal
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={19} className="shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck size={14} /> HIPAA-Ready
          </span>
          <span className="text-[11px] bg-slate-800/80 px-2 py-0.5 rounded text-slate-400 border border-white/5">v1.2.0</span>
        </div>
        <p className="text-[11px] text-muted/60 leading-tight">Continuous Care System</p>
      </div>
    </aside>
  );
};
