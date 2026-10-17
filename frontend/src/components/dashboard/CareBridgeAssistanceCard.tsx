import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  CalendarPlus, 
  FileText, 
  Stethoscope, 
  HeartPulse, 
  ArrowRight
} from 'lucide-react';

interface CareBridgeAssistanceProps {
  onOpenEmergencyModal: () => void;
  onOpenAddAppointment: () => void;
}

export const CareBridgeAssistanceCard: React.FC<CareBridgeAssistanceProps> = ({
  onOpenEmergencyModal,
  onOpenAddAppointment
}) => {
  const navigate = useNavigate();

  return (
    <div className="card-white p-6 sm:p-7 flex flex-col justify-between h-full shadow-card border border-[#D6E1D7]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#174B3B] text-white flex items-center justify-center">
              <HeartPulse size={16} />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-[#17231E]">
              CareBridge Assistance
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF0E8] text-[#174B3B] border border-[#D6E1D7]">
            Continuity Active
          </span>
        </div>

        <p className="text-xs text-[#68766E] leading-relaxed mb-4">
          Direct concierge shortcuts connecting you with your surgical attending team, caregiver circle, and medical records.
        </p>
      </div>

      {/* Grid of Actionable Assistance Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
        {/* 1. Emergency Support Shortcut (with safe explicit confirmation requirement) */}
        <button
          onClick={onOpenEmergencyModal}
          className="p-3.5 rounded-2xl bg-red-50 hover:bg-red-100/70 border border-red-200 text-left transition-all group flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-red-900">
              <span>Emergency Support</span>
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-red-700 leading-snug mt-0.5">
              Requires confirmation before placing calls
            </p>
          </div>
        </button>

        {/* 2. Find Healthcare Provider / Doctor Contact */}
        <button
          onClick={() => navigate('/appointments')}
          className="p-3.5 rounded-2xl bg-[#EAF0E8] hover:bg-[#D6E1D7] border border-[#D6E1D7] text-left transition-all group flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#174B3B] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Stethoscope size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#17231E]">Primary Care Team</h4>
            <p className="text-[11px] text-[#68766E] leading-snug mt-0.5">
              Dr. Sarah Jenkins & clinical nurses
            </p>
          </div>
        </button>

        {/* 3. Book Follow-Up Appointment */}
        <button
          onClick={onOpenAddAppointment}
          className="p-3.5 rounded-2xl bg-[#EAF0E8] hover:bg-[#D6E1D7] border border-[#D6E1D7] text-left transition-all group flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#315E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <CalendarPlus size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#17231E]">Book Follow-Up</h4>
            <p className="text-[11px] text-[#68766E] leading-snug mt-0.5">
              Schedule consultation or telehealth
            </p>
          </div>
        </button>

        {/* 4. Access Medical Records */}
        <button
          onClick={() => navigate('/documents')}
          className="p-3.5 rounded-2xl bg-[#EAF0E8] hover:bg-[#D6E1D7] border border-[#D6E1D7] text-left transition-all group flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#17231E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <FileText size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#17231E]">Discharge Records</h4>
            <p className="text-[11px] text-[#68766E] leading-snug mt-0.5">
              OCR-verified notes & directives
            </p>
          </div>
        </button>
      </div>

      {/* Patient-Doctor Continuity Banner */}
      <div className="pt-3 mt-2 border-t border-[#D6E1D7] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#174B3B]"></div>
          <span className="text-xs text-[#68766E]">Care Circle coordination active</span>
        </div>

        <button
          onClick={() => navigate('/clinician')}
          className="text-xs font-bold text-[#174B3B] hover:underline flex items-center gap-1"
        >
          Clinician Summary <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
