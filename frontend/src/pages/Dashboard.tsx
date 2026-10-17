import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthUser, apiFetch } from '../services/api';
import { 
  mockTasks, 
  mockAppointments, 
  mockTests, 
  mockMedicationSummary 
} from '../data/mockDashboard';
import type { Appointment, CareTask } from '../types';

// Upgraded Reference Dashboard Components
import { DailySnapshotCard } from '../components/dashboard/DailySnapshotCard';
import { WeeklyActivityCard } from '../components/dashboard/WeeklyActivityCard';
import { NutritionOverviewCard } from '../components/dashboard/NutritionOverviewCard';
import { SleepSummaryCard } from '../components/dashboard/SleepSummaryCard';
import { HealthVitalsCards } from '../components/dashboard/HealthVitalsCards';
import { UpcomingAppointmentsCard } from '../components/dashboard/UpcomingAppointmentsCard';
import { HealthGoalsCard } from '../components/dashboard/HealthGoalsCard';
import { CareBridgeAssistanceCard } from '../components/dashboard/CareBridgeAssistanceCard';
import { RecentHealthActivityCard } from '../components/dashboard/RecentHealthActivityCard';
import { EmergencyModal } from '../components/dashboard/EmergencyModal';
import { AddAppointmentModal } from '../components/dashboard/AddAppointmentModal';

import { Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<CareTask[]>(mockTasks as any);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments as any);
  const [tests, setTests] = useState<any[]>(mockTests);
  const [medSummary, setMedSummary] = useState(mockMedicationSummary);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Modals State
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [addApptOpen, setAddApptOpen] = useState(false);

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
        .catch(err => {
          console.warn('Backend care-plan fetch fallback to mock data:', err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleAppointmentAdded = (newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);
    showToast(`Appointment booked with ${newAppt.doctorName || 'Dr. Sarah Jenkins'}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-80 bg-white/60 rounded-3xl"></div>
          <div className="h-80 bg-white/60 rounded-3xl"></div>
          <div className="h-80 bg-white/60 rounded-3xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-white/60 rounded-3xl"></div>
          <div className="h-64 bg-white/60 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-7 animate-fade-in pb-16">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#174B3B] text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 border border-white/20 animate-fade-in">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          ROW 1: PRIMARY THREE-CARD HERO GRID (Matches Reference)
          1. Daily Snapshot (Dark Forest Green Card)
          2. Weekly Activity (Light Card with Line/Area Chart)
          3. Macro Balance / Nutrition Overview (Soft Sage Card)
          ======================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {/* A. Daily Health Snapshot */}
        <div className="w-full">
          <DailySnapshotCard 
            steps={2900}
            stepsGoal={8000}
            activeMinutes={24}
            caloriesBurned={420}
            sleepHours={7}
            sleepMinutes={23}
            sleepGoalHours={8}
          />
        </div>

        {/* B. Weekly Activity Chart */}
        <div className="w-full">
          <WeeklyActivityCard />
        </div>

        {/* C. Macro Balance / Nutrition Overview */}
        <div className="w-full md:col-span-2 xl:col-span-1">
          <NutritionOverviewCard />
        </div>
      </section>

      {/* ========================================================
          ROW 2: SLEEP, VITALS & CAREBRIDGE ASSISTANCE
          - Sleep & Night Vitals (Resting HR 80, Sleep duration 7.4h)
          - Clinical Vitals (HR 78 BPM, BP 120/80 mmHg, SpO2 98%, Temp 36.6°C)
          - CareBridge Assistance (Direct emergency shortcut, provider consult)
          ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 cols): Sleep & Clinical Vitals */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <SleepSummaryCard 
            durationHours={7}
            durationMins={24}
            goalHours={8}
            quality="Optimal Rest"
            restingHeartRate={80}
          />

          <HealthVitalsCards />
        </div>

        {/* Right Column (5 cols): CareBridge Specific Assistance Card */}
        <div className="lg:col-span-5 h-full">
          <CareBridgeAssistanceCard 
            onOpenEmergencyModal={() => setEmergencyOpen(true)}
            onOpenAddAppointment={() => setAddApptOpen(true)}
          />
        </div>
      </section>

      {/* ========================================================
          ROW 3: UPCOMING APPOINTMENTS & HEALTH GOALS
          - Upcoming Appointments (Soft Sage Wide Card with Doctor, Specialty, Status)
          - Health Goals (Progress bars for Steps, Sleep, Hydration, Med Adherence)
          - Recent Health Activity Stream
          ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Upcoming Consultations (7 cols) */}
        <div className="lg:col-span-7">
          <UpcomingAppointmentsCard 
            appointments={appointments}
            onAppointmentAdded={handleAppointmentAdded}
          />
        </div>

        {/* Right: Health Goals Progress (5 cols) */}
        <div className="lg:col-span-5">
          <HealthGoalsCard 
            steps={2900}
            stepsGoal={8000}
            sleepHours={7.4}
            sleepGoalHours={8.0}
            waterLiters={1.8}
            waterGoalLiters={2.4}
            medsTaken={medSummary.taken || 4}
            medsTotal={medSummary.total || 6}
          />
        </div>
      </section>

      {/* ========================================================
          ROW 4: RECENT HEALTH ACTIVITY & CLINICAL CONTINUITY BADGE
          ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8">
          <RecentHealthActivityCard />
        </div>

        {/* Care Directives Seal */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#174B3B] text-white shadow-card flex flex-col justify-between h-full min-h-[220px]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={20} className="text-[#D6E1D7]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D6E1D7]">
                Clinical Verification Active
              </span>
            </div>
            <h4 className="text-lg font-bold tracking-tight text-white mb-2">
              Post-Discharge Recovery Protocols
            </h4>
            <p className="text-xs text-[#D6E1D7] leading-relaxed">
              Prescription schedule and post-surgical wound guidelines have been cross-checked by Dr. Jenkins. Adherence is tracked daily.
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-[#A9BEB0]">
              Patient: {user?.name || 'Aarushi'} • {tasks.length} tasks • {tests.length} tests
            </span>
            <button 
              onClick={() => navigate('/verification')}
              className="text-xs font-bold text-white hover:underline flex items-center gap-1"
            >
              Verify Directives <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <EmergencyModal 
        isOpen={emergencyOpen} 
        onClose={() => setEmergencyOpen(false)} 
      />

      <AddAppointmentModal 
        isOpen={addApptOpen} 
        onClose={() => setAddApptOpen(false)}
        onAppointmentCreated={handleAppointmentAdded}
      />

    </div>
  );
};
