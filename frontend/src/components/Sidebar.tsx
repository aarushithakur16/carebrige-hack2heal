import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Calendar, 
  Pill, 
  Apple, 
  Moon, 
  FileText, 
  ShieldAlert, 
  Settings, 
  HeartPulse, 
  X, 
  Stethoscope, 
  Users, 
  ActivitySquare, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { getAuthUser } from '../services/api';
import { EmergencyModal } from './dashboard/EmergencyModal';
import { SettingsModal } from './dashboard/SettingsModal';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenEmergencyModal?: () => void;
  onOpenSettingsModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose,
  onOpenEmergencyModal,
  onOpenSettingsModal
}) => {
  const user = getAuthUser();
  const location = useLocation();
  const [showClinicalMenu, setShowClinicalMenu] = useState(false);
  const [internalEmergencyOpen, setInternalEmergencyOpen] = useState(false);
  const [internalSettingsOpen, setInternalSettingsOpen] = useState(false);

  const handleEmergencyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenEmergencyModal) {
      onOpenEmergencyModal();
    } else {
      setInternalEmergencyOpen(true);
    }
    if (onClose) onClose();
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenSettingsModal) {
      onOpenSettingsModal();
    } else {
      setInternalSettingsOpen(true);
    }
    if (onClose) onClose();
  };

  // Primary 9 Items Requested in Specification
  const PRIMARY_NAV = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/daily-care', label: 'Health Overview', icon: Activity },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/medications', label: 'Medications', icon: Pill },
    { path: '/daily-care?tab=nutrition', label: 'Nutrition & Wellness', icon: Apple },
    { path: '/daily-care?tab=activity', label: 'Sleep & Activity', icon: Moon },
    { path: '/documents', label: 'Medical Records', icon: FileText },
  ];

  // Secondary Clinical Continuity Items
  const CLINICAL_ITEMS = [
    { path: '/tests', label: 'Diagnostic Tests', icon: Stethoscope },
    { path: '/caregiver', label: 'Caregiver Hub', icon: Users },
    { path: '/clinician', label: 'Clinician Summary', icon: ActivitySquare },
    { path: '/verification', label: 'Prescription Verification', icon: Sparkles },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-logo">
          <div className="logo-badge">
            <HeartPulse size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none">
              <span>CareBridge</span>
            </div>
            <div className="text-[11px] text-[#96A39B] font-medium flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#174B3B] border border-[#A9BEB0]"></span>
              <span>Continuity Health</span>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose} 
              className="md:hidden p-1.5 text-[#96A39B] hover:text-white transition-colors"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Primary 9-Item Navigation */}
        <nav className="sidebar-nav">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#96A39B]/70 px-3 py-1 mb-1">
            Menu
          </div>
          
          {PRIMARY_NAV.map((item) => {
            const isActive = location.pathname === item.path.split('?')[0];
            return (
              <NavLink 
                key={item.path} 
                to={item.path}
                onClick={onClose}
                className={() => `nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}

          {/* Emergency Support Action */}
          <button
            onClick={handleEmergencyClick}
            className="nav-link text-left w-full hover:text-white"
          >
            <ShieldAlert size={18} className="text-amber-400 shrink-0" />
            <span className="truncate flex-1">Emergency Support</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>

          {/* Settings Action */}
          <button
            onClick={handleSettingsClick}
            className="nav-link text-left w-full hover:text-white"
          >
            <Settings size={18} className="shrink-0" />
            <span className="truncate">Settings</span>
          </button>

          {/* Collapsible Clinical Continuity Hub */}
          <div className="pt-3 mt-2 border-t border-[rgba(255,255,255,0.08)]">
            <button
              onClick={() => setShowClinicalMenu(!showClinicalMenu)}
              className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#96A39B] px-3 py-1.5 hover:text-white transition-colors"
            >
              <span>Clinical Continuity</span>
              {showClinicalMenu ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showClinicalMenu && (
              <div className="space-y-1 mt-1 pl-1 animate-fade-in">
                {CLINICAL_ITEMS.map((item) => (
                  <NavLink 
                    key={item.path} 
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `nav-link text-xs py-2 ${isActive ? 'active' : ''}`}
                  >
                    <item.icon size={16} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>
        
        {/* Bottom Section */}
        <div className="sidebar-footer">
          {/* Quick Care Continuity Card */}
          <div className="sidebar-wellness-card">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-[#174B3B] text-white flex items-center justify-center">
                <Sparkles size={11} />
              </div>
              <span className="text-xs font-bold text-white">Post-Op Recovery</span>
            </div>
            <p className="text-[11px] text-[#A9BEB0] leading-snug mb-2">
              Day 4 milestones active.
            </p>
            <NavLink 
              to="/daily-care" 
              onClick={onClose}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D6E1D7] hover:text-white transition-colors"
            >
              Symptom Log <ArrowUpRight size={12} />
            </NavLink>
          </div>

          {/* User Profile Mini Bar */}
          <div className="flex items-center gap-3 pt-1 px-1">
            <div className="w-8 h-8 rounded-full bg-[#174B3B] border border-[#A9BEB0]/40 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {(user?.name || 'Aarushi').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Aarushi Thakur'}</p>
              <p className="text-[10px] text-[#96A39B] truncate capitalize">{user?.role || 'Patient'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Internal Modals if triggered directly from sidebar */}
      <EmergencyModal 
        isOpen={internalEmergencyOpen} 
        onClose={() => setInternalEmergencyOpen(false)} 
      />
      <SettingsModal 
        isOpen={internalSettingsOpen} 
        onClose={() => setInternalSettingsOpen(false)} 
      />
    </>
  );
};
