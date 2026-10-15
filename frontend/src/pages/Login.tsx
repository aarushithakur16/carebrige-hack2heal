import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ActivitySquare, Lock, Mail, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { login } from '../services/authService';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginWithCreds = async (eMail: string, pWord: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await login(eMail, pWord);
      localStorage.setItem('cb_auth', JSON.stringify({ token: response.token, user: response.user }));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    handleLoginWithCreds(email, password);
  };

  const handleDemoLogin = (role: 'patient' | 'clinician' | 'caregiver') => {
    const demoEmail = `${role}@carebridge.com`;
    setEmail(demoEmail);
    setPassword('password123');
    handleLoginWithCreds(demoEmail, 'password123');
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header text-center mb-8">
          <div className="flex-center mb-4 text-primary">
            <ActivitySquare size={48} />
          </div>
          <h1 className="text-2xl font-bold">Welcome to CareBridge</h1>
          <p className="text-muted mt-2">Sign in to your healthcare continuity portal</p>
        </div>

        {/* Quick Demo Access */}
        <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
            <Sparkles size={14} /> 1-Click Demo Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('patient')}
              className="px-2 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-white/10 transition-colors font-medium"
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('clinician')}
              className="px-2 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-white/10 transition-colors font-medium"
            >
              Clinician
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('caregiver')}
              className="px-2 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-white/10 transition-colors font-medium"
            >
              Caregiver
            </button>
          </div>
        </div>
        
        {error && <div className="error-banner mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form flex flex-col gap-4">
          <div className="input-group">
            <label>Email Address</label>
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
              <label>Password</label>
              <a href="#" className="text-xs text-primary hover-underline">Forgot password?</a>
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
            <input type="checkbox" id="remember" className="checkbox-custom" defaultChecked />
            <label htmlFor="remember" className="text-sm text-muted">Remember me for 30 days</label>
          </div>
          
          <Button type="submit" className="w-full mt-4 py-3" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover-underline">Register here</Link>
        </div>
      </div>
    </div>
  );
};
