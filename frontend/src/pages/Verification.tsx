import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2 } from 'lucide-react';
import type { Medication } from '../types';

export const Verification: React.FC = () => {
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success'>('pending');

  const mockExtractedMeds: Partial<Medication>[] = [
    { name: 'Amoxicillin', doseText: '500mg', frequency: 'Twice daily', timing: 'Morning and Evening' }
  ];

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStatus('success');
      // Simulate navigating back to dashboard after verification completes
      setTimeout(() => navigate('/dashboard'), 2000);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-2">Verify Extracted Data</h1>
      <p className="text-muted">Review the data extracted from your document. Correct any mistakes before saving it to your active care plan.</p>

      {status === 'success' ? (
        <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-4" />
          <h2 className="text-xl font-bold text-emerald-400 mb-2">Verification Complete!</h2>
          <p className="text-muted">Your active care plan has been updated.</p>
          <p className="text-sm text-muted mt-4">Redirecting to Dashboard...</p>
        </div>
      ) : (
        <>
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText size={20}/> Extracted Medications</h3>
            <div className="space-y-4">
              {mockExtractedMeds.map((med, idx) => (
                <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-lg">{med.name}</h4>
                    <p className="text-sm text-muted">{med.doseText} • {med.frequency}</p>
                    <p className="text-xs text-primary mt-1">{med.timing}</p>
                  </div>
                  <Button variant="secondary">Edit</Button>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end gap-4 mt-8">
            <Button variant="ghost" onClick={() => navigate('/documents')}>Cancel</Button>
            <Button onClick={handleVerify} isLoading={verifying}>Confirm & Save to Care Plan</Button>
          </div>
        </>
      )}
    </div>
  );
};
