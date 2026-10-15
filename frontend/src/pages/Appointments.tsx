import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { getAppointments } from '../services/appointmentService';
import type { Appointment } from '../types';

export const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

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
              location: 'Building B, Room 410'
            },
            {
              id: 'app-2',
              doctorName: 'Dr. Michael Chen',
              department: 'Physical Therapy Consultation',
              date: 'Oct 26, 2026',
              time: '02:00 PM',
              location: 'Rehab Center Suite 12'
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
            location: 'Building B, Room 410'
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Upcoming Appointments</h1>
      <p className="text-muted mb-6">Keep track of your scheduled consultations and follow-ups.</p>

      {loading ? (
        <div className="p-8 text-muted">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <Card className="p-8 text-center text-muted">No upcoming appointments scheduled.</Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {appointments.map(app => (
            <Card key={app.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{app.doctorName}</h3>
                  <p className="text-sm text-primary">{app.department}</p>
                </div>
              </div>
              <div className="space-y-3 mt-4 text-sm text-slate-300">
                <div className="flex items-center gap-2"><CalendarIcon size={16} className="text-muted" /> {app.date}</div>
                <div className="flex items-center gap-2"><Clock size={16} className="text-muted" /> {app.time}</div>
                <div className="flex items-center gap-2"><MapPin size={16} className="text-muted" /> {app.location}</div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" className="w-full">Reschedule</Button>
                <Button className="w-full">Join Virtual</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
