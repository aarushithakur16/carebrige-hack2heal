import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { HeartPulse, CheckCircle2, Circle, Send, X } from 'lucide-react';
import { getTasks, updateTaskStatus, submitCheckin } from '../services/taskService';
import type { CareTask } from '../types';

export const DailyCare: React.FC = () => {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [painLevel, setPainLevel] = useState(3);
  const [symptoms, setSymptoms] = useState('');
  const [submittingCheckin, setSubmittingCheckin] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, []);

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Optimistic UI update
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));

    try {
      await updateTaskStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to sync task status:', err);
    }
  };

  const handleSubmitCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCheckin(true);
    try {
      const note = `Reported Pain Level: ${painLevel}/10. Symptoms: ${symptoms || 'No specific acute symptoms.'}`;
      await submitCheckin('', 'completed', note);
      setCheckinSuccess(true);
      setShowCheckinModal(false);
      setSymptoms('');
      setTimeout(() => setCheckinSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to submit check-in:', err);
    } finally {
      setSubmittingCheckin(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Daily Care Checklist</h1>
      <p className="text-muted mb-6">Your personalized recovery activities for today.</p>

      {checkinSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-3">
          <CheckCircle2 size={20} />
          <span>Your symptoms and daily check-in have been successfully logged and sent to your care team!</span>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="divide-y divide-white/5">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-muted">No care tasks scheduled for today.</div>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className={`p-5 flex items-center justify-between transition-colors hover:bg-white/[0.02] cursor-pointer ${task.status === 'completed' ? 'opacity-60' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center gap-4">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                  ) : (
                    <Circle className="text-slate-500 shrink-0" size={24} />
                  )}
                  <div>
                    <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-primary">
                      {(task.type || 'Activity').charAt(0).toUpperCase() + (task.type || 'Activity').slice(1)} • {task.time || 'Today'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Daily Check-In</h3>
        <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-primary/20">
          <p className="mb-4">How are you feeling today? Logging your symptoms helps your clinician monitor your recovery in real time.</p>
          <Button icon={HeartPulse} onClick={() => setShowCheckinModal(true)}>Log Symptoms & Pain Level</Button>
        </Card>
      </div>

      {showCheckinModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <HeartPulse className="text-primary" size={24} />
                <h3 className="text-xl font-bold">Daily Health Check-In</h3>
              </div>
              <button onClick={() => setShowCheckinModal(false)} className="text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitCheckin} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Pain Level (1 - 10)</label>
                  <span className="text-lg font-bold text-primary">{painLevel} / 10</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={painLevel} 
                  onChange={(e) => setPainLevel(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>Mild (1-3)</span>
                  <span>Moderate (4-6)</span>
                  <span>Severe (7-10)</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Symptoms or Notes for Care Team</label>
                <textarea
                  rows={4}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Mild soreness around incision, good appetite, walking normally..."
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" type="button" onClick={() => setShowCheckinModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={submittingCheckin} icon={Send}>
                  Submit Check-In
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
