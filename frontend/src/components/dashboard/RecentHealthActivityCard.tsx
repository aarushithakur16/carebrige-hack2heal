import { Calendar, Pill, FileText, CheckCircle2, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'appointment' | 'medication' | 'record' | 'goal';
  title: string;
  detail: string;
  time: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'appointment',
    title: 'Consultation Scheduled',
    detail: 'Cardiology follow-up booked with Dr. Sarah Jenkins for Oct 22',
    time: '2 hours ago'
  },
  {
    id: 'act-2',
    type: 'medication',
    title: 'Medication Dose Confirmed',
    detail: 'Amoxicillin 500mg logged after morning meal',
    time: '4 hours ago'
  },
  {
    id: 'act-3',
    type: 'record',
    title: 'Medical Record OCR Verified',
    detail: 'Discharge Summary clinical extraction confirmed by clinician',
    time: 'Yesterday'
  },
  {
    id: 'act-4',
    type: 'goal',
    title: 'Wellness Milestone Reached',
    detail: 'Completed Day 4 gentle mobility walk (12 minutes)',
    time: 'Yesterday'
  }
];

export const RecentHealthActivityCard: React.FC = () => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar size={14} className="text-[#174B3B]" />;
      case 'medication':
        return <Pill size={14} className="text-[#315E4E]" />;
      case 'record':
        return <FileText size={14} className="text-[#17231E]" />;
      case 'goal':
        return <CheckCircle2 size={14} className="text-emerald-700" />;
    }
  };

  return (
    <div className="card-white p-6 sm:p-7 flex flex-col justify-between h-full shadow-card border border-[#D6E1D7]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[#17231E]">
            Recent Health Activity
          </h3>
          <p className="text-xs text-[#68766E] mt-0.5">
            Audit trail of care events & milestone achievements
          </p>
        </div>
        <span 
          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF0E8] text-[#174B3B] border border-[#D6E1D7]"
          title="Clinical activity feed"
        >
          Activity Feed
        </span>
      </div>

      {/* Activity Items List */}
      <div className="space-y-3.5 my-auto">
        {DEFAULT_ACTIVITIES.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#EAF0E8]/50 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#EAF0E8] flex items-center justify-center shrink-0 border border-[#D6E1D7]">
              {getIcon(item.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-[#17231E] truncate">{item.title}</h4>
                <span className="text-[10px] text-[#68766E] font-medium shrink-0 flex items-center gap-1">
                  <Clock size={10} /> {item.time}
                </span>
              </div>
              <p className="text-[11px] text-[#68766E] leading-snug mt-0.5">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-2 border-t border-[#D6E1D7] flex items-center justify-between text-xs text-[#68766E]">
        <span>Caregiver circle notified of verified logs</span>
        <span className="font-semibold text-[#174B3B]">Encrypted Audit Log</span>
      </div>
    </div>
  );
};
