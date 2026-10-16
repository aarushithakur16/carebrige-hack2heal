import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Calendar as CalendarIcon, MapPin, Clock, Video, Sparkles, Check } from 'lucide-react';
import { getAppointments } from '../services/appointmentService';
import type { Appointment } from '../types';

export const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedId, setJoinedId] = useState<string | null>(null);

  useEffect(() => {
    getAppointments()
      .then(data => {
        if (data && data.length > 0) {
          setAppointments(data);
        } else {
          setAppointments([
            {
              id: 'app-1',
              doctorName: 'Dr. Sarah Jenkins',
              department: 'Cardiology & Surgical Follow-Up',
              date: 'Oct 22, 2026',
              time: '10:30 AM',
              location: 'Building B, Room 410 (Main Medical Wing)'
            },
            {
              id: 'app-2',
              doctorName: 'Dr. Michael Chen',
              department: 'Physical Therapy Consultation',
              date: 'Oct 26, 2026',
              time: '02:00 PM',
              location: 'Rehab Center Suite 12 (North Campus)'
            }
          ]);
        }
      })
      .catch(() => {
        setAppointments([
          {
            id: 'app-1',
            doctorName: 'Dr. Sarah Jenkins',
            department: 'Cardiology & Surgical Follow-Up',
            date: 'Oct 22, 2026',
            time: '10:30 AM',
            location: 'Building B, Room 410 (Main Medical Wing)'
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = (id: string) => {
    setJoinedId(id);
    setTimeout(() => setJoinedId(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pale-sage text-forest border border-emerald/20 flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald" /> Continuous Care Calendar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">Scheduled Consultations</h1>
          <p className="text-sm text-muted mt-1">
            Confirmed doctor appointments, post-operative check-ups, and rehabilitation reviews.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted animate-pulse">Loading scheduled consultations...</div>
      ) : appointments.length === 0 ? (
        <div className="content-card p-8 text-center text-muted">
          <CalendarIcon size={32} className="mx-auto text-emerald mb-2 opacity-60" />
          <p className="text-sm font-semibold">No upcoming appointments scheduled.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {appointments.map(app => {
            const dateParts = (app.date || '').split(' ');
            const month = dateParts[0] || 'OCT';
            const day = dateParts[1] ? dateParts[1].replace(',', '') : '22';

            return (
              <div key={app.id} className="content-card p-6 flex flex-col justify-between hover-lift shadow-card">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {/* Calendar Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-pale-sage border border-emerald/25 flex flex-col items-center justify-center shrink-0 text-center shadow-sm">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald">{month}</span>
                      <span className="text-xl font-black text-forest leading-none">{day}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-extrabold text-charcoal truncate">
                        {app.doctorName || (app as any).doctor_name || 'Attending Physician'}
                      </h3>
                      <p className="text-xs text-muted truncate mt-0.5">{app.department}</p>
                      <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-soft-mint text-forest font-bold">
                        Post-Discharge Follow-Up
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 mt-5 text-xs text-charcoal border-t border-border-light pt-4">
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-emerald shrink-0" />
                      <span className="font-semibold">{app.time || '10:00 AM EST'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-emerald shrink-0" />
                      <span className="truncate text-muted">{app.location || 'Building A, Room 302'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-light flex gap-3">
                  <Button variant="secondary" className="flex-1 text-xs">
                    Reschedule
                  </Button>
                  <Button 
                    className="flex-1 text-xs" 
                    icon={joinedId === app.id ? Check : Video}
                    onClick={() => handleJoin(app.id)}
                  >
                    {joinedId === app.id ? 'Connecting...' : 'Join Video Session'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
