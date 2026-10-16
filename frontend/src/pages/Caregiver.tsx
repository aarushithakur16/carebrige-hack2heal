import { useState } from 'react';
import { Card } from '../components/Card';
import { 
  Bell, 
  MessageSquare, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  UserPlus, 
  HeartHandshake, 
  Phone, 
  Mail, 
  Award, 
  Check,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/Button';

export const Caregiver: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverEmail, setCaregiverEmail] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [relationship, setRelationship] = useState('Family Member (Spouse)');
  const [accessLevel, setAccessLevel] = useState('Full Management Access');
  const [caregivers, setCaregivers] = useState([
    {
      id: 'cg-1',
      name: 'Jane Doe',
      relationship: 'Family Member (Spouse)',
      email: 'caregiver@carebridge.com',
      phone: '(555) 018-8291',
      access: 'Full Care Circle Access',
      avatarColor: 'bg-[#CDE8D9] text-[#163D35]',
      notifications: true
    }
  ]);
  const [invitedSuccess, setInvitedSuccess] = useState(false);
  const [messageSentTo, setMessageSentTo] = useState<string | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverName || !caregiverEmail) return;

    setCaregivers(prev => [
      ...prev,
      {
        id: 'cg-' + Date.now(),
        name: caregiverName,
        relationship,
        email: caregiverEmail,
        phone: caregiverPhone || '(555) 019-9922',
        access: accessLevel,
        avatarColor: 'bg-[#E5DDF5] text-[#442D6B]',
        notifications: true
      }
    ]);
    setShowInviteModal(false);
    setCaregiverName('');
    setCaregiverEmail('');
    setCaregiverPhone('');
    setInvitedSuccess(true);
    setTimeout(() => setInvitedSuccess(false), 4000);
  };

  const handleSendMessage = (name: string) => {
    setMessageSentTo(name);
    setTimeout(() => setMessageSentTo(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#FAF7F0] via-[#E8EFE4] to-[#CDE8D9]/40 p-6 sm:p-7 rounded-3xl border border-[#367B68]/15 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-mint flex items-center gap-1.5 font-semibold">
              <HeartHandshake size={14} className="text-[#367B68]" /> Trusted Care Circle
            </span>
            <span className="badge-sage flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#367B68]" /> HIPAA Consent Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163D35] tracking-tight">
            Caregiver Coordination Hub
          </h1>
          <p className="text-sm text-[#858B83] mt-1 max-w-2xl leading-relaxed">
            Authorize trusted family members, home health aides, and guardians to assist with medication adherence, daily recovery logging, and appointments.
          </p>
        </div>

        <Button 
          icon={UserPlus} 
          onClick={() => setShowInviteModal(true)}
          className="shadow-md hover:shadow-lg transition-all"
        >
          Invite Caregiver
        </Button>
      </div>

      {invitedSuccess && (
        <div className="p-4 bg-[#CDE8D9]/70 border border-[#367B68]/30 rounded-2xl text-[#163D35] flex items-center gap-3 text-sm animate-fade-in shadow-sm font-medium">
          <CheckCircle2 size={20} className="shrink-0 text-[#367B68]" />
          <span>Caregiver invitation issued! Verification code dispatched to their email address.</span>
        </div>
      )}

      {messageSentTo && (
        <div className="p-3 bg-[#E5DDF5] border border-[#7A64A8]/20 rounded-xl text-[#3A2859] text-xs flex items-center gap-2 animate-fade-in font-medium">
          <CheckCircle2 size={16} className="text-[#5E478C]" /> Secure notification message relayed to {messageSentTo}.
        </div>
      )}

      {/* Grid: Caregiver Roster & Activity Log */}
      <div className="grid lg:grid-cols-12 gap-7">
        {/* Caregiver Roster */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#163D35] flex items-center gap-2">
                <ShieldCheck className="text-[#367B68]" size={20} /> Authorized Caregivers ({caregivers.length})
              </h2>
              <p className="text-xs text-[#858B83]">Active members authorized to review and log care tasks</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#FAF7F0] border border-[#367B68]/15 rounded-full text-[#163D35]">
              Full Encryption
            </span>
          </div>

          <div className="space-y-4">
            {caregivers.map(cg => (
              <Card key={cg.id} className="p-5.5 hover-lift transition-all border border-[#367B68]/10 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm shrink-0 ${cg.avatarColor || 'bg-[#CDE8D9] text-[#163D35]'}`}>
                      {cg.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#163D35]">{cg.name}</h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E8EFE4] text-[#163D35] border border-[#367B68]/20">
                          {cg.relationship.includes('Spouse') ? 'Primary' : 'Delegate'}
                        </span>
                      </div>
                      <p className="text-xs text-[#858B83] mt-0.5 flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1"><Mail size={12} /> {cg.email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {cg.phone}</span>
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="badge-mint text-[11px] font-medium flex items-center gap-1">
                          <Check size={11} className="text-[#367B68]" /> {cg.access}
                        </span>
                        <span className="badge-lavender text-[11px] font-medium flex items-center gap-1">
                          <Bell size={11} className="text-[#5E478C]" /> SMS & Email Alerts
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#367B68]/10">
                    <Button 
                      variant="secondary" 
                      className="text-xs py-2 px-3.5 bg-[#FAF7F0] hover:bg-[#E8EFE4] border border-[#367B68]/20 text-[#163D35]" 
                      icon={MessageSquare}
                      onClick={() => handleSendMessage(cg.name)}
                    >
                      Message
                    </Button>
                    <span className="text-[11px] text-[#858B83] font-medium flex items-center gap-1">
                      <Clock size={11} /> Active today
                    </span>
                  </div>
                </div>
              </Card>
            ))}

            {/* Quick Helper Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF7F0] to-[#F5D8C8]/30 border border-[#F5D8C8] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F5D8C8] flex items-center justify-center text-[#743C22] shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#163D35]">Need to delegate a specialist or nurse?</p>
                <p className="text-[11px] text-[#858B83]">Temporary access tokens can be created with one-click revocation at any time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Caregiver Activity Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#163D35] flex items-center gap-2">
              <Bell className="text-[#367B68]" size={20} /> Activity & Audit Feed
            </h2>
            <p className="text-xs text-[#858B83]">Real-time synchronization of caregiver interactions</p>
          </div>

          <Card className="p-6 bg-white border border-[#367B68]/10 space-y-5">
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#CDE8D9]">
              
              <div className="relative group">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#367B68] border-2 border-white shadow-sm ring-2 ring-[#CDE8D9]" />
                <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#367B68]/10">
                  <div className="flex items-center justify-between text-[11px] text-[#858B83] font-medium mb-1">
                    <span>Jane Doe (Spouse)</span>
                    <span className="text-[#367B68] font-bold">Today, 08:30 AM</span>
                  </div>
                  <p className="text-xs text-[#29332F] font-semibold">
                    Confirmed morning <span className="text-[#367B68] font-bold underline decoration-[#CDE8D9]">Amoxicillin (500mg)</span> administered.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#7A64A8] border-2 border-white shadow-sm ring-2 ring-[#E5DDF5]" />
                <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#367B68]/10">
                  <div className="flex items-center justify-between text-[11px] text-[#858B83] font-medium mb-1">
                    <span>Jane Doe (Spouse)</span>
                    <span>Yesterday, 04:15 PM</span>
                  </div>
                  <p className="text-xs text-[#29332F] font-semibold">
                    Confirmed appointment for <span className="text-[#5E478C] font-bold">Chest X-Ray</span> at St. Jude Diagnostic.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#E58C5A] border-2 border-white shadow-sm ring-2 ring-[#F5D8C8]" />
                <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#367B68]/10">
                  <div className="flex items-center justify-between text-[11px] text-[#858B83] font-medium mb-1">
                    <span>Jane Doe (Spouse)</span>
                    <span>2 days ago, 11:00 AM</span>
                  </div>
                  <p className="text-xs text-[#29332F] font-semibold">
                    Submitted recovery check-in note on surgical site healing and pain rating (Level 2).
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-[#367B68]/10 flex items-center justify-between text-xs text-[#858B83]">
              <span className="flex items-center gap-1.5 font-medium text-[#163D35]">
                <Award size={14} className="text-[#367B68]" /> Care Circle SLA: 98% Adherence
              </span>
              <span className="underline cursor-pointer hover:text-[#163D35]">Export Log</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-[#163D35]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F0] border border-[#367B68]/20 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 animate-fade-in shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-[#367B68]/15 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#CDE8D9] flex items-center justify-center text-[#163D35]">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#163D35]">Authorize Caregiver</h3>
                  <p className="text-xs text-[#858B83]">Grant secure, authenticated care plan access</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInviteModal(false)} 
                className="text-[#858B83] hover:text-[#163D35] p-1.5 rounded-xl hover:bg-black/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#163D35] block mb-1.5">
                  Caregiver Full Name
                </label>
                <input 
                  type="text" 
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  placeholder="e.g. Robert Smith"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#367B68]/20 bg-white text-[#29332F] text-sm focus:outline-none focus:ring-2 focus:ring-[#367B68]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#163D35] block mb-1.5">
                  Email Address (For Verification Code)
                </label>
                <input 
                  type="email" 
                  value={caregiverEmail}
                  onChange={(e) => setCaregiverEmail(e.target.value)}
                  placeholder="robert@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#367B68]/20 bg-white text-[#29332F] text-sm focus:outline-none focus:ring-2 focus:ring-[#367B68]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#163D35] block mb-1.5">
                  Phone (Optional for SMS Alerts)
                </label>
                <input 
                  type="tel" 
                  value={caregiverPhone}
                  onChange={(e) => setCaregiverPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#367B68]/20 bg-white text-[#29332F] text-sm focus:outline-none focus:ring-2 focus:ring-[#367B68]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#163D35] block mb-1.5">
                  Relationship to Patient
                </label>
                <select 
                  value={relationship} 
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#367B68]/20 bg-white text-[#29332F] text-sm focus:outline-none focus:ring-2 focus:ring-[#367B68]"
                >
                  <option value="Family Member (Spouse)">Family Member (Spouse)</option>
                  <option value="Family Member (Child / Sibling)">Family Member (Child / Sibling)</option>
                  <option value="Certified Home Health Aide">Certified Home Health Aide</option>
                  <option value="Legal Healthcare Guardian">Legal Healthcare Guardian</option>
                  <option value="Close Friend / Neighbor">Close Friend / Neighbor</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#163D35] block mb-1.5">
                  Authorized Permission Tier
                </label>
                <select 
                  value={accessLevel} 
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#367B68]/20 bg-white text-[#29332F] text-sm focus:outline-none focus:ring-2 focus:ring-[#367B68]"
                >
                  <option value="Full Management Access">Full Management Access (Medications, Tasks, Records)</option>
                  <option value="Medication & Task Confirmation Only">Medication & Task Confirmation Only</option>
                  <option value="View-Only Monitoring">View-Only Monitoring</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#367B68]/15">
                <Button variant="ghost" type="button" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Dispatch Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
