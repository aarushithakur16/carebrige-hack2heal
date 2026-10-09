import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Basic mock auth check
    const auth = localStorage.getItem('cb_auth');
    if (!auth) {
      navigate('/login');
    } else if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate, location.pathname]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="main-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
