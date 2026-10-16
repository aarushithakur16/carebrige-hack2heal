import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { getAuthUser } from '../services/api';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = () => {
    localStorage.removeItem('cb_auth');
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AT';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const roleName = user?.role || 'PATIENT';

  return (
    <header className="app-header glass-panel">
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
        
        <div className="header-search">
          <Search size={18} className="text-muted mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Search medications, tasks, clinical notes..." 
            className="search-input"
          />
        </div>
      </div>
      
      <div className="header-actions">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-medium">
          <Sparkles size={13} />
          <span>Real-time Sync Active</span>
        </div>

        <button className="icon-btn relative" title="Notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile">
          <div className="user-avatar-badge">
            {getInitials(user?.name)}
          </div>
          <div className="hidden md:block">
            <p className="user-name">{user?.name || 'Aarushi Thakur'}</p>
            <span className="user-role-badge">
              {roleName}
            </span>
          </div>
          <button 
            onClick={handleLogout} 
            className="icon-btn ml-1 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20" 
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
