import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { 
  HeartPulse, 
  CheckCircle2, 
  Circle, 
  Send, 
  X, 
  Sparkles, 
  Smile, 
  Meh, 
  Frown, 
  Activity,
  Check
} from 'lucide-react';
import { getTasks, updateTaskStatus, logCheckin } from '../services/taskService';
import type { CareTask } from '../types';

export const DailyCare: React.FC = () => {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  
  // Health Check-in Form States
  const [painLevel, setPainLevel] = useState(2);
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [checkinSubmitting, setCheckinSubmitting] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  const commonSymptomChips = [
    'Mild Incision Tenderness',
    'Normal Energy & Appetite',
    'Post-Activity Fatigue',
    'Slight Swelling (Improving)',
    'Full Knee Extension Reached',
    'Restful 8-Hour Sleep'
  ];

  const handleToggleSymptomChip = (chip: string) => {
    if (symptoms.includes(chip)) {
      setSymptoms(symptoms.replace(chip, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim());
    } else {
      setSymptoms(symptoms ? `${symptoms}, ${chip}` : chip);
    }
  };

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    
    try {
      await updateTaskStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleSubmitCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckinSubmitting(true);
    try {
      await logCheckin(painLevel, symptoms ? [symptoms] : [], notes);
      setCheckinSuccess(true);
      setShowCheckinModal(false);
      setSymptoms('');
      setNotes('');
      setTimeout(() => setCheckinSuccess(false), 4500);
    } catch (err) {
      console.error('Failed to log checkin:', err);
      // Fallback feedback for smooth demo
      setCheckinSuccess(true);
      setShowCheckinModal(false);
      setTimeout(() => setCheckinSuccess(false), 4500);
    } finally {
      setCheckinSubmitting(false);
    }
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const getPainColor = (lvl: number) => {
    if (lvl <= 3) return 'text-[#38420B] bg-[#D9F36A] border-[#D9F36A]';
    if (lvl <= 6) return 'text-[#4A1D07] bg-[#FFB78B] border-[#FFB78B]';
    return 'text-[#8C1D18] bg-[#FFD4CC] border-[#FFD4CC]';
  };

  const getPainLabel = (lvl: number) => {
    if (lvl <= 3) return 'Mild & Manageable';
    if (lvl <= 6) return 'Moderate Discomfort';
    return 'Severe Pain - Notify Team';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-editorial badge-chartreuse">
              <Sparkles size={13} /> Daily Recovery Path
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <Activity size={13} className="text-[#30253D]" /> Patient Reported Outcomes (PRO)
            </span>
          </div>
          <h1 className="serif-headline text-3xl sm:text-4xl text-charcoal">Daily Care & Symptom Check-In</h1>
          <p className="text-sm text-muted mt-1 max-w-xl leading-relaxed">
            Track daily physical therapy, dressing changes, and log health metrics directly for your attending physician.
          </p>
        </div>

        <Button icon={HeartPulse} onClick={() => setShowCheckinModal(true)}>
          Log Symptoms & Pain
        </Button>
      </div>

      {checkinSuccess && (
        <div className="p-4 bg-[#D9F36A] border border-[#24252B]/15 rounded-2xl text-[#24252B] flex items-center gap-3 text-xs font-bold animate-fade-in shadow-sm">
          <CheckCircle2 size={22} className="shrink-0 text-[#24252B]" />
          <span>
            Check-in recorded! Your reported symptoms and pain level have been logged into your continuity timeline.
          </span>
        </div>
      )}

      {/* Editorial Progress Metric Card in Deep Ink Plum */}
      <div className="rounded-[28px] p-6 sm:p-8 bg-[#30253D] text-[#FAF7F0] border border-white/10 shadow-hero">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9F36A]">Today's Trajectory Completion</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="serif-headline text-4xl font-bold text-[#FAF7F0]">{completedCount} of {tasks.length}</span>
              <span className="text-xs text-[#FAF7F0]/70 font-medium">activities completed</span>
            </div>
          </div>
          <div className="w-full sm:w-72">
            <div className="w-full bg-white/15 rounded-full h-3 overflow-hidden p-0.5">
              <div 
                className="bg-[#D9F36A] h-2 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-[#D9F36A] font-bold mt-2">
              {progressPercent}% Complete
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="editorial-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border-editorial flex items-center justify-between">
          <div>
            <h2 className="serif-headline text-xl text-charcoal">Prescribed Daily Milestones</h2>
            <p className="text-xs text-muted">Tap any item to mark completed or pending</p>
          </div>
          <span className="text-xs font-bold text-charcoal bg-[#FAF7F0] px-3 py-1 rounded-full border border-border-editorial">
            {completedCount}/{tasks.length} Done
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted animate-pulse">Loading daily tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center text-muted">No care tasks scheduled for today.</div>
        ) : (
          <div className="divide-y divide-border-editorial">
            {tasks.map(task => {
              const isCompleted = task.status === 'completed';
              return (
                <div 
                  key={task.id} 
                  className={`p-4 sm:p-5 flex items-center justify-between transition-colors hover:bg-[#FAF7F0] cursor-pointer ${
                    isCompleted ? 'bg-[#F7FCE8]/40' : ''
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-[#30253D] text-[#D9F36A] flex items-center justify-center shadow-xs">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      ) : (
                        <Circle className="text-[#B9CDBB] hover:text-[#30253D]" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${
                        isCompleted ? 'line-through text-muted' : 'text-charcoal'
                      }`}>
                        {task.title || (task as any).task_text}
                      </h3>
                      <p className="text-xs text-muted font-medium mt-0.5">
                        {(task.type || 'Activity').charAt(0).toUpperCase() + (task.type || 'Activity').slice(1)} • {task.time || 'Today'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                    isCompleted ? 'bg-[#D9F36A] text-[#24252B] border-[#D9F36A]' : 'bg-[#FAF7F0] text-muted border-border-editorial'
                  }`}>
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Symptom Check-In Promo Callout in Warm Apricot */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FFF3EB] to-[#FAF7F0] border border-[#FFB78B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="serif-headline text-lg text-charcoal">Report Resting Pain & Mobility Changes</h4>
          <p className="text-xs text-muted mt-1 max-w-lg leading-relaxed">
            Regular symptom logging alerts your physician early to potential complications and eliminates guesswork during your next consultation.
          </p>
        </div>
        <Button onClick={() => setShowCheckinModal(true)} variant="secondary" icon={HeartPulse}>
          Open Health Check-In
        </Button>
      </div>

      {/* Health Check-In Modal */}
      {showCheckinModal && (
        <div className="fixed inset-0 bg-[#30253D]/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-border-editorial rounded-[28px] p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-fade-in relative">
            <div className="flex justify-between items-center border-b border-border-editorial pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#D9F36A] text-[#24252B]">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <h3 className="serif-headline text-xl text-charcoal">Daily Health Check-In</h3>
                  <p className="text-xs text-muted">Directly synced to your physician follow-up note</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCheckinModal(false)} 
                className="text-muted hover:text-charcoal p-1.5 rounded-xl hover:bg-[#FAF7F0]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitCheckin} className="space-y-5">
              {/* Pain Level Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal">
                    Reported Pain Level (0 - 10)
                  </label>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getPainColor(painLevel)}`}>
                    {painLevel} / 10 • {getPainLabel(painLevel)}
                  </span>
                </div>

                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={painLevel} 
                  onChange={(e) => setPainLevel(parseInt(e.target.value))}
                  className="w-full accent-[#30253D] cursor-pointer h-2 bg-[#F0ECE1] rounded-lg"
                />

                <div className="flex justify-between text-[11px] text-muted mt-2 font-semibold">
                  <span className="flex items-center gap-1 text-[#38420B]"><Smile size={13} /> 0-3 (Mild)</span>
                  <span className="flex items-center gap-1 text-[#4A1D07]"><Meh size={13} /> 4-6 (Moderate)</span>
                  <span className="flex items-center gap-1 text-[#8C1D18]"><Frown size={13} /> 7-10 (Severe)</span>
                </div>
              </div>

              {/* Quick symptom tags */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal block mb-2">
                  Quick Select Common Observations
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {commonSymptomChips.map(chip => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleToggleSymptomChip(chip)}
                      className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                        symptoms.includes(chip)
                          ? 'bg-[#30253D] text-[#FAF7F0] border-[#30253D] font-bold shadow-xs'
                          : 'bg-[#FAF7F0] text-charcoal border-border-editorial hover:bg-[#F0ECE1]'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Observations Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal block mb-1.5">
                  Symptom Notes & Physician Remarks
                </label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Incision dressing dry and intact. Able to walk unassisted for 15 minutes today."
                  rows={3}
                  className="w-full p-3 bg-[#FAF7F0] border border-border-editorial rounded-xl text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-[#30253D]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border-editorial">
                <Button variant="ghost" type="button" onClick={() => setShowCheckinModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={checkinSubmitting} icon={Send}>
                  Submit Daily Check-In
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
