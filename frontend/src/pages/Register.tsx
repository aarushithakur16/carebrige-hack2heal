import React, { useState } from 'react';
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
          <div className="flex-center mb-4 text-primary">
            <ActivitySquare size={40} />
          </div>
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted mt-2">Join CareBridge for seamless healthcare continuity</p>
        </div>
        
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form flex flex-col gap-4">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input name="name" type="text" onChange={handleChange} placeholder="Jane Doe" className="form-input" />
            </div>
          </div>
          
          <div className="grid-2-col gap-4 flex">
            <div className="input-group flex-1">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input name="email" type="email" onChange={handleChange} placeholder="jane@example.com" className="form-input" />
              </div>
            </div>
            
            <div className="input-group flex-1">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input name="phone" type="tel" onChange={handleChange} placeholder="(555) 123-4567" className="form-input" />
              </div>
            </div>
          </div>
          
          <div className="input-group">
            <label>I am a...</label>
            <select name="role" onChange={handleChange} className="form-input pl-3">
              <option value="Patient">Patient</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Clinician">Clinician</option>
            </select>
          </div>
          
          <div className="grid-2-col gap-4 flex">
            <div className="input-group flex-1">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input name="password" type="password" onChange={handleChange} placeholder="••••••••" className="form-input" />
              </div>
            </div>
            
            <div className="input-group flex-1">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input name="confirm" type="password" onChange={handleChange} placeholder="••••••••" className="form-input" />
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4 py-3">Create Account</Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="text-primary font-medium hover-underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};
