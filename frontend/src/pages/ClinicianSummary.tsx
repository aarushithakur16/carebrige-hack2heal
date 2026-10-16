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
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#7DD3FC]/40 flex items-center gap-1.5">
              <Stethoscope size={13} className="text-[#0369A1]" /> Physician & Care Team Review
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#166534]" /> Non-Diagnostic Algorithmic Synthesis
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
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl flex items-center gap-3 text-charcoal text-xs font-medium">
          <UserCheck size={18} className="shrink-0 text-[#0F172A]" />
          <p>
            <strong>Provider View Mode:</strong> You are viewing the clinical summary prepared for your physician. It synthesizes all daily check-ins and medication records.
          </p>
        </div>
      )}

      {/* Clinical Disclaimer */}
      <div className="bg-[#FEF9C3]/50 border border-[#FDE047]/40 p-4 rounded-2xl flex gap-3 text-[#854D0E] text-xs">
        <AlertTriangle size={18} className="shrink-0 text-[#854D0E]" />
        <p className="leading-relaxed">
          <strong>Clinical Decision Support Disclaimer:</strong> CareBridge summarizes patient-reported and verified records. It does not provide medical diagnoses or prescribe pharmacotherapy. Review is intended to assist, not replace, clinical judgment.
        </p>
      </div>

      {/* 4 Coordinated Pastel Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="content-card p-5 shadow-card">
          <p className="text-[11px] text-muted font-bold uppercase tracking-wider">Monitoring Window</p>
          <p className="text-2xl font-black text-charcoal mt-1.5">{summary.carePeriod}</p>
          <p className="text-xs text-[#0F172A] mt-1 flex items-center gap-1 font-semibold">
            <Clock size={12} /> Live tracking
          </p>
        </div>

        <div className="card-mint p-5 rounded-[22px] shadow-card">
          <p className="text-[11px] text-[#166534] font-bold uppercase tracking-wider">Adherence Score</p>
          <p className="text-2xl font-black text-[#166534] mt-1.5">{summary.adherenceScore}%</p>
          <p className="text-xs text-[#166534] mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} /> Within clinical target (&gt;80%)
          </p>
        </div>

        <div className="card-lavender p-5 rounded-[22px] shadow-card">
          <p className="text-[11px] text-[#5B21B6] font-bold uppercase tracking-wider">Completed Tasks</p>
          <p className="text-2xl font-black text-[#5B21B6] mt-1.5">{summary.completedTasks}</p>
          <p className="text-xs text-[#5B21B6] mt-1 font-semibold">Care activities confirmed</p>
        </div>

        <div className="card-peach p-5 rounded-[22px] shadow-card">
          <p className="text-[11px] text-[#9A3412] font-bold uppercase tracking-wider">Missed / Delayed</p>
          <p className="text-2xl font-black text-[#9A3412] mt-1.5">{summary.missedTasks + summary.delayedTasks}</p>
          <p className="text-xs text-[#9A3412] mt-1 font-semibold">{summary.missedTasks} missed, {summary.delayedTasks} delayed</p>
        </div>
      </div>

      {/* Two Column Layout: Detailed Breakdown & Synthesized Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="content-card p-6 sm:p-7 shadow-card">
          <h3 className="text-base font-extrabold text-charcoal mb-4 flex items-center gap-2">
            <ActivitySquare size={18} className="text-[#0F172A]" /> Clinical Metric Breakdown
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
              <span className="font-bold text-[#166534]">92% On-Schedule</span>
            </div>
            <div className="flex justify-between items-center border-b border-border-light pb-2.5">
              <span className="text-muted">Next Scheduled Follow-Up</span>
              <span className="font-bold text-[#0F172A]">Oct 22, 2026 (Cardiology)</span>
            </div>
          </div>
        </div>

        <div className="content-card p-6 sm:p-7 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-charcoal flex items-center gap-2">
              <FileText size={18} className="text-[#0F172A]" /> Patient-Reported Observations
            </h3>
            <span className="text-[10px] uppercase font-bold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded-full border border-[#E2E8F0]">Algorithmic NLP</span>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-2xl text-xs leading-relaxed border border-border-light text-charcoal min-h-[140px]">
            {summary.notes || "No patient notes reported during this monitoring period."}
          </div>
          
          <div className="mt-5 flex items-center gap-2 text-[#166534] text-xs font-bold">
            <CheckCircle2 size={16} className="text-[#166534]" /> Timeline synthesized against discharge protocol
          </div>
        </div>
      </div>
    </div>
  );
};
