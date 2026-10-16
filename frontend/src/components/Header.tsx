import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, LogOut, Menu, X, Calendar } from 'lucide-react';
import { getAuthUser } from '../services/api';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAuthUser();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('cb_auth');
    navigate('/login');
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Recovery Dashboard', subtitle: 'Overview of your continuous post-discharge care plan' };
      case '/documents':
        return { title: 'Medical Documents', subtitle: 'Secure OCR extraction & clinical entity ingestion' };
      case '/verification':
        return { title: 'Review & Verification', subtitle: 'Human-in-the-loop validation of extracted prescriptions' };
      case '/medications':
        return { title: 'Prescription Schedule', subtitle: 'Track medication adherence and dosage timing' };
      case '/daily-care':
        return { title: 'Daily Care & Check-In', subtitle: 'Report symptoms, mobility, and pain levels' };
      case '/appointments':
        return { title: 'Clinical Consultations', subtitle: 'Upcoming physician follow-ups and telehealth sessions' };
      case '/tests':
        return { title: 'Diagnostic Tests', subtitle: 'Ordered laboratory panels and imaging appointments' };
      case '/caregiver':
        return { title: 'Caregiver Coordination', subtitle: 'Trusted family circle permissions & activity log' };
      case '/clinician':
        return { title: 'Clinician Summary', subtitle: 'Algorithmic timeline synthesis for physician review' };
      default:
        return { title: 'CareBridge Portal', subtitle: 'Healthcare continuity and recovery monitoring' };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <header className="app-header">
      <div className="header-left">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar} 
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        
        <div>
          <h1 className="text-xl font-extrabold text-charcoal tracking-tight leading-tight">{title}</h1>
          <p className="text-xs text-muted hidden md:block">{subtitle}</p>
        </div>
      </div>
      
      <div className="header-actions">
        {/* Search */}
        <div className="header-search">
          <Search size={16} className="text-muted mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Search medications, tests, clinical notes..." 
            className="search-input"
          />
        </div>

        {/* Date Indicator */}
        <div className="date-pill hidden lg:flex">
          <Calendar size={14} className="text-[#0F172A]" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            className="icon-btn" 
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            <span className="notification-dot"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
                <span className="text-xs font-bold text-charcoal">Clinical Notifications</span>
                <span className="text-[10px] bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]/40 px-2 py-0.5 rounded-full font-bold">2 New</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-[#DCFCE7]/40 border border-[#86EFAC]/40">
                  <p className="font-semibold text-charcoal">Medication Reminder</p>
                  <p className="text-[11px] text-muted mt-0.5">Amoxicillin 500mg due with dinner (08:00 PM).</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFEDD5]/40 border border-[#FDBA74]/40">
                  <p className="font-semibold text-charcoal">Upcoming Consultation</p>
                  <p className="text-[11px] text-muted mt-0.5">Cardiology Follow-Up with Dr. Jenkins in 3 days.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <div className="user-profile">
          <div className="user-avatar-badge">
            {(user?.name || 'Aarushi').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
          </div>
          <div className="hidden sm:block">
            <p className="user-name">{user?.name || 'Aarushi Thakur'}</p>
            <span className="user-role-badge">
              {user?.role || 'PATIENT'}
            </span>
          </div>
          <button 
            onClick={handleLogout} 
            className="icon-btn ml-1 hover:text-rose-600 hover:bg-rose-50" 
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
