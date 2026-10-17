import React, { useState } from 'react';
import { Settings, X, Watch, Bell, Check, Activity } from 'lucide-react';
import { Button } from '../Button';
import { getAuthUser } from '../../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const user = getAuthUser();
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [deviceApple, setDeviceApple] = useState(true);
  const [deviceGarmin, setDeviceGarmin] = useState(false);
  const [medAlerts, setMedAlerts] = useState(true);
  const [dailyCheckinAlerts, setDailyCheckinAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17231E]/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D6E1D7] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#174B3B] text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center">
              <Settings size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Platform Settings</h2>
              <p className="text-xs text-[#D6E1D7]">CareBridge Preferences & Connected Wearables</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 rounded-2xl bg-[#D6E1D7] text-[#174B3B] text-xs font-semibold flex items-center gap-2 border border-[#A9BEB0] animate-fade-in">
              <Check size={16} className="text-[#174B3B]" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {/* User Profile Summary */}
          <div className="p-4 rounded-2xl bg-[#EAF0E8] border border-[#D6E1D7] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#174B3B] text-white flex items-center justify-center font-bold text-sm">
              {(user?.name || 'Aarushi').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#17231E]">{user?.name || 'Aarushi Thakur'}</h3>
              <p className="text-xs text-[#68766E]">{user?.email || 'patient@carebridge.com'} • {user?.role || 'Patient'}</p>
            </div>
          </div>

          {/* Connected Telemetry Devices */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#68766E] mb-3 flex items-center gap-1.5">
              <Watch size={14} className="text-[#174B3B]" /> Health Telemetry Sync
            </h3>
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-white border border-[#D6E1D7] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#17231E]">Apple Health / Watch Sync</p>
                  <p className="text-[11px] text-[#68766E]">Telemetry: Steps, Resting Heart Rate, SpO2</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={deviceApple} 
                    onChange={(e) => setDeviceApple(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#174B3B]"></div>
                </label>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#D6E1D7] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#17231E]">Garmin Health / Oura Ring</p>
                  <p className="text-[11px] text-[#68766E]">Telemetry: Sleep Stages, Overnight Heart Rate</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={deviceGarmin} 
                    onChange={(e) => setDeviceGarmin(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#174B3B]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Measurement Units */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#68766E] mb-3 flex items-center gap-1.5">
              <Activity size={14} className="text-[#174B3B]" /> Measurement Units
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#EAF0E8] border border-[#D6E1D7]">
                <p className="text-xs font-semibold text-[#17231E] mb-2">Temperature Unit</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTempUnit('C')} 
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      tempUnit === 'C' ? 'bg-[#174B3B] text-white shadow-xs' : 'bg-white text-[#68766E]'
                    }`}
                  >
                    °C (Celsius)
                  </button>
                  <button 
                    onClick={() => setTempUnit('F')} 
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      tempUnit === 'F' ? 'bg-[#174B3B] text-white shadow-xs' : 'bg-white text-[#68766E]'
                    }`}
                  >
                    °F (Fahrenheit)
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#EAF0E8] border border-[#D6E1D7]">
                <p className="text-xs font-semibold text-[#17231E] mb-2">Weight Metric</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setWeightUnit('kg')} 
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      weightUnit === 'kg' ? 'bg-[#174B3B] text-white shadow-xs' : 'bg-white text-[#68766E]'
                    }`}
                  >
                    Kilograms (kg)
                  </button>
                  <button 
                    onClick={() => setWeightUnit('lbs')} 
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      weightUnit === 'lbs' ? 'bg-[#174B3B] text-white shadow-xs' : 'bg-white text-[#68766E]'
                    }`}
                  >
                    Pounds (lbs)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Alert Preferences */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#68766E] mb-3 flex items-center gap-1.5">
              <Bell size={14} className="text-[#174B3B]" /> Reminders & Notifications
            </h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#D6E1D7] cursor-pointer">
                <span className="text-xs font-semibold text-[#17231E]">Prescription Dosage Reminders</span>
                <input 
                  type="checkbox" 
                  checked={medAlerts} 
                  onChange={(e) => setMedAlerts(e.target.checked)} 
                  className="w-4 h-4 text-[#174B3B] rounded focus:ring-[#174B3B]"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#D6E1D7] cursor-pointer">
                <span className="text-xs font-semibold text-[#17231E]">Daily Post-Op Care & Symptom Prompts</span>
                <input 
                  type="checkbox" 
                  checked={dailyCheckinAlerts} 
                  onChange={(e) => setDailyCheckinAlerts(e.target.checked)} 
                  className="w-4 h-4 text-[#174B3B] rounded focus:ring-[#174B3B]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7FAF6] border-t border-[#D6E1D7] flex items-center justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="text-xs">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
