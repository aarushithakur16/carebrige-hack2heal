import { Moon, Footprints, Flame, Timer, Sparkles } from 'lucide-react';

interface DailySnapshotProps {
  steps?: number;
  stepsGoal?: number;
  activeMinutes?: number;
  caloriesBurned?: number;
  sleepHours?: number;
  sleepMinutes?: number;
  sleepGoalHours?: number;
}

export const DailySnapshotCard: React.FC<DailySnapshotProps> = ({
  steps = 2900,
  stepsGoal = 8000,
  activeMinutes = 24,
  caloriesBurned = 420,
  sleepHours = 7,
  sleepMinutes = 23,
  sleepGoalHours = 8
}) => {
  const stepPercent = Math.min(100, Math.round((steps / stepsGoal) * 100));
  const totalSleepMinutes = sleepHours * 60 + sleepMinutes;
  const sleepPercent = Math.min(100, Math.round((totalSleepMinutes / (sleepGoalHours * 60)) * 100));

  // Circular gauge arc calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.8
  // Open 270 degree arc
  const arcLength = circumference * 0.75; // ~330
  const strokeOffset = arcLength - (arcLength * stepPercent) / 100;

  return (
    <div className="card-forest p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden h-full min-h-[380px] shadow-forest">
      {/* Subtle Ambient Background Gradient */}
      <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[#315E4E]/40 blur-2xl pointer-events-none"></div>

      {/* Card Header */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Daily Snapshot
        </h3>
        <span 
          className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10 text-[#D6E1D7] border border-white/15 flex items-center gap-1"
          title="Telemetry sourced from simulated wearable tracker"
        >
          <Sparkles size={11} className="text-[#A9BEB0]" /> Connected Telemetry
        </span>
      </div>

      {/* Center: Open Circular Progress Ring (Matches Reference Image) */}
      <div className="relative z-10 flex flex-col items-center justify-center my-3">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-135" viewBox="0 0 180 180">
            {/* Background Track Arc */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="11"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
              fill="none"
            />
            {/* Active Progress Arc */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#D6E1D7"
              strokeWidth="11"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Central Values */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold text-white tracking-tight leading-none">
              {steps.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-[#D6E1D7] uppercase tracking-wider mt-1">
              Steps
            </span>
            
            {/* Footprints Icon */}
            <div className="mt-2 text-[#D6E1D7]">
              <Footprints size={17} className="opacity-90" />
            </div>
          </div>
        </div>

        {/* Goal Indicator */}
        <p className="text-xs text-[#D6E1D7]/90 font-medium mt-1">
          {stepPercent}% of daily {stepsGoal.toLocaleString()} goal
        </p>
      </div>

      {/* Metrics Row: Active Minutes & Calories */}
      <div className="relative z-10 grid grid-cols-2 gap-3 my-2 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
          <div className="w-7 h-7 rounded-lg bg-[#315E4E] flex items-center justify-center text-[#D6E1D7]">
            <Timer size={14} />
          </div>
          <div>
            <p className="text-[10px] text-[#A9BEB0] font-semibold uppercase">Active</p>
            <p className="text-xs font-bold text-white">{activeMinutes} mins</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
          <div className="w-7 h-7 rounded-lg bg-[#315E4E] flex items-center justify-center text-[#D6E1D7]">
            <Flame size={14} />
          </div>
          <div>
            <p className="text-[10px] text-[#A9BEB0] font-semibold uppercase">Burned</p>
            <p className="text-xs font-bold text-white">{caloriesBurned} kcal</p>
          </div>
        </div>
      </div>

      {/* Bottom: Sleep Summary Mini Section (Matches Reference Image) */}
      <div className="relative z-10 mt-2 p-3 rounded-2xl bg-white/10 border border-white/15">
        <div className="flex items-center justify-between text-xs text-white mb-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <Moon size={14} className="text-[#D6E1D7]" />
            <span>Sleep</span>
          </div>
          <span className="text-[11px] font-semibold text-[#D6E1D7]">
            {sleepHours}h {sleepMinutes}m / {sleepGoalHours}h
          </span>
        </div>

        {/* Compact Progress Bar */}
        <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
          <div 
            className="h-full rounded-full bg-[#D6E1D7] transition-all duration-1000 ease-out"
            style={{ width: `${sleepPercent}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-[10px] text-[#A9BEB0] mt-1.5">
          <span>Restful recovery</span>
          <span className="text-[#D6E1D7] font-semibold">{sleepPercent}% reached</span>
        </div>
      </div>
    </div>
  );
};
