import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Plus, Video, MapPin, Clock } from 'lucide-react';
import type { Appointment } from '../../types';
import { AddAppointmentModal } from './AddAppointmentModal';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onAppointmentAdded: (appt: Appointment) => void;
}

export const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  onAppointmentAdded
}) => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="card-sage p-6 sm:p-7 flex flex-col justify-between h-full min-h-[300px] shadow-subtle border border-[#A9BEB0]/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#17231E]">
              Upcoming Appointments
            </h3>
            <p className="text-xs text-[#68766E] mt-0.5">
              Scheduled clinical consults & follow-up care
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-white/80 text-[#174B3B] text-xs font-bold transition-all shadow-xs border border-[#A9BEB0]/40"
            >
              <Plus size={13} /> Add Appointment
            </button>
            <button
              onClick={() => navigate('/appointments')}
              className="text-xs font-bold text-[#174B3B] hover:underline px-2 py-1"
            >
              View All
            </button>
          </div>
        </div>

        {/* Appointment List (Matches Reference Visual Layout) */}
        {appointments.length > 0 ? (
          <div className="space-y-3 my-auto">
            {appointments.slice(0, 3).map((appt) => {
              const isTelehealth = (appt.location || '').toLowerCase().includes('telehealth') || (appt.location || '').toLowerCase().includes('video');
              const doctor = appt.doctorName || appt.doctor_name || 'Dr. Sarah Jenkins';
              const dept = appt.department || 'Cardiology Follow-Up';
              const dateStr = appt.date || 'Upcoming';
              const timeStr = appt.time || '10:00 AM';

              return (
                <div
                  key={appt.id}
                  onClick={() => navigate('/appointments')}
                  className="p-4 rounded-2xl bg-white/70 hover:bg-white border border-[#A9BEB0]/30 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#174B3B] flex items-center justify-center shrink-0 border border-[#A9BEB0]/30 shadow-xs">
                      <Calendar size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#17231E] truncate group-hover:text-[#174B3B] transition-colors">
                          {doctor}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF0E8] text-[#174B3B] border border-[#D6E1D7] shrink-0">
                          {dept}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#68766E] mt-1">
                        <span className="font-semibold text-[#17231E]">{dateStr}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#174B3B]" /> {timeStr}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 truncate">
                          {isTelehealth ? (
                            <>
                              <Video size={12} className="text-blue-600" />
                              <span className="text-blue-700 font-semibold">Telehealth Video</span>
                            </>
                          ) : (
                            <>
                              <MapPin size={12} className="text-[#174B3B]" />
                              <span>In-Person Clinic</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/80 group-hover:bg-[#174B3B] text-[#17231E] group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Friendly Empty State with Schedule CTA */
          <div className="p-8 rounded-2xl bg-white/60 border border-dashed border-[#A9BEB0] text-center space-y-3 my-auto">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#174B3B] flex items-center justify-center mx-auto shadow-xs">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#17231E]">No Upcoming Appointments</p>
              <p className="text-xs text-[#68766E] mt-0.5">
                All follow-up consultations have been completed or none are scheduled yet.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#174B3B] text-white text-xs font-bold shadow-xs hover:bg-[#216450] transition-all"
            >
              <Plus size={14} /> Schedule Follow-Up Consult
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 mt-2 border-t border-[#A9BEB0]/30 flex items-center justify-between text-xs text-[#68766E]">
          <span>Direct clinical continuity with post-discharge attending team</span>
          <span className="font-semibold text-[#17231E]">{appointments.length} Consultations Booked</span>
        </div>
      </div>

      <AddAppointmentModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAppointmentCreated={onAppointmentAdded}
      />
    </>
  );
};
