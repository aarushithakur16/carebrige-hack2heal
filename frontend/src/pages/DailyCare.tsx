import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { HeartPulse, CheckCircle2, Circle } from 'lucide-react';
import { getTasks } from '../services/taskService';
import type { CareTask } from '../types';

export const DailyCare: React.FC = () => {
  const [tasks, setTasks] = useState<CareTask[]>([]);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Daily Care Checklist</h1>
      <p className="text-muted mb-6">Your personalized recovery activities for today.</p>

      <Card className="overflow-hidden">
        <div className="divide-y divide-white/5">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`p-5 flex items-center justify-between transition-colors hover:bg-white/[0.02] cursor-pointer ${task.status === 'completed' ? 'opacity-50' : ''}`}
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
                  <p className="text-sm text-primary">{task.type.charAt(0).toUpperCase() + task.type.slice(1)} • {task.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Daily Check-In</h3>
        <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-primary/20">
          <p className="mb-4">How are you feeling today? Logging your symptoms helps your clinician monitor your recovery.</p>
          <Button icon={HeartPulse}>Log Symptoms & Pain Level</Button>
        </Card>
      </div>
    </div>
  );
};
