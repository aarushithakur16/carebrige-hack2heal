import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { register } from '../services/authService';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirm: '', role: 'PATIENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirm) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await register(formData.name, formData.email, formData.password, formData.role.toUpperCase(), formData.phone);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container py-12">
      <div className="auth-card animate-fade-in" style={{ maxWidth: '490px' }}>
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-forest-green text-soft-mint mb-3 shadow-md">
            <Heart size={28} className="fill-current" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-charcoal">Create Your Patient Account</h1>
          <p className="text-xs text-muted mt-1">Join the CareBridge post-discharge continuity portal</p>
        </div>
        
        {error && (
          <div className="error-banner animate-fade-in flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="input-group">
            <label>Full Legal Name</label>
            <div className="input-with-icon">
              <User size={17} className="input-icon" />
              <input 
                name="name" 
                type="text" 
                value={formData.name}
                onChange={handleChange} 
                placeholder="Aarushi Thakur" 
                className="form-input" 
                required 
              />
            </div>
          </div>
          
          <div className="grid-2-col">
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={17} className="input-icon" />
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange} 
                  placeholder="patient@carebridge.com" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Contact Phone</label>
              <div className="input-with-icon">
                <Phone size={17} className="input-icon" />
                <input 
                  name="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={handleChange} 
                  placeholder="(555) 019-2834" 
                  className="form-input" 
                />
              </div>
            </div>
          </div>
          
          <div className="input-group">
            <label>Primary Account Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              className="form-input"
            >
              <option value="PATIENT">Patient (Receiving Care)</option>
              <option value="CAREGIVER">Caregiver (Family / Health Aide)</option>
              <option value="CLINICIAN">Clinician (Physician / Nurse)</option>
            </select>
          </div>
          
          <div className="grid-2-col">
            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={17} className="input-icon" />
                <input 
                  name="password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={17} className="input-icon" />
                <input 
                  name="confirm" 
                  type="password" 
                  value={formData.confirm}
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  className="form-input" 
                  required 
                />
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-3 py-3" disabled={loading} icon={ArrowRight}>
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </form>
        
        <div className="mt-6 pt-5 border-t border-border-light flex items-center justify-between text-xs text-muted">
          <span>Already registered?</span>
          <Link to="/login" className="text-emerald font-bold hover:text-forest hover-underline flex items-center gap-1">
            Sign in here <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted">
          <ShieldCheck size={14} className="text-emerald" />
          <span>Patient data protected under HIPAA compliance guidelines</span>
        </div>
      </div>
    </div>
  );
};
