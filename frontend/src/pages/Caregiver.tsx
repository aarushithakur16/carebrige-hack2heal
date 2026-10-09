import React from 'react';
import { Card } from '../components/Card';
import { Users, Bell, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';

export const Caregiver: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Caregiver Hub</h1>
          <p className="text-muted">Coordinate care and manage permissions for your support network.</p>
        </div>
        <Button icon={Users}>Invite Caregiver</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="text-emerald-400"/> Active Caregivers</h3>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">Jane Doe</p>
              <p className="text-sm text-muted">Family Member</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">Full Access</span>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">Notifications On</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" icon={MessageSquare}>Message</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell className="text-primary"/> Recent Caregiver Activity</h3>
          <div className="space-y-4">
            <div className="border-l-2 border-primary pl-4 pb-2">
              <p className="text-sm text-muted">Today, 08:30 AM</p>
              <p className="font-semibold">Jane Doe marked <span className="text-primary">Amoxicillin</span> as taken.</p>
            </div>
            <div className="border-l-2 border-slate-600 pl-4 pb-2">
              <p className="text-sm text-muted">Yesterday, 04:15 PM</p>
              <p className="font-semibold">Jane Doe scheduled <span className="text-primary">Chest X-Ray</span> for Oct 14.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
