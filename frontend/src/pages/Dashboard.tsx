import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
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
  Clock, 
  Calendar, 
  Pill, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Activity,
  FileUp,
  ShieldCheck,
  Check
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
import { getAuthUser, apiFetch } from '../services/api';
import { updateTaskStatus } from '../services/taskService';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState(mockTasks);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [tests, setTests] = useState(mockTests);
  const [medSummary, setMedSummary] = useState(mockMedicationSummary);

  useEffect(() => {
    const authUser = getAuthUser();
    setUser(authUser);

    if (authUser?.id) {
      apiFetch(`/patients/${authUser.id}/care-plan`)
        .then(res => {
          if (res) {
            if (res.care_tasks && res.care_tasks.length > 0) {
              setTasks(res.care_tasks);
            }
            if (res.appointments && res.appointments.length > 0) {
              setAppointments(res.appointments);
            }
            if (res.tests && res.tests.length > 0) {
              setTests(res.tests);
            }
            if (res.medications && res.medications.length > 0) {
              const meds = res.medications;
              const total = meds.length;
              const taken = meds.filter((m: any) => (m.status || '').toLowerCase() === 'taken').length;
              const delayed = meds.filter((m: any) => (m.status || '').toLowerCase() === 'delayed').length;
              const missed = meds.filter((m: any) => (m.status || '').toLowerCase() === 'missed').length;
              setMedSummary({ total, taken, delayed, missed });
            }
          }
        })
        .catch(console.error);
    }
  }, []);

  const handleToggleTask = async (taskId: string) => {
    const targetTask = tasks.find((t: any) => t.id === taskId);
    if (!targetTask) return;

    const newStatus = targetTask.status === 'completed' ? 'pending' : 'completed';
    setTasks(prev => prev.map((t: any) => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const completedTasksCount = tasks.filter((t: any) => t.status === 'completed').length;
  const taskCompletionPercentage = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
  const adherencePercentage = medSummary.total > 0 ? Math.round((medSummary.taken / medSummary.total) * 100) : 100;

  // Circular progress ring math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const recoveryScore = 88;
  const strokeDashoffset = circumference - (recoveryScore / 100) * circumference;

  return (
    <div className="dashboard-container space-y-7 animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* C. VISUALLY STRIKING HERO SECTION */}
      <div className="relative overflow-hidden rounded-[26px] p-8 sm:p-10 text-white shadow-hero" style={{ background: 'var(--bg-hero)' }}>
        {/* Soft decorative gradient orbs */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-sky-400/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-20 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left Text Block */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#86EFAC] mb-4">
              <Sparkles size={13} className="text-[#86EFAC] animate-pulse" />
              <span>Post-Discharge Recovery Track • Day 4</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Good morning, {user?.name || 'Aarushi'}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 mt-2.5 font-normal leading-relaxed max-w-xl">
              Your recovery indicators are stabilizing exceptionally well. All discharge prescriptions are verified and active for today.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <Button 
                onClick={() => navigate('/daily-care')}
                className="btn-hero"
                icon={Activity}
              >
                Log Today's Health Check-In
              </Button>

              <button 
                onClick={() => navigate('/documents')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all hover:scale-[1.02]"
              >
                <FileUp size={15} /> Upload Medical Note
              </button>
            </div>
          </div>

          {/* Right: Circular Progress Visualization */}
          <div className="flex items-center gap-6 bg-black/30 backdrop-blur-md border border-white/15 p-6 rounded-2xl shrink-0 self-start lg:self-center">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke="#86EFAC"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-2xl font-black text-white leading-none">{recoveryScore}%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#86EFAC] mt-1">Recovery</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#86EFAC]" /> Benchmark Score
              </div>
              <p className="text-slate-300 text-[11px] leading-snug">
                Mobility & vital targets are currently exceeding clinical recovery baseline.
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                Next Evaluation: <strong>In 3 Days</strong>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* D. COLOURFUL STATISTICS SECTION (4 Coordinated Pastel Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Recovery Progress — Pastel Mint */}
        <div className="card-mint p-5 rounded-[22px] shadow-card flex flex-col justify-between hover-lift">
          <div className="flex items-center justify-between text-xs font-bold text-[#166534]">
            <span>Recovery Score</span>
            <div className="p-2 rounded-xl bg-[#166534]/10">
              <TrendingUp size={16} className="text-[#166534]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#166534]">88%</div>
            <p className="text-xs font-medium mt-0.5 text-[#166534]/80">+12% vs last week's intake</p>
          </div>
          <div className="w-full bg-[#166534]/15 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#166534] h-1.5 rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>

        {/* Card 2: Medication Adherence — Pastel Lavender */}
        <div 
          className="card-lavender p-5 rounded-[22px] shadow-card flex flex-col justify-between hover-lift cursor-pointer"
          onClick={() => navigate('/medications')}
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#5B21B6]">
            <span>Medication Adherence</span>
            <div className="p-2 rounded-xl bg-[#5B21B6]/10">
              <Pill size={16} className="text-[#5B21B6]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#5B21B6]">{adherencePercentage}%</div>
            <p className="text-xs font-medium mt-0.5 text-[#5B21B6]/80">
              {medSummary.taken} of {medSummary.total} prescribed doses taken
            </p>
          </div>
          <div className="w-full bg-[#5B21B6]/15 rounded-full h-1.5 overflow-hidden">
            <div className="h-1.5 rounded-full bg-[#5B21B6]" style={{ width: `${adherencePercentage}%` }}></div>
          </div>
        </div>

        {/* Card 3: Upcoming Appointments — Pastel Peach */}
        <div 
          className="card-peach p-5 rounded-[22px] shadow-card flex flex-col justify-between hover-lift cursor-pointer"
          onClick={() => navigate('/appointments')}
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#9A3412]">
            <span>Next Consultation</span>
            <div className="p-2 rounded-xl bg-[#9A3412]/10">
              <Calendar size={16} className="text-[#9A3412]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-xl font-black truncate text-[#9A3412]">
              {(appointments[0] as any)?.doctorName || (appointments[0] as any)?.doctor_name || 'Dr. Sarah Jenkins'}
            </div>
            <p className="text-xs font-medium mt-0.5 truncate text-[#9A3412]/80">
              {(appointments[0] as any)?.department || 'Cardiology & Surgical Follow-Up'}
            </p>
          </div>
          <div className="text-[11px] font-bold flex items-center gap-1 text-[#9A3412]">
            <Clock size={12} /> {(appointments[0] as any)?.date || 'Oct 22'} • 10:30 AM
          </div>
        </div>

        {/* Card 4: Completed Care Tasks — Pastel Butter Yellow */}
        <div 
          className="card-yellow p-5 rounded-[22px] shadow-card flex flex-col justify-between hover-lift cursor-pointer"
          onClick={() => navigate('/daily-care')}
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#854D0E]">
            <span>Daily Care Tasks</span>
            <div className="p-2 rounded-xl bg-[#854D0E]/10">
              <CheckCircle2 size={16} className="text-[#854D0E]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#854D0E]">
              {completedTasksCount} <span className="text-base font-normal opacity-70">/ {tasks.length}</span>
            </div>
            <p className="text-xs font-medium mt-0.5 text-[#854D0E]/80">
              {taskCompletionPercentage}% of today's checklist completed
            </p>
          </div>
          <div className="w-full bg-[#854D0E]/15 rounded-full h-1.5 overflow-hidden">
            <div className="h-1.5 rounded-full bg-[#854D0E]" style={{ width: `${taskCompletionPercentage}%` }}></div>
          </div>
        </div>

      </div>

      {/* E. MAIN CONTENT GRID: EDITORIAL ASYMMETRICAL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 8 Columns (Care Schedule + Analytics Chart) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* G. Premium Analytics Chart */}
          <div className="content-card p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Recovery Trajectory</span>
                <h2 className="text-lg font-extrabold text-charcoal">Vital Adherence & Wellness Score</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0F172A]"></span>
                  Active Protocol
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.16}/>
                      <stop offset="95%" stopColor="#DCFCE7" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '14px',
                      boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                      color: '#0F172A'
                    }}
                    labelStyle={{ color: '#64748B', fontWeight: 600, fontSize: '11px', marginBottom: '3px' }}
                    itemStyle={{ color: '#0F172A', fontWeight: 800 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="recoveryScore" 
                    name="Recovery Score" 
                    stroke="#0F172A" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#chartGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* F. Beautiful Daily Care Timeline */}
          <div className="content-card p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Daily Schedule</span>
                <h2 className="text-lg font-extrabold text-charcoal">Prescribed Recovery Activities</h2>
              </div>
              <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#86EFAC]/40">
                {completedTasksCount} / {tasks.length} Completed
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E2E8F0]">
              {tasks.map((task: any) => {
                const isCompleted = task.status === 'completed';
                return (
                  <div 
                    key={task.id} 
                    onClick={() => handleToggleTask(task.id)}
                    className="relative flex items-start gap-4 p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all border border-[#E2E8F0] cursor-pointer group"
                  >
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-[27px] top-4 shrink-0 transition-transform group-hover:scale-110">
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-sm">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white border-2 border-[#CBD5E1] group-hover:border-[#0F172A] shadow-sm"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${isCompleted ? 'line-through text-muted' : 'text-charcoal'}`}>
                        {task.title || task.task_text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#86EFAC]/30">
                          {task.time || 'Today'}
                        </span>
                        <span className="text-[11px] text-muted capitalize">
                          • {task.type || 'Exercise'}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isCompleted ? 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]/40' : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
                    }`}>
                      {isCompleted ? 'Done' : 'Tap to mark done'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* H. Medication Intake Highlights */}
          <div className="content-card p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Active Regimen</span>
                <h2 className="text-lg font-extrabold text-charcoal">Today's Medication Schedule</h2>
              </div>
              <button 
                onClick={() => navigate('/medications')}
                className="text-xs font-bold text-[#0F172A] hover:underline flex items-center gap-1"
              >
                Full Tracker <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#DCFCE7]/60 border border-[#86EFAC]/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#166534]">Morning Dose</span>
                  <h4 className="text-sm font-bold text-[#166534] mt-1">Amoxicillin (500mg)</h4>
                  <p className="text-[11px] text-[#166534]/70 mt-0.5">Take with breakfast</p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#166534]">
                  <CheckCircle2 size={14} className="text-[#166534]" /> Confirmed Taken
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDE9FE]/60 border border-[#C4B5FD]/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#5B21B6]">Afternoon Dose</span>
                  <h4 className="text-sm font-bold text-[#5B21B6] mt-1">Ibuprofen (400mg)</h4>
                  <p className="text-[11px] text-[#5B21B6]/70 mt-0.5">As needed with meal</p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#5B21B6]">
                  <CheckCircle2 size={14} /> Confirmed Taken
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFEDD5]/60 border border-[#FDBA74]/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#9A3412]">Evening Dose</span>
                  <h4 className="text-sm font-bold text-[#9A3412] mt-1">Amoxicillin (500mg)</h4>
                  <p className="text-[11px] text-[#9A3412]/70 mt-0.5">08:00 PM with dinner</p>
                </div>
                <button 
                  onClick={() => navigate('/medications')}
                  className="mt-3 text-xs font-bold text-[#0F172A] bg-white py-1 px-3 rounded-full self-start shadow-sm hover:bg-[#F8FAFC] border border-[#E2E8F0]"
                >
                  Log Dose
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: 4 Columns (Event Cards, Lab Tests, Recent Activity) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Appointment Event Ticket Card */}
          <div className="content-card p-6 border-l-4 border-l-[#0F172A]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Consultation</span>
              <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-[#86EFAC]/40">
                Scheduled
              </span>
            </div>

            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-13 h-13 p-2.5 rounded-2xl bg-[#F1F5F9] text-[#0F172A] flex flex-col items-center justify-center text-center shrink-0 border border-[#E2E8F0]">
                <span className="text-[10px] font-bold uppercase">OCT</span>
                <span className="text-xl font-black leading-none">22</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm text-charcoal truncate">
                  {(appointments[0] as any)?.doctorName || (appointments[0] as any)?.doctor_name || 'Dr. Sarah Jenkins'}
                </h4>
                <p className="text-xs text-muted truncate mt-0.5">
                  {(appointments[0] as any)?.department || 'Cardiology Follow-Up'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-muted mt-2">
                  <Clock size={12} className="text-[#64748B]" /> 10:30 AM EST
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-muted mb-4">
              Building B, Room 410 • Main Surgical Wing
            </div>

            <Button 
              variant="secondary" 
              className="w-full text-xs py-2"
              onClick={() => navigate('/appointments')}
            >
              Consultation Details
            </Button>
          </div>

          {/* Pending Diagnostic Tests */}
          <div className="content-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Diagnostics</span>
                <h3 className="text-sm font-extrabold text-charcoal">Ordered Clinical Tests</h3>
              </div>
              <button onClick={() => navigate('/tests')} className="text-xs font-bold text-[#0F172A] hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {tests.map((test: any) => (
                <div key={test.id} className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-charcoal truncate">{test.testName || test.test_name}</p>
                    <p className="text-[11px] text-muted mt-0.5">Due: {test.dueDate || test.due_date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    test.status === 'scheduled' ? 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]/40' : 'bg-[#FEF9C3] text-[#854D0E] border-[#FDE047]/40'
                  }`}>
                    {test.status === 'scheduled' ? 'Booked' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* I. Care Circle Activity Timeline */}
          <div className="content-card p-6">
            <h3 className="text-sm font-extrabold text-charcoal mb-4">Care Circle Activity</h3>
            <div className="space-y-3.5">
              {mockActivities.slice(0, 3).map(activity => (
                <div key={activity.id} className="flex gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#0F172A] shrink-0 mt-1.5"></div>
                  <div>
                    <p className="text-charcoal font-medium leading-snug">{activity.description}</p>
                    <p className="text-[10px] text-muted mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reassuring Care Directives Card */}
          <div className="rounded-[22px] p-5 border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]">
            <div className="flex items-center gap-2 mb-2 text-[#0F172A] font-bold text-xs">
              <ShieldCheck size={16} className="text-[#0F172A]" />
              <span>Verified Care Directives</span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Drink at least 2 liters of water daily and inspect surgical dressing once per 24 hours. Contact care team if pain elevates above level 6.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
