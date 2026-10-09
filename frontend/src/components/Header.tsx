import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('cb_auth');
    navigate('/login');
  };

  return (
    <header className="app-header glass-panel">
      <div className="header-search">
        <Search size={20} className="text-muted mr-2" />
        <input 
          type="text" 
          placeholder="Search patients, records, or documents..." 
          className="search-input"
        />
      </div>
      
      <div className="header-actions">
        <button className="icon-btn relative">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile">
          <UserCircle size={32} className="text-primary" />
          <div className="user-info">
            <p className="user-name">Demo User</p>
            <p className="user-role">Role: Simulated</p>
          </div>
          <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
