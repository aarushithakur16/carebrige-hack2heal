
import { useState, useEffect } from 'react';
import type {  FollowUpSummary  } from '../types';
import { getFollowUpSummary } from '../services/summaryService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AlertTriangle, ActivitySquare, FileText, CheckCircle2 } from 'lucide-react';

import { getAuthUser } from '../services/api';

export const ClinicianSummary: React.FC = () => {
  const [summary, setSummary] = useState<FollowUpSummary | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    if (user?.id) {
      getFollowUpSummary(user.id).then(setSummary).catch(console.error);
    }
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1500);
  };

  if (!summary) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clinician Follow-Up Summary</h1>
          <p className="text-muted">Review patient progress and adherence.</p>
        </div>
        <Button onClick={handleGenerate} isLoading={generating} icon={FileText}>
          Generate Summary
        </Button>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex gap-3 text-amber-500 text-sm mb-6">
        <AlertTriangle size={20} className="shrink-0" />
        <p><strong>Disclaimer:</strong> CareBridge organizes reported information and does not diagnose or prescribe. Do not use this as a substitute for professional medical judgment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ActivitySquare size={20}/> Adherence Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted">Care Period</span>
              <span className="font-semibold">{summary.carePeriod}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted">Adherence Score</span>
              <span className="font-bold text-emerald-400">{summary.adherenceScore}%</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted">Completed Tasks</span>
              <span className="font-semibold text-emerald-400">{summary.completedTasks}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted">Missed Tasks</span>
              <span className="font-semibold text-red-400">{summary.missedTasks}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted">Delayed Tasks</span>
              <span className="font-semibold text-amber-400">{summary.delayedTasks}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Patient Notes</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg text-sm leading-relaxed border border-white/5">
            {summary.notes || "No notes provided by the patient."}
          </div>
          
          <div className="mt-6 flex items-center gap-2 text-emerald-500 text-sm font-semibold">
            <CheckCircle2 size={16} /> Data compiled successfully
          </div>
        </Card>
      </div>
    </div>
  );
};
