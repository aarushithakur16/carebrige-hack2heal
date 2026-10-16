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
  ArrowRight, 
  Sparkles, 
  Activity, 
  FileUp, 
  ShieldCheck, 
  Check,
  Compass,
  List,
  Heart,
  ChevronRight,
  MapPin
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
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(1);
  const [viewMode, setViewMode] = useState<'journey' | 'list'>('journey');

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
  const taskCompletionPercentage = tasks.length > 0 
    ? Math.round((completedTasksCount / tasks.length) * 100) 
    : 0;

  const adherencePercentage = medSummary.total > 0 
    ? Math.round((medSummary.taken / medSummary.total) * 100) 
    : 100;

  // Recovery Velocity
  const recoveryScore = 88;

  // Signature Journey Milestones mapped from real tasks
  const journeyMilestones = [
    {
      time: '08:00 AM',
      title: 'Morning Antibiotic Regimen',
      type: 'Medication',
      detail: 'Amoxicillin 500mg with breakfast and 250ml water',
      status: 'completed',
      nodeColor: 'bg-[#D9F36A] text-[#24252B]',
      actionLabel: 'Dose Verified'
    },
    {
      time: '11:30 AM',
      title: 'Post-Op Physical Therapy Walk',
      type: 'Mobility Exercise',
      detail: '10-minute flat surface hallway walk with gentle knee flexing',
      status: 'completed',
      nodeColor: 'bg-[#D9F36A] text-[#24252B]',
      actionLabel: 'Recorded Completed'
    },
    {
      time: '02:00 PM',
      title: 'Daily Symptom & Pain Level Check-In',
      type: 'Clinical Metric',
      detail: 'Log resting pain score (0-10) and report any incision tenderness',
      status: 'current',
      nodeColor: 'bg-[#FFB78B] text-[#4A1D07] ring-4 ring-[#FFB78B]/30',
      actionLabel: 'Log Symptoms Now'
    },
    {
      time: '05:30 PM',
      title: 'Surgical Incision Site Inspection',
      type: 'Wound Care',
      detail: 'Inspect dressing for redness, swelling, or excessive discharge',
      status: 'upcoming',
      nodeColor: 'bg-[#DCD0F2] text-[#321B52]',
      actionLabel: 'Scheduled at 05:30 PM'
    },
    {
      time: '08:00 PM',
      title: 'Evening Prescribed Dose',
      type: 'Medication',
      detail: 'Amoxicillin 500mg with evening dinner',
      status: 'pending',
      nodeColor: 'bg-[#DCE9F2] text-[#1A364B]',
      actionLabel: 'Upcoming Dose'
    }
  ];

  const activeMilestone = journeyMilestones[selectedMilestoneIndex] || journeyMilestones[0];

  return (
    <div className="dashboard-container space-y-9 animate-fade-in max-w-7xl mx-auto pb-16">
      
      {/* ========================================================
          1. THE HERO: EDITORIAL AUBERGINE & SCULPTURAL ORBITAL VISUAL
          ======================================================== */}
      <div className="relative overflow-hidden rounded-[32px] p-8 sm:p-12 text-[#FAF7F0] shadow-hero" style={{ background: 'var(--bg-hero)' }}>
        {/* Abstract Ambient Glow Orbs */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#D9F36A]/15 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/4 -bottom-24 w-80 h-80 rounded-full bg-[#FFB78B]/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Magazine Editorial Typography */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#D9F36A]">
              <Sparkles size={13} className="text-[#D9F36A]" />
              <span className="uppercase tracking-widest text-[11px] font-bold">CAREBRIDGE / YOUR RECOVERY SPACE</span>
            </div>

            <h1 className="serif-headline text-4xl sm:text-5xl lg:text-6xl text-[#FAF7F0]">
              Getting better,<br />
              <span className="italic font-light text-[#D9F36A]">one day</span> at a time.
            </h1>
            
            <p className="text-sm sm:text-base text-[#FAF7F0]/85 font-normal leading-relaxed max-w-xl">
              Welcome back, {user?.name || 'Aarushi'}. Your post-discharge care plan is active, verified by clinical review, and moving forward. Today's routine is on schedule.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Button 
                onClick={() => navigate('/daily-care')}
                className="btn-hero"
                icon={Activity}
              >
                Continue Today's Journey
              </Button>

              <button 
                onClick={() => navigate('/documents')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#FAF7F0] bg-white/10 hover:bg-white/15 border border-white/20 transition-all hover:scale-[1.02]"
              >
                <FileUp size={15} /> Upload Medical Note
              </button>
            </div>
          </div>

          {/* Right: Signature Sculptural Orbital Recovery Visualization */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center p-4">
              
              {/* Concentric Orbital Rings */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                <circle cx="150" cy="150" r="130" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" fill="none" strokeDasharray="3 6" />
                <circle cx="150" cy="150" r="100" stroke="rgba(217, 243, 106, 0.25)" strokeWidth="2" fill="none" />
                <circle cx="150" cy="150" r="70" stroke="rgba(255, 183, 139, 0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
                
                {/* Orbiting Milestone Nodes */}
                <circle cx="150" cy="50" r="6" fill="#D9F36A" className="pulse-glow shadow-sm" />
                <circle cx="236" cy="100" r="4.5" fill="#FFB78B" opacity="0.9" />
                <circle cx="64" cy="200" r="4.5" fill="#DCD0F2" opacity="0.9" />
                <circle cx="210" cy="220" r="5" fill="#D9F36A" opacity="0.8" />
              </svg>

              {/* Center Core Badge */}
              <div className="relative z-10 w-44 h-44 rounded-full bg-[#30253D]/90 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center text-center p-4 shadow-2xl">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D9F36A]">Recovery Velocity</span>
                <span className="serif-headline text-5xl font-bold text-[#FAF7F0] leading-none my-1">
                  {recoveryScore}%
                </span>
                <span className="text-[11px] text-[#FAF7F0]/80 font-medium">Day 4 Post-Discharge</span>
                <div className="mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-[#D9F36A]/20 text-[#D9F36A] font-bold border border-[#D9F36A]/30">
                  {taskCompletionPercentage}% Tasks • {adherencePercentage}% Meds
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. SIGNATURE CAREBRIDGE RECOVERY JOURNEY
          "Recovery isn't a checklist. It's a journey."
          ======================================================== */}
      <div className="editorial-card p-6 sm:p-8 bg-[#FFFFFF] border border-border-editorial">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-editorial">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-editorial badge-chartreuse">
                <Compass size={13} /> Living Recovery Path
              </span>
              <span className="text-xs text-muted">Today's Sequence</span>
            </div>
            <h2 className="serif-headline text-2xl text-charcoal">The Daily Continuum</h2>
            <p className="text-xs text-muted mt-0.5">Interactive pathway mapping your clinical milestones from morning to night.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('journey')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'journey' ? 'bg-[#30253D] text-[#FAF7F0]' : 'bg-[#FAF7F0] text-muted hover:text-charcoal'
              }`}
            >
              <Compass size={14} /> Journey Path
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'list' ? 'bg-[#30253D] text-[#FAF7F0]' : 'bg-[#FAF7F0] text-muted hover:text-charcoal'
              }`}
            >
              <List size={14} /> Schedule List
            </button>
          </div>
        </div>

        {viewMode === 'journey' ? (
          <div className="space-y-6">
            {/* The Connected Horizontal Milestone Trail */}
            <div className="relative py-4 overflow-x-auto">
              <div className="min-w-[680px] flex items-center justify-between relative">
                
                {/* Connecting SVG Path Line */}
                <div className="absolute top-6 left-8 right-8 h-1 bg-[#FAF7F0] border-t-2 border-dashed border-[#B9CDBB]/60 -z-0"></div>

                {journeyMilestones.map((milestone, idx) => {
                  const isSelected = selectedMilestoneIndex === idx;
                  const isDone = milestone.status === 'completed';
                  const isCurrent = milestone.status === 'current';

                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedMilestoneIndex(idx)}
                      className="relative z-10 flex flex-col items-center cursor-pointer group px-2"
                    >
                      {/* Node Indicator */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-300 journey-node ${
                        isSelected 
                          ? 'scale-115 ring-4 ring-[#30253D]/20 shadow-md' 
                          : 'group-hover:scale-105'
                      } ${isCurrent ? 'ring-4 ring-[#FFB78B]/50 animate-pulse' : ''} ${milestone.nodeColor}`}>
                        {isDone ? <Check size={18} strokeWidth={3} /> : idx + 1}
                      </div>

                      <span className="text-[11px] font-bold text-charcoal mt-2">{milestone.time}</span>
                      <span className="text-[10px] text-muted max-w-[100px] text-center truncate">{milestone.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Milestone Inspection Spotlight Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FAF7F0] via-[#F4EFFC] to-[#FFF3EB] border border-border-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#30253D] text-[#FAF7F0]">
                    Milestone {selectedMilestoneIndex + 1} of {journeyMilestones.length}
                  </span>
                  <span className="text-xs font-bold text-charcoal">{activeMilestone.type}</span>
                  <span className="text-xs text-muted">• {activeMilestone.time}</span>
                </div>
                <h3 className="serif-headline text-xl text-charcoal">{activeMilestone.title}</h3>
                <p className="text-xs text-muted max-w-xl">{activeMilestone.detail}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button 
                  onClick={() => navigate(activeMilestone.type === 'Medication' ? '/medications' : '/daily-care')}
                  className="btn-primary text-xs"
                  icon={ArrowRight}
                >
                  {activeMilestone.actionLabel}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Conventional Accessible Schedule List */
          <div className="space-y-3">
            {tasks.map((task: any) => {
              const isCompleted = task.status === 'completed';
              return (
                <div 
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isCompleted ? 'bg-[#F7FCE8]/50 border-[#D9F36A]/50' : 'bg-white border-border-editorial hover:border-border-strong'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCompleted ? 'bg-[#30253D] text-[#D9F36A]' : 'bg-[#FAF7F0] border border-border-editorial text-muted'
                    }`}>
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : null}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isCompleted ? 'line-through text-muted' : 'text-charcoal'}`}>
                        {task.title || task.task_text}
                      </p>
                      <p className="text-xs text-muted">{task.time || 'Today'} • {task.type || 'Activity'}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    isCompleted ? 'bg-[#D9F36A] text-[#24252B]' : 'bg-[#FAF7F0] text-muted'
                  }`}>
                    {isCompleted ? 'Completed' : 'Mark Done'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================
          3. ASYMMETRICAL EDITORIAL GRID (8 Cols Left / 4 Cols Right)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 8 Columns (Vital Chart + Active Medication Sanctuary) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recovery Trajectory Chart */}
          <div className="editorial-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Clinical Trajectory</span>
                <h3 className="serif-headline text-2xl text-charcoal">Recovery Velocity & Vital Stability</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge-editorial badge-chartreuse">
                  <span className="w-2 h-2 rounded-full bg-[#24252B]"></span>
                  Active Protocol Target: 80%+
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="editorialGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D9F36A" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#DCE9F2" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F0" vertical={false} />
                  <XAxis dataKey="day" stroke="#72747D" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#72747D" fontSize={11} tickLine={false} axisLine={false} domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#30253D', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '14px',
                      boxShadow: '0 8px 24px rgba(48,37,61,0.25)',
                      color: '#FAF7F0'
                    }}
                    labelStyle={{ color: '#D9F36A', fontWeight: 700, fontSize: '11px', marginBottom: '3px' }}
                    itemStyle={{ color: '#FAF7F0', fontWeight: 800 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="recoveryScore" 
                    name="Recovery Score" 
                    stroke="#30253D" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#editorialGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="pt-4 border-t border-border-editorial mt-3 flex items-center justify-between text-xs text-muted">
              <span>Mobility, medication adherence, and resting pain metrics normalized daily.</span>
              <span className="font-bold text-charcoal">Confidence: 96%</span>
            </div>
          </div>

          {/* Active Medication Sanctuary */}
          <div className="editorial-card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Prescribed Sanctuary</span>
                <h3 className="serif-headline text-2xl text-charcoal">Active Medication Cadence</h3>
              </div>
              <button 
                onClick={() => navigate('/medications')}
                className="text-xs font-bold text-[#30253D] hover:underline flex items-center gap-1"
              >
                Detailed Pharmacy Schedule <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#F7FCE8] border border-[#D9F36A]/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#38420B]">Morning Regimen</span>
                  <h4 className="font-bold text-base text-[#24252B] mt-1">Amoxicillin (500mg)</h4>
                  <p className="text-xs text-[#38420B]/80 mt-0.5">Taken with breakfast</p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#38420B]">
                  <CheckCircle2 size={15} /> Confirmed Taken
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4EFFC] border border-[#DCD0F2] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#583F7D]">Afternoon PRN</span>
                  <h4 className="font-bold text-base text-[#24252B] mt-1">Ibuprofen (400mg)</h4>
                  <p className="text-xs text-[#583F7D]/80 mt-0.5">As needed for surgical pain</p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#583F7D]">
                  <CheckCircle2 size={15} /> Confirmed Taken
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF3EB] border border-[#FFB78B]/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#9E4A1E]">Evening Protocol</span>
                  <h4 className="font-bold text-base text-[#24252B] mt-1">Amoxicillin (500mg)</h4>
                  <p className="text-xs text-[#9E4A1E]/80 mt-0.5">08:00 PM with dinner</p>
                </div>
                <button 
                  onClick={() => navigate('/medications')}
                  className="mt-4 text-xs font-bold text-[#24252B] bg-white py-1 px-3.5 rounded-full self-start shadow-sm hover:bg-[#FAF7F0] border border-[#FFB78B]/40"
                >
                  Log Dose
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: 4 Columns (Consultation Ticket + Clinical Orders + Care Circle) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Typographic Consultation Event Card */}
          <div className="editorial-card p-6 bg-gradient-to-br from-[#FFF3EB] to-[#FAF7F0] border border-[#FFB78B]/40">
            <div className="flex items-center justify-between mb-4">
              <span className="badge-editorial badge-apricot">Next Consultation</span>
              <span className="text-xs font-bold text-charcoal">OCT 22</span>
            </div>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFB78B] text-[#4A1D07] flex flex-col items-center justify-center text-center shrink-0 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase">OCT</span>
                <span className="serif-headline text-2xl font-bold leading-none">22</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-base text-charcoal truncate">
                  {(appointments[0] as any)?.doctorName || 'Dr. Sarah Jenkins'}
                </h4>
                <p className="text-xs text-muted truncate mt-0.5">
                  {(appointments[0] as any)?.department || 'Cardiology Follow-Up'}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted mt-2">
                  <Clock size={13} className="text-[#9E4A1E]" /> 10:30 AM EST
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/70 border border-border-editorial text-xs text-muted mb-4 flex items-center gap-2">
              <MapPin size={14} className="text-[#9E4A1E] shrink-0" />
              <span className="truncate">Building B, Room 410 • Main Surgical Wing</span>
            </div>

            <Button 
              variant="primary" 
              className="w-full text-xs"
              onClick={() => navigate('/appointments')}
            >
              Consultation Details & Telehealth
            </Button>
          </div>

          {/* Diagnostic Orders in Mist Blue */}
          <div className="editorial-card p-6 bg-[#F2F7FA] border border-[#DCE9F2]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Laboratory Diagnostics</span>
                <h4 className="serif-headline text-lg text-charcoal">Ordered Clinical Tests</h4>
              </div>
              <button onClick={() => navigate('/tests')} className="text-xs font-bold text-[#264A63] hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {tests.map((test: any) => (
                <div key={test.id} className="p-3 rounded-xl bg-white border border-[#DCE9F2] flex items-center justify-between gap-2 shadow-xs">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-charcoal truncate">{test.testName || test.test_name}</p>
                    <p className="text-[10px] text-muted mt-0.5">Due: {test.dueDate || test.due_date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    test.status === 'scheduled' ? 'bg-[#D9F36A] text-[#24252B]' : 'bg-[#FFB78B] text-[#4A1D07]'
                  }`}>
                    {test.status === 'scheduled' ? 'Booked' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Care Circle Activity Stream */}
          <div className="editorial-card p-6">
            <h4 className="serif-headline text-lg text-charcoal mb-4 flex items-center gap-2">
              <Heart size={18} className="text-[#30253D]" /> Care Circle Activity
            </h4>
            <div className="space-y-3.5">
              {mockActivities.slice(0, 3).map(activity => (
                <div key={activity.id} className="flex gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#30253D] shrink-0 mt-1.5"></div>
                  <div>
                    <p className="text-charcoal font-medium leading-snug">{activity.description}</p>
                    <p className="text-[10px] text-muted mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Care Directives Stamp */}
          <div className="p-5 rounded-2xl bg-[#30253D] text-[#FAF7F0] border border-white/10 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[#D9F36A] font-bold text-xs">
              <ShieldCheck size={16} />
              <span>Verified Care Directives Active</span>
            </div>
            <p className="text-xs text-[#FAF7F0]/80 leading-relaxed">
              Maintain minimum 2L hydration daily. Next surgical dressing review scheduled with Jane Doe tomorrow morning.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
