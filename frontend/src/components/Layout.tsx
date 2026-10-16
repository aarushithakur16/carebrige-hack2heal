import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Auth check
    const auth = localStorage.getItem('cb_auth');
    if (!auth) {
      navigate('/login');
    } else if (location.pathname === '/') {
      navigate('/dashboard');
    }
    // Close mobile sidebar on navigation
    setSidebarOpen(false);
  }, [navigate, location.pathname]);

  return (
    <div className="app-layout">
      {/* Mobile backdrop overlay */}
      <div 
        className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-wrapper">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
        <main className="main-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
