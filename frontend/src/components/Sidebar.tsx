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
  Sparkles,
  Heart,
  X,
  ArrowUpRight
} from 'lucide-react';
import { getAuthUser } from '../services/api';

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
  const user = getAuthUser();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-logo">
        <div className="logo-badge">
          <Heart className="fill-current" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xl font-extrabold tracking-tight text-forest leading-tight">
            CareBridge
          </div>
          <div className="text-[11px] text-muted font-medium flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span>
            <span>Healthcare Continuity</span>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="mobile-menu-toggle p-1.5 text-muted hover:text-charcoal"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted px-3 py-1 mb-1">
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
      
      {/* Bottom Section with Wellness Card & Profile */}
      <div className="sidebar-footer">
        {/* Attractive Wellness Check-In Card */}
        <div className="sidebar-wellness-card">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1 rounded-full bg-white text-emerald">
              <Sparkles size={13} />
            </div>
            <span className="text-xs font-bold text-forest">Daily Recovery Care</span>
          </div>
          <p className="text-[11px] text-forest/80 leading-snug mb-2.5">
            Track your recovery milestones & daily adherence score.
          </p>
          <NavLink 
            to="/daily-care" 
            onClick={onClose}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-forest hover:text-emerald transition-colors"
          >
            Log Symptoms <ArrowUpRight size={12} />
          </NavLink>
        </div>

        {/* User Mini Bar */}
        <div className="flex items-center gap-3 pt-2 px-1">
          <div className="w-9 h-9 rounded-full bg-forest-green text-soft-mint flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {(user?.name || 'Aarushi').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-charcoal truncate">{user?.name || 'Aarushi Thakur'}</p>
            <p className="text-[10px] text-muted truncate capitalize">{user?.role || 'Patient'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
