import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Pill, Check, AlertCircle } from 'lucide-react';
import { getMedications } from '../services/medicationService';
import type { Medication } from '../types';

export const Medications: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    getMedications().then(setMedications);
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Medications Tracker</h1>
      <p className="text-muted mb-6">Manage and track your active prescriptions.</p>

      <div className="grid gap-4">
        {medications.map(med => (
          <Card key={med.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                <Pill size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{med.name} <span className="text-sm font-normal text-muted ml-2">{med.doseText}</span></h3>
                <p className="text-sm text-slate-300 mt-1">{med.frequency} • {med.timing}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              {med.status === 'taken' ? (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 w-full md:w-auto justify-center">
                  <Check size={18} /> Taken
                </div>
              ) : med.status === 'pending' ? (
                <Button className="w-full md:w-auto flex items-center justify-center gap-2" variant="primary">
                  <Check size={18} /> Mark Taken
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20 w-full md:w-auto justify-center">
                  <AlertCircle size={18} /> {med.status}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
