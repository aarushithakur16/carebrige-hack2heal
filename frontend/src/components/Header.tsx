import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  LogOut, 
  Menu, 
  X, 
  Calendar, 
  ChevronDown, 
  User, 
  Settings as SettingsIcon, 
  ShieldAlert
} from 'lucide-react';
import { getAuthUser } from '../services/api';
import { SettingsModal } from './dashboard/SettingsModal';
import { EmergencyModal } from './dashboard/EmergencyModal';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAuthUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cb_auth');
    navigate('/login');
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const userName = user?.name || 'Aarushi';

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') {
      return {
        greeting: `Good morning, ${userName}`,
        sub: 'Your health journey, one step at a time.'
      };
    }
    switch (location.pathname) {
      case '/daily-care':
        return { greeting: 'Health Overview & Daily Care', sub: 'Report symptoms, track daily progress, and log recovery' };
      case '/appointments':
        return { greeting: 'Clinical Appointments', sub: 'Upcoming consultations, clinician visits & telehealth' };
      case '/medications':
        return { greeting: 'Medication Schedule', sub: 'Active prescriptions, dosages, and adherence tracking' };
      case '/documents':
        return { greeting: 'Medical Records & Discharge Notes', sub: 'Discharge summaries, clinical entity extractions & history' };
      case '/tests':
        return { greeting: 'Diagnostic Tests', sub: 'Ordered laboratory tests and imaging follow-ups' };
      case '/caregiver':
        return { greeting: 'Caregiver Hub', sub: 'Care circle coordination and family activity updates' };
      case '/clinician':
        return { greeting: 'Clinician Summary', sub: 'Algorithmic recovery velocity and physician review timeline' };
      default:
        return { greeting: `CareBridge Portal`, sub: 'Healthcare continuity & post-discharge monitoring' };
    }
  };

  const { greeting, sub } = getPageTitle();

  return (
    <>
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
            <h1 className="text-xl md:text-2xl font-bold text-[#17231E] tracking-tight leading-tight">
              {greeting}
            </h1>
            <p className="text-xs text-[#68766E] font-medium hidden sm:block">
              {sub}
            </p>
          </div>
        </div>
        
        <div className="header-actions">
          {/* Quick Search */}
          <div className="header-search hidden xl:flex">
            <Search size={15} className="text-[#68766E] mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search medications, tests, vitals..." 
              className="search-input text-xs"
            />
          </div>

          {/* Date Indicator */}
          <div className="date-pill hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D6E1D7] text-xs font-semibold text-[#17231E]">
            <Calendar size={13} className="text-[#174B3B]" />
            <span>{todayFormatted}</span>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button 
              className="icon-btn relative p-2.5 rounded-full bg-white hover:bg-[#D6E1D7]/50 border border-[#D6E1D7] text-[#17231E] transition-all" 
              title="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-88 bg-white border border-[#D6E1D7] rounded-3xl shadow-xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#D6E1D7] mb-3">
                  <div className="flex items-center gap-2">
                    <Bell size={15} className="text-[#174B3B]" />
                    <span className="text-xs font-bold text-[#17231E]">Health Alerts</span>
                  </div>
                  <span className="text-[10px] bg-[#D6E1D7] text-[#174B3B] px-2.5 py-0.5 rounded-full font-bold">
                    2 New
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-[#EAF0E8] border border-[#D6E1D7] flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#174B3B] mt-1 shrink-0"></div>
                    <div>
                      <p className="font-bold text-[#17231E]">Medication Timing</p>
                      <p className="text-[11px] text-[#68766E] mt-0.5">Amoxicillin 500mg due with evening dinner (08:00 PM).</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E2DDD3] flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0"></div>
                    <div>
                      <p className="font-bold text-[#17231E]">Cardiology Consultation</p>
                      <p className="text-[11px] text-[#68766E] mt-0.5">Dr. Sarah Jenkins follow-up confirmed for Oct 22.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-[#D6E1D7] text-center">
                  <button 
                    onClick={() => { setShowNotifications(false); navigate('/daily-care'); }}
                    className="text-[11px] font-bold text-[#174B3B] hover:underline"
                  >
                    View All Care Tasks
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-2 rounded-full bg-white border border-[#D6E1D7] hover:bg-[#D6E1D7]/30 transition-all focus:outline-none"
            >
              {/* User Avatar Circle */}
              <div className="w-8 h-8 rounded-full bg-[#174B3B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {(user?.name || 'Aarushi').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
              </div>
              <div className="hidden sm:block text-left pr-1">
                <p className="text-xs font-bold text-[#17231E] leading-tight truncate max-w-[120px]">
                  {user?.name || 'Aarushi Thakur'}
                </p>
                <span className="text-[10px] text-[#68766E] font-medium capitalize">
                  {user?.role || 'Patient'}
                </span>
              </div>
              <ChevronDown size={14} className="text-[#68766E] hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white border border-[#D6E1D7] rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-[#D6E1D7]">
                  <p className="text-xs font-bold text-[#17231E] truncate">{user?.name || 'Aarushi Thakur'}</p>
                  <p className="text-[11px] text-[#68766E] truncate">{user?.email || 'patient@carebridge.com'}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowSettingsModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#17231E] hover:bg-[#EAF0E8] flex items-center gap-2 font-medium transition-colors"
                  >
                    <User size={15} className="text-[#174B3B]" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowSettingsModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#17231E] hover:bg-[#EAF0E8] flex items-center gap-2 font-medium transition-colors"
                  >
                    <SettingsIcon size={15} className="text-[#174B3B]" />
                    <span>Settings & Wearables</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowEmergencyModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                  >
                    <ShieldAlert size={15} className="text-red-600" />
                    <span>Emergency Support</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[#D6E1D7]">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-xs text-[#68766E] hover:text-red-700 hover:bg-red-50 flex items-center gap-2 font-semibold transition-colors"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Modals triggered from Header dropdown */}
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
      <EmergencyModal 
        isOpen={showEmergencyModal} 
        onClose={() => setShowEmergencyModal(false)} 
      />
    </>
  );
};
