import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Sparkles, User, Stethoscope, HeartHandshake, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
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
      <div className="auth-card animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-forest-green text-soft-mint mb-3 shadow-md">
            <Heart size={28} className="fill-current" />
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal tracking-tight">CareBridge</h1>
          <p className="text-xs text-muted mt-1">Healthcare Continuity & Post-Discharge Recovery</p>
        </div>

        {/* 1-Click Interactive Demo Personas for Judges */}
        <div className="mb-6 p-4 rounded-2xl bg-pale-sage/60 border border-emerald/20">
          <div className="flex items-center justify-between text-xs font-bold text-forest mb-3">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald" /> 1-Click Persona Access
            </span>
            <span className="text-[10px] uppercase tracking-wider text-emerald font-extrabold">Instant Login</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('patient')}
              className="p-3 bg-white hover:bg-soft-mint/40 rounded-xl border border-border-light hover:border-emerald transition-all flex flex-col items-center text-center group shadow-sm"
            >
              <div className="p-1.5 rounded-lg bg-soft-mint text-forest group-hover:scale-110 transition-transform mb-1">
                <User size={15} />
              </div>
              <span className="text-xs font-bold text-charcoal">Patient</span>
              <span className="text-[10px] text-muted">Aarushi T.</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('clinician')}
              className="p-3 bg-white hover:bg-muted-lavender/40 rounded-xl border border-border-light hover:border-purple-300 transition-all flex flex-col items-center text-center group shadow-sm"
            >
              <div className="p-1.5 rounded-lg bg-muted-lavender text-purple-900 group-hover:scale-110 transition-transform mb-1">
                <Stethoscope size={15} />
              </div>
              <span className="text-xs font-bold text-charcoal">Clinician</span>
              <span className="text-[10px] text-muted">Dr. Sarah</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('caregiver')}
              className="p-3 bg-white hover:bg-soft-peach/40 rounded-xl border border-border-light hover:border-orange-300 transition-all flex flex-col items-center text-center group shadow-sm"
            >
              <div className="p-1.5 rounded-lg bg-soft-peach text-orange-950 group-hover:scale-110 transition-transform mb-1">
                <HeartHandshake size={15} />
              </div>
              <span className="text-xs font-bold text-charcoal">Caregiver</span>
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
              <a href="#" className="text-xs text-emerald hover:text-forest hover-underline font-semibold">Forgot?</a>
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
        
        <div className="mt-6 pt-5 border-t border-border-light flex items-center justify-between text-xs text-muted">
          <span>Need an account?</span>
          <Link to="/register" className="text-emerald font-bold hover:text-forest hover-underline flex items-center gap-1">
            Register new patient <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted">
          <ShieldCheck size={14} className="text-emerald" />
          <span>Encrypted HIPAA-compliant clinical gateway</span>
        </div>
      </div>
    </div>
  );
};
