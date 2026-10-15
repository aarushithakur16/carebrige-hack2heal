import { useState } from 'react';
import { Card } from '../components/Card';
import { Users, Bell, MessageSquare, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

export const Caregiver: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverEmail, setCaregiverEmail] = useState('');
  const [relationship, setRelationship] = useState('Family Member');
  const [caregivers, setCaregivers] = useState([
    {
      id: 'cg-1',
      name: 'Jane Doe',
      relationship: 'Family Member',
      access: 'Full Access',
      notifications: true
    }
  ]);
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverName || !caregiverEmail) return;

    setCaregivers(prev => [
      ...prev,
      {
        id: 'cg-' + Date.now(),
        name: caregiverName,
        relationship,
        access: 'Full Access',
        notifications: true
      }
    ]);
    setShowInviteModal(false);
    setCaregiverName('');
    setCaregiverEmail('');
    setInvitedSuccess(true);
    setTimeout(() => setInvitedSuccess(false), 3500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Caregiver Hub</h1>
          <p className="text-muted">Coordinate care and manage verified permissions for your trusted support network.</p>
        </div>
        <Button icon={Users} onClick={() => setShowInviteModal(true)}>
          Invite Caregiver
        </Button>
      </div>

      {invitedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={20} />
          <span>Caregiver invitation sent! They have been added to your authorized care circle.</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" /> Active Caregivers ({caregivers.length})
            </h3>
          </div>
          <div className="space-y-3">
            {caregivers.map(cg => (
              <div key={cg.id} className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-white">{cg.name}</p>
                  <p className="text-sm text-muted">{cg.relationship}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      {cg.access}
                    </span>
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                      Notifications Active
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" icon={MessageSquare}>Message</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Bell className="text-primary" /> Recent Caregiver Activity
          </h3>
          <div className="space-y-4">
            <div className="border-l-2 border-primary pl-4 pb-2">
              <p className="text-sm text-muted">Today, 08:30 AM</p>
              <p className="font-semibold text-white">Jane Doe confirmed <span className="text-primary">Amoxicillin</span> taken.</p>
            </div>
            <div className="border-l-2 border-slate-600 pl-4 pb-2">
              <p className="text-sm text-muted">Yesterday, 04:15 PM</p>
              <p className="font-semibold text-white">Jane Doe confirmed <span className="text-primary">Chest X-Ray</span> scheduled for Oct 24.</p>
            </div>
            <div className="border-l-2 border-slate-700 pl-4 pb-2">
              <p className="text-sm text-muted">2 days ago, 11:00 AM</p>
              <p className="font-semibold text-white">Jane Doe logged daily check-in notes on patient recovery.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold">Invite New Caregiver</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  placeholder="e.g. Robert Smith"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={caregiverEmail}
                  onChange={(e) => setCaregiverEmail(e.target.value)}
                  placeholder="robert@example.com"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Relationship</label>
                <select 
                  value={relationship} 
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg p-2.5 text-sm"
                >
                  <option value="Family Member">Family Member</option>
                  <option value="Nurse / Home Aide">Nurse / Home Aide</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Friend">Friend</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button variant="ghost" type="button" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
