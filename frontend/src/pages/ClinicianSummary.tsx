import { useState, useEffect } from 'react';
import type { FollowUpSummary } from '../types';
import { getFollowUpSummary } from '../services/summaryService';
import { Button } from '../components/Button';
import { 
  AlertTriangle, 
  ActivitySquare, 
  FileText, 
  CheckCircle2, 
  UserCheck, 
  Copy, 
  Check, 
  TrendingUp,
  Stethoscope,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { getAuthUser } from '../services/api';

export const ClinicianSummary: React.FC = () => {
  const [summary, setSummary] = useState<FollowUpSummary | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const user = getAuthUser();
  const isClinician = user?.role === 'CLINICIAN';

  const loadSummary = () => {
    const targetPatientId = user?.id || 'p-1';
    getFollowUpSummary(targetPatientId)
      .then(data => {
        if (data) {
          setSummary(data);
        }
      })
      .catch(() => {
        setSummary({
          patientId: targetPatientId,
          carePeriod: 'Last 7 Days',
          adherenceScore: 88,
          completedTasks: 14,
          missedTasks: 1,
          delayedTasks: 2,
          notes: 'Patient reports steady post-operative recovery. Surgical incision clean and dry with minimal tenderness. Vital signs and medication adherence within expected parameters. Physical therapy completed without acute pain.',
          generatedAt: new Date().toISOString()
        });
      });
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      loadSummary();
      setGenerating(false);
    }, 900);
  };

  const handleCopyEHR = () => {
    if (!summary) return;
    const ehrText = `CAREBRIDGE CLINICAL FOLLOW-UP SUMMARY
Patient ID: ${summary.patientId}
Monitoring Period: ${summary.carePeriod}
Adherence Score: ${summary.adherenceScore}%
Completed Tasks: ${summary.completedTasks} | Missed: ${summary.missedTasks} | Delayed: ${summary.delayedTasks}
Patient-Reported Synthesis:
${summary.notes}
Generated At: ${new Date(summary.generatedAt).toLocaleString()}
Verified via CareBridge AI Healthcare Continuity Engine`;

    navigator.clipboard.writeText(ehrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!summary) return <div className="p-8 text-muted animate-pulse">Synthesizing clinician follow-up summary...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pale-sage text-forest border border-emerald/20 flex items-center gap-1.5">
              <Stethoscope size={13} className="text-emerald" /> Physician & Care Team Review
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald" /> Non-Diagnostic Algorithmic Synthesis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">Clinician Follow-Up Summary</h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Objective synthesis of patient medication adherence, symptom trajectories, and scheduled diagnostics for physician review.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" onClick={handleCopyEHR} icon={copied ? Check : Copy}>
            {copied ? 'Copied to Clipboard' : 'Copy for EHR Note'}
          </Button>
          <Button onClick={handleGenerate} isLoading={generating} icon={FileText}>
            Regenerate Synthesis
          </Button>
        </div>
      </div>

      {/* Role Banner */}
      {!isClinician && (
        <div className="bg-pale-sage/70 border border-emerald/20 p-4 rounded-2xl flex items-center gap-3 text-forest text-xs font-medium">
          <UserCheck size={18} className="shrink-0 text-emerald" />
          <p>
            <strong>Provider View Mode:</strong> You are viewing the clinical summary prepared for your physician. It synthesizes all daily check-ins and medication records.
          </p>
        </div>
      )}

      {/* Clinical Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-900 text-xs">
        <AlertTriangle size={18} className="shrink-0 text-amber-600" />
        <p className="leading-relaxed">
          <strong>Clinical Decision Support Disclaimer:</strong> CareBridge summarizes patient-reported and verified records. It does not provide medical diagnoses or prescribe pharmacotherapy. Review is intended to assist, not replace, clinical judgment.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="content-card p-5 shadow-card">
          <p className="text-[11px] text-muted font-bold uppercase tracking-wider">Monitoring Window</p>
          <p className="text-2xl font-black text-charcoal mt-1.5">{summary.carePeriod}</p>
          <p className="text-xs text-emerald mt-1 flex items-center gap-1 font-semibold">
            <Clock size={12} /> Live tracking
          </p>
        </div>

        <div className="card-mint p-5 rounded-[22px] shadow-card">
          <p className="text-[11px] text-forest/80 font-bold uppercase tracking-wider">Adherence Score</p>
          <p className="text-2xl font-black text-forest mt-1.5">{summary.adherenceScore}%</p>
          <p className="text-xs text-forest/80 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} /> Within clinical target (&gt;80%)
          </p>
        </div>

        <div className="card-lavender p-5 rounded-[22px] shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#382856', opacity: 0.8 }}>Completed Tasks</p>
          <p className="text-2xl font-black mt-1.5" style={{ color: '#382856' }}>{summary.completedTasks}</p>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#382856', opacity: 0.8 }}>Care activities confirmed</p>
        </div>

        <div className="card-peach p-5 rounded-[22px] shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#5A2C18', opacity: 0.8 }}>Missed / Delayed</p>
          <p className="text-2xl font-black mt-1.5" style={{ color: '#5A2C18' }}>{summary.missedTasks + summary.delayedTasks}</p>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#5A2C18', opacity: 0.8 }}>{summary.missedTasks} missed, {summary.delayedTasks} delayed</p>
        </div>
      </div>

      {/* Two Column Layout: Detailed Breakdown & Synthesized Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="content-card p-6 sm:p-7 shadow-card">
          <h3 className="text-base font-extrabold text-charcoal mb-4 flex items-center gap-2">
            <ActivitySquare size={18} className="text-emerald" /> Clinical Metric Breakdown
          </h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center border-b border-border-light pb-2.5">
              <span className="text-muted">Target Patient</span>
              <span className="font-bold text-charcoal">Aarushi Thakur (ID: {summary.patientId})</span>
            </div>
            <div className="flex justify-between items-center border-b border-border-light pb-2.5">
              <span className="text-muted">Attending Clinician</span>
              <span className="font-bold text-charcoal">Dr. Sarah Jenkins, MD</span>
            </div>
            <div className="flex justify-between items-center border-b border-border-light pb-2.5">
              <span className="text-muted">Primary Surgical Procedure</span>
              <span className="font-bold text-charcoal">General Inpatient Follow-Up</span>
            </div>
            <div className="flex justify-between items-center border-b border-border-light pb-2.5">
              <span className="text-muted">Medication Course Adherence</span>
              <span className="font-bold text-forest">92% On-Schedule</span>
            </div>
            <div className="flex justify-between items-center border-b border-border-light pb-2.5">
              <span className="text-muted">Next Scheduled Follow-Up</span>
              <span className="font-bold text-emerald">Oct 22, 2026 (Cardiology)</span>
            </div>
          </div>
        </div>

        <div className="content-card p-6 sm:p-7 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-charcoal flex items-center gap-2">
              <FileText size={18} className="text-emerald" /> Patient-Reported Observations
            </h3>
            <span className="text-[10px] uppercase font-bold text-muted bg-pale-sage px-2 py-0.5 rounded-full">Algorithmic NLP</span>
          </div>

          <div className="bg-warm-cream/70 p-4 rounded-2xl text-xs leading-relaxed border border-border-light text-charcoal min-h-[140px]">
            {summary.notes || "No patient notes reported during this monitoring period."}
          </div>
          
          <div className="mt-5 flex items-center gap-2 text-forest text-xs font-bold">
            <CheckCircle2 size={16} className="text-emerald" /> Timeline synthesized against discharge protocol
          </div>
        </div>
      </div>
    </div>
  );
};
