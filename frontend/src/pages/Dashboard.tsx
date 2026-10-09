import React from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { 
  mockMedicationSummary, 
  mockTasks, 
  mockAppointments, 
  mockTests, 
  mockProgressData,
  mockActivities
} from '../data/mockDashboard';
import { 
  CheckCircle2, 
  Circle, 
  XCircle, 
  Clock, 
  Calendar, 
  Stethoscope,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Good morning, Aarushi</h1>
          <p className="text-muted">Here is your care progress and schedule for today.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm text-muted">Today's Date</p>
          <p className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Recovery Progress</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="recoveryScore" name="Recovery Score" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRecovery)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Today's Tasks & Meds Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Today's Tasks</h2>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                  {mockTasks.filter(t => t.status === 'completed').length} / {mockTasks.length} Done
                </span>
              </div>
              <div className="space-y-4">
                {mockTasks.map(task => (
                  <div key={task.id} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {task.status === 'completed' ? <CheckCircle2 className="text-emerald-500" size={18} /> : 
                       task.status === 'missed' ? <XCircle className="text-red-500" size={18} /> : 
                       <Circle className="text-slate-500" size={18} />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-muted' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted">{task.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Medication Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center">
                  <p className="text-3xl font-bold text-white mb-1">{mockMedicationSummary.total}</p>
                  <p className="text-xs text-muted">Total Meds</p>
                </div>
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center">
                  <p className="text-3xl font-bold text-emerald-400 mb-1">{mockMedicationSummary.taken}</p>
                  <p className="text-xs text-emerald-500/70">Taken</p>
                </div>
                <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-center">
                  <p className="text-3xl font-bold text-amber-400 mb-1">{mockMedicationSummary.delayed}</p>
                  <p className="text-xs text-amber-500/70">Delayed</p>
                </div>
                <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center">
                  <p className="text-3xl font-bold text-red-400 mb-1">{mockMedicationSummary.missed}</p>
                  <p className="text-xs text-red-500/70">Missed</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          
          {/* Important Instructions */}
          <Card className="p-6 border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <AlertTriangle size={20} />
              <h2 className="text-lg font-bold">Important Instructions</h2>
            </div>
            <ul className="text-sm space-y-2 text-slate-300 list-disc pl-5">
              <li>Drink at least 2 liters of water today.</li>
              <li>Avoid lifting heavy objects for the next 48 hours.</li>
              <li>Keep the surgical incision area dry.</li>
            </ul>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Upcoming Appointments</h2>
            <div className="space-y-4">
              {mockAppointments.map(apt => (
                <div key={apt.id} className="border-l-2 border-primary pl-3 py-1">
                  <p className="font-semibold text-sm">{apt.doctorName}</p>
                  <p className="text-xs text-primary mb-1">{apt.specialty}</p>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {apt.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {apt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pending Tests */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Pending Tests</h2>
            <div className="space-y-3">
              {mockTests.map(test => (
                <div key={test.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Stethoscope size={16} className="text-muted" />
                    <div>
                      <p className="text-sm font-medium">{test.testName}</p>
                      <p className="text-xs text-muted">By {test.requiredBefore}</p>
                    </div>
                  </div>
                  <StatusBadge 
                    status={test.status === 'scheduled' ? 'success' : 'warning'} 
                    label={test.status} 
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {mockActivities.map(activity => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-0.5">
                    {activity.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-500" /> :
                     activity.type === 'warning' ? <AlertTriangle size={16} className="text-amber-500" /> :
                     <Info size={16} className="text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};
