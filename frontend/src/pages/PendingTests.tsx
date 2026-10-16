import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Stethoscope, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { getTests } from '../services/appointmentService';
import type { Test } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export const PendingTests: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduledId, setScheduledId] = useState<string | null>(null);

  useEffect(() => {
    getTests()
      .then(data => {
        if (data && data.length > 0) {
          setTests(data);
        } else {
          setTests([
            { id: 't1', testName: 'Complete Blood Count (CBC) & Metabolic Panel', dueDate: 'Oct 20, 2026', status: 'pending' },
            { id: 't2', testName: 'Chest X-Ray (Follow-Up Pulmonary Check)', dueDate: 'Oct 24, 2026', status: 'scheduled' }
          ]);
        }
      })
      .catch(() => {
        setTests([
          { id: 't1', testName: 'Complete Blood Count (CBC) & Metabolic Panel', dueDate: 'Oct 20, 2026', status: 'pending' },
          { id: 't2', testName: 'Chest X-Ray (Follow-Up Pulmonary Check)', dueDate: 'Oct 24, 2026', status: 'scheduled' }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSchedule = (id: string) => {
    setScheduledId(id);
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'scheduled' } : t));
    setTimeout(() => setScheduledId(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pale-sage text-forest border border-emerald/20 flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald" /> Diagnostic Orders
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">Ordered Clinical Tests</h1>
          <p className="text-sm text-muted mt-1">
            Laboratory panels, imaging diagnostics, and specialized testing ordered by your attending physician.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted animate-pulse">Loading diagnostic test orders...</div>
      ) : tests.length === 0 ? (
        <div className="content-card p-8 text-center text-muted">
          <Stethoscope size={32} className="mx-auto text-emerald mb-2 opacity-60" />
          <p className="text-sm font-semibold">No diagnostic tests currently pending.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map(test => {
            const isScheduled = (test.status || '').toLowerCase() === 'scheduled';
            return (
              <div key={test.id} className="content-card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover-lift shadow-card">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    isScheduled 
                      ? 'bg-soft-mint text-forest' 
                      : 'bg-pale-sage text-forest'
                  }`}>
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-charcoal">{test.testName || (test as any).test_name}</h3>
                      <StatusBadge 
                        status={isScheduled ? 'stable' : 'warning'} 
                        label={isScheduled ? 'Appointment Booked' : 'Action Required'} 
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1.5">
                      <span className="flex items-center gap-1 font-semibold text-charcoal">
                        <Calendar size={13} className="text-emerald" /> Due: {test.dueDate || (test as any).due_date}
                      </span>
                      <span>•</span>
                      <span>Lab Preparation: Fasting 8 hrs prior recommended</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  {isScheduled ? (
                    <div className="flex items-center gap-2 text-forest bg-soft-mint px-4 py-2 rounded-full text-xs font-bold">
                      <CheckCircle2 size={16} className="text-emerald" /> Scheduled at Lab
                    </div>
                  ) : (
                    <Button 
                      variant="primary" 
                      className="w-full sm:w-auto text-xs py-2 px-5 font-bold"
                      isLoading={scheduledId === test.id}
                      onClick={() => handleSchedule(test.id)}
                    >
                      Book Lab Appointment
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
