import React, { useState } from 'react';
import { ShieldAlert, Phone, AlertTriangle, X, Check, BellRing, Stethoscope, UserCheck } from 'lucide-react';
import { Button } from '../Button';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [confirmEmergencyCall, setConfirmEmergencyCall] = useState(false);
  const [notificationSent, setNotificationSent] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNotifyCaregiver = () => {
    setNotificationSent('Caregiver Jane Doe has been notified with high priority alert.');
    setTimeout(() => setNotificationSent(null), 4000);
  };

  const handlePageClinician = () => {
    setNotificationSent('Dr. Sarah Jenkins has been paged with your urgent clinical telemetry.');
    setTimeout(() => setNotificationSent(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17231E]/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D6E1D7] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Urgent Header Banner */}
        <div className="bg-[#174B3B] text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center shadow-md">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Emergency Support</h2>
              <p className="text-xs text-[#D6E1D7]">CareBridge Rapid Response & Clinical Safety</p>
            </div>
          </div>
          
          <div className="mt-3 p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-[#EAF0E8] leading-relaxed flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-300 shrink-0 mt-0.5" />
            <span>
              If you are facing a life-threatening condition (severe chest pressure, inability to breathe, sudden loss of consciousness), call emergency services immediately.
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {notificationSent && (
            <div className="p-3 rounded-2xl bg-[#D6E1D7] text-[#174B3B] text-xs font-semibold flex items-center gap-2 border border-[#A9BEB0] animate-fade-in">
              <Check size={16} className="text-[#174B3B] shrink-0" />
              <span>{notificationSent}</span>
            </div>
          )}

          {/* Primary 911 Call with Safe Explicit Confirmation */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-red-600" />
                <span className="font-bold text-sm text-red-900">National Emergency Services (911)</span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-800">
                24/7 Dispatch
              </span>
            </div>
            
            <p className="text-xs text-red-700 leading-snug mb-3">
              Requires explicit confirmation before placing the emergency call.
            </p>

            {!confirmEmergencyCall ? (
              <button
                onClick={() => setConfirmEmergencyCall(true)}
                className="w-full py-2.5 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Phone size={14} /> Request Emergency Call (911)
              </button>
            ) : (
              <div className="p-3 bg-white rounded-xl border border-red-300 space-y-2">
                <p className="text-xs font-bold text-red-900 text-center">
                  Confirm: Are you sure you want to dial 911 right now?
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:911"
                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs text-center transition-colors"
                  >
                    Yes, Call 911
                  </a>
                  <button
                    onClick={() => setConfirmEmergencyCall(false)}
                    className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Provider & Hotline Direct Access */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#68766E]">
              CareBridge Clinical Contacts
            </h3>

            {/* Clinician Direct Page */}
            <div className="p-3.5 rounded-2xl bg-[#EAF0E8] border border-[#D6E1D7] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#174B3B] text-white flex items-center justify-center shrink-0">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17231E]">Dr. Sarah Jenkins (Cardiothoracic)</h4>
                  <p className="text-[11px] text-[#68766E]">Primary Surgical Attending • Clinic Wing B</p>
                </div>
              </div>
              <button
                onClick={handlePageClinician}
                className="px-3 py-1.5 rounded-full bg-[#174B3B] hover:bg-[#216450] text-white text-[11px] font-semibold transition-all shrink-0"
              >
                Page Clinician
              </button>
            </div>

            {/* Caregiver Circle Contact */}
            <div className="p-3.5 rounded-2xl bg-[#EAF0E8] border border-[#D6E1D7] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#315E4E] text-white flex items-center justify-center shrink-0">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17231E]">Jane Doe (Spouse / Caregiver)</h4>
                  <p className="text-[11px] text-[#68766E]">Designated Next of Kin • +1 (555) 018-9281</p>
                </div>
              </div>
              <button
                onClick={handleNotifyCaregiver}
                className="px-3 py-1.5 rounded-full bg-[#315E4E] hover:bg-[#216450] text-white text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1"
              >
                <BellRing size={12} /> Alert
              </button>
            </div>

            {/* 24/7 Nurse Advice Line */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#D6E1D7] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D6E1D7] text-[#174B3B] flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17231E]">24/7 Post-Discharge Triage Line</h4>
                  <p className="text-[11px] text-[#68766E]">1-800-555-CARE (Toll-Free, Clinical Team)</p>
                </div>
              </div>
              <a
                href="tel:18005552273"
                className="px-3 py-1.5 rounded-full bg-[#D6E1D7] hover:bg-[#A9BEB0] text-[#174B3B] text-[11px] font-bold transition-all shrink-0"
              >
                Call Hotline
              </a>
            </div>
          </div>

          {/* Red Flag Warning Symptoms */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E2DDD3]">
            <h4 className="text-xs font-bold text-[#17231E] mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-600" /> Post-Operative Warning Signs to Report
            </h4>
            <ul className="text-[11px] text-[#68766E] space-y-1 list-disc list-inside">
              <li>Oral temperature equal to or exceeding 38.5°C (101.3°F)</li>
              <li>Sudden swelling, heat, or spreading redness at incision site</li>
              <li>Shortness of breath, chest tightness, or rapid resting heart rate</li>
              <li>Inability to keep liquids down for more than 12 hours</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7FAF6] border-t border-[#D6E1D7] flex justify-end">
          <Button variant="secondary" onClick={onClose} className="text-xs">
            Dismiss Window
          </Button>
        </div>
      </div>
    </div>
  );
};
