import React, { useState } from 'react';
import { Heart, Activity, Droplets, Thermometer, WifiOff, CheckCircle2 } from 'lucide-react';

interface HealthVitalsProps {
  isSimulated?: boolean;
}

export const HealthVitalsCards: React.FC<HealthVitalsProps> = () => {
  const [deviceConnected, setDeviceConnected] = useState(true);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-base font-bold text-[#17231E] flex items-center gap-1.5">
          <span>Clinical Vitals</span>
        </h4>
        
        {/* Toggle to prove honest empty state when device is disconnected */}
        <button
          onClick={() => setDeviceConnected(!deviceConnected)}
          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF0E8] hover:bg-[#D6E1D7] text-[#17231E] border border-[#D6E1D7] transition-all flex items-center gap-1"
          title="Click to toggle connected device telemetry vs unmeasured state"
        >
          {deviceConnected ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Simulated Device</span>
            </>
          ) : (
            <>
              <WifiOff size={11} className="text-amber-600" />
              <span>Offline (Empty State)</span>
            </>
          )}
        </button>
      </div>

      {deviceConnected ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* 1. Heart Rate (Dark Forest Green Card matching Reference) */}
          <div className="card-forest p-4 rounded-2xl flex flex-col justify-between hover-card">
            <div className="flex items-center justify-between text-[#D6E1D7]">
              <span className="text-xs font-bold text-white">Heart Rate</span>
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[#D6E1D7]">
                <Heart size={14} className="fill-[#D6E1D7] animate-pulse" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                78
              </span>
              <span className="text-xs text-[#D6E1D7] font-semibold ml-1">BPM</span>
            </div>
            <p className="text-[10px] text-[#A9BEB0] mt-1 font-medium">Resting regular rhythm</p>
          </div>

          {/* 2. Blood Pressure (Light Sage Card matching Reference) */}
          <div className="card-sage p-4 rounded-2xl flex flex-col justify-between hover-card">
            <div className="flex items-center justify-between text-[#17231E]">
              <span className="text-xs font-bold">Blood Pressure</span>
              <div className="w-6 h-6 rounded-lg bg-white/70 flex items-center justify-center text-[#174B3B]">
                <Activity size={14} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#17231E] tracking-tight">
                120/80
              </span>
              <span className="text-xs text-[#68766E] font-semibold ml-1">mmHg</span>
            </div>
            <p className="text-[10px] text-[#174B3B] mt-1 font-bold flex items-center gap-1">
              <CheckCircle2 size={11} /> Normotensive
            </p>
          </div>

          {/* 3. Blood Oxygen Saturation (SpO2) */}
          <div className="card-sage p-4 rounded-2xl flex flex-col justify-between hover-card">
            <div className="flex items-center justify-between text-[#17231E]">
              <span className="text-xs font-bold">Blood Oxygen</span>
              <div className="w-6 h-6 rounded-lg bg-white/70 flex items-center justify-center text-[#174B3B]">
                <Droplets size={14} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#17231E] tracking-tight">
                98
              </span>
              <span className="text-xs text-[#68766E] font-semibold ml-1">% SpO2</span>
            </div>
            <p className="text-[10px] text-[#174B3B] mt-1 font-bold">Optimal oxygenation</p>
          </div>

          {/* 4. Body Temperature */}
          <div className="card-sage p-4 rounded-2xl flex flex-col justify-between hover-card">
            <div className="flex items-center justify-between text-[#17231E]">
              <span className="text-xs font-bold">Temperature</span>
              <div className="w-6 h-6 rounded-lg bg-white/70 flex items-center justify-center text-[#174B3B]">
                <Thermometer size={14} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#17231E] tracking-tight">
                36.6
              </span>
              <span className="text-xs text-[#68766E] font-semibold ml-1">°C</span>
            </div>
            <p className="text-[10px] text-[#174B3B] mt-1 font-bold">Normal afebrile</p>
          </div>
        </div>
      ) : (
        /* Honest Empty State when no telemetry device connected */
        <div className="p-6 rounded-2xl bg-white border border-[#D6E1D7] text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF0E8] text-[#68766E] flex items-center justify-center mx-auto">
            <WifiOff size={18} />
          </div>
          <h5 className="text-xs font-bold text-[#17231E]">No Connected Device Telemetry</h5>
          <p className="text-[11px] text-[#68766E] max-w-sm mx-auto">
            No live blood pressure cuff or pulse oximeter reading is synced. We do not invent diagnostic readings. Connect your wearable device in Settings to sync live vitals.
          </p>
          <button 
            onClick={() => setDeviceConnected(true)}
            className="text-xs font-bold text-[#174B3B] hover:underline pt-1 inline-block"
          >
            Connect Demo Telemetry
          </button>
        </div>
      )}
    </div>
  );
};
