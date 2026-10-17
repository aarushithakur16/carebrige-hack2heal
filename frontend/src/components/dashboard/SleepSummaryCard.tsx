import { Moon, Heart } from 'lucide-react';

interface SleepSummaryProps {
  durationHours?: number;
  durationMins?: number;
  goalHours?: number;
  quality?: string;
  restingHeartRate?: number;
}

export const SleepSummaryCard: React.FC<SleepSummaryProps> = ({
  durationHours = 7,
  durationMins = 24,
  goalHours = 8,
  quality = 'Optimal Recovery',
  restingHeartRate = 80
}) => {
  const totalMinutes = durationHours * 60 + durationMins;
  const goalMinutes = goalHours * 60;
  const percent = Math.min(100, Math.round((totalMinutes / goalMinutes) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-base font-bold text-[#17231E] flex items-center gap-1.5">
          <span>Sleep & Night Vitals</span>
        </h4>
        <span className="text-[11px] font-semibold text-[#68766E]">Telemetry Log</span>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {/* Sub-Card 1: Night Resting Heart Rate (Matches Reference) */}
        <div className="card-sage p-4 rounded-2xl flex flex-col justify-between hover-card">
          <div className="flex items-center justify-between text-[#17231E]">
            <span className="text-xs font-bold">Heart Rate</span>
            <div className="w-6 h-6 rounded-lg bg-white/70 flex items-center justify-center text-[#174B3B]">
              <Heart size={14} className="fill-[#174B3B]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#17231E] tracking-tight">
              {restingHeartRate}
            </span>
            <span className="text-xs text-[#68766E] font-medium ml-1">BPM</span>
          </div>
          <p className="text-[10px] text-[#68766E] mt-1 font-medium">Resting baseline</p>
        </div>

        {/* Sub-Card 2: Sleep Duration & Quality (Matches Reference) */}
        <div className="card-sage p-4 rounded-2xl flex flex-col justify-between hover-card">
          <div className="flex items-center justify-between text-[#17231E]">
            <span className="text-xs font-bold">Sleep</span>
            <div className="w-6 h-6 rounded-lg bg-white/70 flex items-center justify-center text-[#174B3B]">
              <Moon size={14} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#17231E] tracking-tight">
              {durationHours}.{Math.floor(durationMins / 6)}
            </span>
            <span className="text-xs text-[#68766E] font-medium ml-1">hrs</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#174B3B] font-bold mt-1">
            <span>{quality}</span>
            <span>{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
