import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Pill, Check, Clock, Sparkles, Sun, Moon, Sunrise } from 'lucide-react';
import { getMedications, updateMedicationStatus } from '../services/medicationService';
import type { Medication } from '../types';

export const Medications: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'taken'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMedications()
      .then(setMedications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMarkTaken = async (medId: string) => {
    setUpdatingId(medId);
    // Optimistic UI update
    setMedications(prev => prev.map(m => m.id === medId ? { ...m, status: 'taken' } : m));
    try {
      await updateMedicationStatus(medId, 'TAKEN');
    } catch (err) {
      console.error('Failed to update medication status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const totalMeds = medications.length;
  const takenMeds = medications.filter(m => (m.status || '').toLowerCase() === 'taken').length;
  const pendingMeds = totalMeds - takenMeds;
  const adherenceRate = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 100;

  const filteredMeds = medications.filter(med => {
    const isTaken = (med.status || '').toLowerCase() === 'taken';
    if (activeFilter === 'pending') return !isTaken;
    if (activeFilter === 'taken') return isTaken;
    return true;
  });

  const getTimingIcon = (timing?: string) => {
    const t = (timing || '').toLowerCase();
    if (t.includes('morning')) return <Sunrise size={16} className="text-amber-500" />;
    if (t.includes('evening') || t.includes('night') || t.includes('bed')) return <Moon size={16} className="text-purple-600" />;
    if (t.includes('afternoon')) return <Sun size={16} className="text-orange-500" />;
    return <Clock size={16} className="text-[#0F172A]" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#5B21B6] border border-[#C4B5FD]/40 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#5B21B6]" /> Active Prescription Schedule
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">Medications & Prescriptions</h1>
          <p className="text-sm text-muted mt-1">
            Confirmed prescriptions from your hospital discharge summary. Log doses to maintain continuity.
          </p>
        </div>
      </div>

      {/* Adherence Progress Card */}
      <div className="content-card p-6 sm:p-7 bg-[#F8FAFC] border border-[#E2E8F0] shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Today's Adherence Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-[#0F172A]">{adherenceRate}%</span>
              <span className="text-xs text-muted font-medium">({takenMeds} of {totalMeds} doses recorded)</span>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <div className="w-full bg-[#E2E8F0] rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-[#0F172A] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${adherenceRate}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-muted mt-1.5 font-bold">
              <span>{pendingMeds} Pending</span>
              <span className="text-[#166534]">{takenMeds} Confirmed Taken</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-border-light pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A] bg-white border border-[#E2E8F0]'
            }`}
          >
            All Medications ({totalMeds})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'pending'
                ? 'bg-[#FEF9C3] text-[#854D0E] border border-[#FDE047]/40 shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A] bg-white border border-[#E2E8F0]'
            }`}
          >
            Pending Intake ({pendingMeds})
          </button>
          <button
            onClick={() => setActiveFilter('taken')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'taken'
                ? 'bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]/40 shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A] bg-white border border-[#E2E8F0]'
            }`}
          >
            Completed ({takenMeds})
          </button>
        </div>
      </div>

      {/* Medications List */}
      {loading ? (
        <div className="p-12 text-center text-muted animate-pulse">Loading prescription records...</div>
      ) : filteredMeds.length === 0 ? (
        <div className="content-card p-8 text-center text-muted">
          <Pill size={32} className="mx-auto text-[#0F172A] mb-2 opacity-60" />
          <p className="text-sm font-semibold">No medications match the selected filter.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMeds.map(med => {
            const isTaken = (med.status || '').toLowerCase() === 'taken';
            return (
              <div 
                key={med.id} 
                className={`content-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover-lift ${
                  isTaken ? 'bg-[#DCFCE7]/25 border-[#86EFAC]/40' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    isTaken 
                      ? 'bg-[#DCFCE7] text-[#166534]' 
                      : 'bg-[#EDE9FE] text-[#5B21B6]'
                  }`}>
                    <Pill size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-charcoal">{med.name}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] font-bold">
                        {med.doseText || (med as any).dose_text || 'Standard Dose'}
                      </span>
                      {isTaken && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]/40 font-bold">
                          Taken Today
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1.5">
                      <span className="font-semibold text-charcoal">{med.frequency}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                        {getTimingIcon(med.timing)} {med.timing}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  {isTaken ? (
                    <div className="flex items-center gap-2 text-[#166534] bg-[#DCFCE7] border border-[#86EFAC]/40 px-4 py-2 rounded-full font-bold text-xs">
                      <Check size={16} strokeWidth={3} /> Dose Confirmed
                    </div>
                  ) : (
                    <Button 
                      className="w-full md:w-auto font-bold text-xs py-2 px-5" 
                      variant="primary"
                      isLoading={updatingId === med.id}
                      icon={Check}
                      onClick={() => handleMarkTaken(med.id)}
                    >
                      Confirm Dose Taken
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
