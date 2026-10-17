import { Footprints, Moon, Droplets, Pill, CheckCircle2 } from 'lucide-react';

interface HealthGoalsProps {
  steps?: number;
  stepsGoal?: number;
  sleepHours?: number;
  sleepGoalHours?: number;
  waterLiters?: number;
  waterGoalLiters?: number;
  medsTaken?: number;
  medsTotal?: number;
}

export const HealthGoalsCard: React.FC<HealthGoalsProps> = ({
  steps = 2900,
  stepsGoal = 8000,
  sleepHours = 7.4,
  sleepGoalHours = 8.0,
  waterLiters = 1.8,
  waterGoalLiters = 2.4,
  medsTaken = 4,
  medsTotal = 6
}) => {
  const stepsPercent = Math.min(100, Math.round((steps / stepsGoal) * 100));
  const sleepPercent = Math.min(100, Math.round((sleepHours / sleepGoalHours) * 100));
  const waterPercent = Math.min(100, Math.round((waterLiters / waterGoalLiters) * 100));
  const medsPercent = medsTotal > 0 ? Math.min(100, Math.round((medsTaken / medsTotal) * 100)) : 100;

  const goals = [
    {
      title: 'Daily Steps Goal',
      icon: Footprints,
      current: `${steps.toLocaleString()}`,
      target: `${stepsGoal.toLocaleString()} steps`,
      percent: stepsPercent,
      color: '#174B3B'
    },
    {
      title: 'Sleep Target',
      icon: Moon,
      current: `${sleepHours}h`,
      target: `${sleepGoalHours}h target`,
      percent: sleepPercent,
      color: '#174B3B'
    },
    {
      title: 'Hydration Intake',
      icon: Droplets,
      current: `${waterLiters}L`,
      target: `${waterGoalLiters}L daily`,
      percent: waterPercent,
      color: '#315E4E'
    },
    {
      title: 'Medication Adherence',
      icon: Pill,
      current: `${medsTaken}/${medsTotal}`,
      target: 'doses on schedule',
      percent: medsPercent,
      color: '#174B3B'
    }
  ];

  return (
    <div className="card-sage p-6 sm:p-7 flex flex-col justify-between h-full min-h-[300px] shadow-subtle border border-[#A9BEB0]/50">
      {/* Header (Matches Reference Image) */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[#17231E]">
            Health Goals
          </h3>
          <p className="text-xs text-[#68766E] mt-0.5">
            Active daily milestones & protocol adherence
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/70 text-[#174B3B] border border-[#A9BEB0]/40">
          Day 4 Post-Op
        </span>
      </div>

      {/* Progress Bars (Matches Reference Styling) */}
      <div className="space-y-4 my-auto">
        {goals.map((goal, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <goal.icon size={14} className="text-[#174B3B]" />
                <span className="font-bold text-[#17231E]">{goal.title}</span>
                <span className="text-[11px] text-[#68766E] hidden sm:inline">
                  ({goal.current} of {goal.target})
                </span>
              </div>
              <span className="font-extrabold text-[#17231E]">{goal.percent}%</span>
            </div>

            {/* Custom Smooth Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-white/60 overflow-hidden border border-[#A9BEB0]/30">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${goal.percent}%`,
                  backgroundColor: goal.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-2 border-t border-[#A9BEB0]/30 flex items-center justify-between text-xs text-[#68766E]">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 size={13} className="text-[#174B3B]" /> Protocol on schedule
        </span>
        <span className="font-bold text-[#17231E]">Adherence: {medsPercent}%</span>
      </div>
    </div>
  );
};
