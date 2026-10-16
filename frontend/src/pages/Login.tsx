import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ActivitySquare, Lock, Mail, Sparkles, User, Stethoscope, HeartHandshake, ArrowRight, ShieldCheck } from 'lucide-react';
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
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both your email address and password');
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
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-900/40 border border-teal-400/30 text-teal-300 mb-3 shadow-lg shadow-teal-500/10">
            <ActivitySquare size={34} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CareBridge</h1>
          <p className="text-xs text-muted mt-1">Healthcare Continuity & Post-Discharge Recovery</p>
        </div>

        {/* 1-Click Interactive Demo Personas for Judges */}
        <div className="mb-6 p-3.5 bg-teal-950/40 border border-teal-500/25 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-semibold text-teal-300 mb-2.5 px-0.5">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-teal-300" /> 1-Click Persona Login
            </span>
            <span className="text-[10px] text-teal-400/70 font-normal uppercase tracking-wider">Demo Ready</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('patient')}
              className="p-2.5 bg-slate-900/80 hover:bg-teal-900/30 rounded-xl border border-teal-500/20 hover:border-teal-400/50 transition-all flex flex-col items-center text-center group"
            >
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-300 group-hover:scale-110 transition-transform mb-1">
                <User size={15} />
              </div>
              <span className="text-xs font-semibold text-white">Patient</span>
              <span className="text-[10px] text-muted">Aarushi T.</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('clinician')}
              className="p-2.5 bg-slate-900/80 hover:bg-teal-900/30 rounded-xl border border-teal-500/20 hover:border-teal-400/50 transition-all flex flex-col items-center text-center group"
            >
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 group-hover:scale-110 transition-transform mb-1">
                <Stethoscope size={15} />
              </div>
              <span className="text-xs font-semibold text-white">Clinician</span>
              <span className="text-[10px] text-muted">Dr. Sarah</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('caregiver')}
              className="p-2.5 bg-slate-900/80 hover:bg-teal-900/30 rounded-xl border border-teal-500/20 hover:border-teal-400/50 transition-all flex flex-col items-center text-center group"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 group-hover:scale-110 transition-transform mb-1">
                <HeartHandshake size={15} />
              </div>
              <span className="text-xs font-semibold text-white">Caregiver</span>
              <span className="text-[10px] text-muted">Jane Doe</span>
            </button>
          </div>
        </div>
        
        {error && (
          <div className="error-banner animate-fade-in flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={17} className="input-icon" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@carebridge.com" 
                className="form-input"
                autoComplete="email"
              />
            </div>
          </div>
          
          <div className="input-group">
            <div className="flex justify-between items-center mb-1">
              <label>Password</label>
              <a href="#" className="text-xs text-teal-400 hover:text-teal-300 hover-underline">Forgot?</a>
            </div>
            <div className="input-with-icon">
              <Lock size={17} className="input-icon" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="form-input"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input type="checkbox" id="remember" className="checkbox-custom" defaultChecked />
            <label htmlFor="remember" className="text-xs text-muted cursor-pointer">Remember session for 30 days</label>
          </div>
          
          <Button type="submit" className="w-full mt-3 py-3" disabled={loading} icon={ArrowRight}>
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </Button>
        </form>
        
        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-muted">
          <span>Need an account?</span>
          <Link to="/register" className="text-teal-400 font-semibold hover:text-teal-300 hover-underline flex items-center gap-1">
            Register new patient <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted/60">
          <ShieldCheck size={13} className="text-emerald-400/80" />
          <span>Encrypted HIPAA-compliant clinical gateway</span>
        </div>
      </div>
    </div>
  );
};
