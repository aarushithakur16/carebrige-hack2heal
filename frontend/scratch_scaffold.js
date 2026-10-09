import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'src');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(path.join(src, 'components'));
ensureDir(path.join(src, 'pages'));

const files = {
  'components/Button.tsx': `import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: LucideIcon;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseClass = 'btn flex items-center justify-center gap-2';
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  };

  return (
    <button 
      className={\`\${baseClass} \${variants[variant]} \${className}\`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="loader"></span> : Icon && <Icon size={18} />}
      {children}
    </button>
  );
};
`,
  'components/Card.tsx': `import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={\`glass-panel \${onClick ? 'cursor-pointer hover-lift' : ''} \${className}\`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
`,
  'components/StatusBadge.tsx': `import React from 'react';

interface StatusBadgeProps {
  status: 'critical' | 'stable' | 'warning' | 'info' | 'success';
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  return (
    <span className={\`status-badge status-\${status}\`}>
      {label}
    </span>
  );
};
`,
  'components/EmptyState.tsx': `import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="empty-state glass-panel flex flex-col items-center justify-center text-center p-8">
      <div className="empty-state-icon mb-4">
        <Icon size={48} className="text-muted" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted mb-6 max-w-md">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
`,
  'components/Sidebar.tsx': `import React from 'react';
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
            className={({ isActive }) => \`nav-link \${isActive ? 'active' : ''}\`}
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
`,
  'components/Header.tsx': `import React from 'react';
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
      <div className="header-search flex items-center">
        <Search size={20} className="text-muted mr-2" />
        <input 
          type="text" 
          placeholder="Search patients, records, or documents..." 
          className="search-input"
        />
      </div>
      
      <div className="header-actions flex items-center gap-4">
        <button className="icon-btn relative">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile flex items-center gap-3 border-l border-white/10 pl-4">
          <UserCircle size={32} className="text-primary" />
          <div className="user-info hidden md:block">
            <p className="text-sm font-semibold">Demo User</p>
            <p className="text-xs text-muted">Role: Simulated</p>
          </div>
          <button onClick={handleLogout} className="icon-btn text-muted hover:text-red-400 ml-2" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
`,
  'components/Layout.tsx': `import React, { useEffect } from 'react';
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
`,
  'pages/Login.tsx': `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ActivitySquare, Lock, Mail } from 'lucide-react';
import { Button } from '../components/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Mock Authentication
    localStorage.setItem('cb_auth', JSON.stringify({ email, role: 'patient' }));
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header text-center mb-8">
          <div className="flex justify-center mb-4">
            <ActivitySquare size={48} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted mt-2">Sign in to your CareBridge account</p>
        </div>
        
        {error && <div className="error-banner mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form flex flex-col gap-4">
          <div className="input-group">
            <label className="text-sm font-medium mb-1 block">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="form-input"
              />
            </div>
          </div>
          
          <div className="input-group">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium block">Password</label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="form-input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="remember" className="checkbox-custom" />
            <label htmlFor="remember" className="text-sm text-muted">Remember me for 30 days</label>
          </div>
          
          <Button type="submit" className="w-full mt-4 py-3">Sign In</Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
};
`,
  'pages/Register.tsx': `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ActivitySquare, User, Mail, Phone, Lock } from 'lucide-react';
import { Button } from '../components/Button';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirm: '', role: 'Patient'
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirm) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match');
      return;
    }
    
    // Mock Authentication
    localStorage.setItem('cb_auth', JSON.stringify({ email: formData.email, role: formData.role.toLowerCase() }));
    navigate('/dashboard');
  };

  return (
    <div className="auth-container py-12">
      <div className="auth-card glass-panel animate-fade-in" style={{ maxWidth: '500px' }}>
        <div className="auth-header text-center mb-8">
          <div className="flex justify-center mb-4">
            <ActivitySquare size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted mt-2">Join CareBridge for seamless healthcare continuity</p>
        </div>
        
        {error && <div className="error-banner mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form flex flex-col gap-4">
          <div className="input-group">
            <label className="text-sm font-medium mb-1 block">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input name="name" type="text" onChange={handleChange} placeholder="Jane Doe" className="form-input" />
            </div>
          </div>
          
          <div className="grid-2-col gap-4 flex">
            <div className="input-group flex-1">
              <label className="text-sm font-medium mb-1 block">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input name="email" type="email" onChange={handleChange} placeholder="jane@example.com" className="form-input" />
              </div>
            </div>
            
            <div className="input-group flex-1">
              <label className="text-sm font-medium mb-1 block">Phone Number</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input name="phone" type="tel" onChange={handleChange} placeholder="(555) 123-4567" className="form-input" />
              </div>
            </div>
          </div>
          
          <div className="input-group">
            <label className="text-sm font-medium mb-1 block">I am a...</label>
            <select name="role" onChange={handleChange} className="form-input pl-3">
              <option value="Patient">Patient</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Clinician">Clinician</option>
            </select>
          </div>
          
          <div className="grid-2-col gap-4 flex">
            <div className="input-group flex-1">
              <label className="text-sm font-medium mb-1 block">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input name="password" type="password" onChange={handleChange} placeholder="••••••••" className="form-input" />
              </div>
            </div>
            
            <div className="input-group flex-1">
              <label className="text-sm font-medium mb-1 block">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input name="confirm" type="password" onChange={handleChange} placeholder="••••••••" className="form-input" />
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4 py-3">Create Account</Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};
`,
  'App.tsx': `import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="documents" element={<div className="p-8"><h1 className="text-2xl font-bold">Documents</h1><p className="text-muted mt-2">Mock Page content goes here</p></div>} />
          <Route path="medications" element={<div className="p-8"><h1 className="text-2xl font-bold">Medications</h1><p className="text-muted mt-2">Mock Page content goes here</p></div>} />
          <Route path="appointments" element={<div className="p-8"><h1 className="text-2xl font-bold">Appointments</h1><p className="text-muted mt-2">Mock Page content goes here</p></div>} />
          <Route path="tests" element={<div className="p-8"><h1 className="text-2xl font-bold">Pending Tests</h1><p className="text-muted mt-2">Mock Page content goes here</p></div>} />
          <Route path="daily-care" element={<div className="p-8"><h1 className="text-2xl font-bold">Daily Care</h1><p className="text-muted mt-2">Mock Page content goes here</p></div>} />
          <Route path="caregiver" element={<div className="p-8"><h1 className="text-2xl font-bold">Caregiver</h1><p className="text-muted mt-2">Mock Page content goes here</p></div>} />
          <Route path="clinician" element={<div className="p-8"><h1 className="text-2xl font-bold">Clinician Summary</h1><p className="text-muted mt-2">Mock Page content goes here</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
`
};

for (const [relativePath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(src, relativePath), content);
  console.log(\`Written \${relativePath}\`);
}
