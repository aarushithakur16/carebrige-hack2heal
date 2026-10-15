import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Pill, Check } from 'lucide-react';
import { getMedications, updateMedicationStatus } from '../services/medicationService';
import type { Medication } from '../types';

export const Medications: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    getMedications().then(setMedications).catch(console.error);
  }, []);

  const handleMarkTaken = async (medId: string) => {
    setUpdatingId(medId);
    try {
      await updateMedicationStatus(medId, 'TAKEN');
      setMedications(prev => prev.map(m => m.id === medId ? { ...m, status: 'taken' } : m));
    } catch (err) {
      console.error('Failed to update medication status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Medications Tracker</h1>
      <p className="text-muted mb-6">Manage and track your active prescriptions verified by your care plan.</p>

      {medications.length === 0 ? (
        <Card className="p-8 text-center text-muted">
          No active medications found. Upload a discharge summary or prescription to populate your medication schedule.
        </Card>
      ) : (
        <div className="grid gap-4">
          {medications.map(med => (
            <Card key={med.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                  <Pill size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {med.name} <span className="text-sm font-normal text-muted ml-2">{med.doseText}</span>
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">{med.frequency} • {med.timing}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                {(med.status || '').toLowerCase() === 'taken' ? (
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 w-full md:w-auto justify-center font-medium">
                    <Check size={18} /> Taken
                  </div>
                ) : (
                  <Button 
                    className="w-full md:w-auto flex items-center justify-center gap-2" 
                    variant="primary"
                    isLoading={updatingId === med.id}
                    onClick={() => handleMarkTaken(med.id)}
                  >
                    <Check size={18} /> Mark Taken
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
