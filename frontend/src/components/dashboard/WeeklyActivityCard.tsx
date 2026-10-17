import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChevronDown } from 'lucide-react';

interface ActivityPoint {
  day: string;
  steps: number;
  activeMins: number;
}

const WEEKLY_DATA: Record<string, ActivityPoint[]> = {
  'this-week': [
    { day: 'Mon', steps: 450, activeMins: 15 },
    { day: 'Tue', steps: 320, activeMins: 12 },
    { day: 'Wed', steps: 680, activeMins: 22 },
    { day: 'Thu', steps: 950, activeMins: 30 },
    { day: 'Fri', steps: 780, activeMins: 26 },
    { day: 'Sat', steps: 1120, activeMins: 40 },
    { day: 'Sun', steps: 890, activeMins: 28 },
  ],
  'all-may': [
    { day: 'Mon', steps: 380, activeMins: 14 },
    { day: 'Tue', steps: 520, activeMins: 18 },
    { day: 'Wed', steps: 460, activeMins: 15 },
    { day: 'Thu', steps: 720, activeMins: 25 },
    { day: 'Fri', steps: 980, activeMins: 35 },
    { day: 'Sat', steps: 840, activeMins: 28 },
    { day: 'Sun', steps: 1050, activeMins: 38 },
  ],
  'last-week': [
    { day: 'Mon', steps: 300, activeMins: 10 },
    { day: 'Tue', steps: 410, activeMins: 14 },
    { day: 'Wed', steps: 590, activeMins: 20 },
    { day: 'Thu', steps: 650, activeMins: 22 },
    { day: 'Fri', steps: 800, activeMins: 26 },
    { day: 'Sat', steps: 920, activeMins: 30 },
    { day: 'Sun', steps: 780, activeMins: 24 },
  ]
};

export const WeeklyActivityCard: React.FC = () => {
  const [rangeKey, setRangeKey] = useState<'this-week' | 'all-may' | 'last-week'>('all-may');
  const [showDropdown, setShowDropdown] = useState(false);

  const rangeLabels: Record<string, string> = {
    'all-may': 'All May',
    'this-week': 'This Week',
    'last-week': 'Last 7 Days'
  };

  const data = WEEKLY_DATA[rangeKey] || WEEKLY_DATA['all-may'];

  return (
    <div className="card-white p-6 sm:p-7 flex flex-col justify-between h-full min-h-[380px] shadow-card">
      {/* Header with Title and Range Selector */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[#17231E]">
            Weekly Activity
          </h3>
          <p className="text-xs text-[#68766E] mt-0.5">
            Active movement & recovery tracking
          </p>
        </div>

        {/* Date-Range Selector Pill */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF0E8] hover:bg-[#D6E1D7] text-xs font-bold text-[#17231E] border border-[#D6E1D7] transition-all"
          >
            <span>{rangeLabels[rangeKey]}</span>
            <ChevronDown size={13} className="text-[#68766E]" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-9 w-36 bg-white border border-[#D6E1D7] rounded-2xl shadow-xl py-1.5 z-30 animate-fade-in">
              {Object.entries(rangeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setRangeKey(key as any);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    rangeKey === key 
                      ? 'bg-[#EAF0E8] text-[#174B3B]' 
                      : 'text-[#17231E] hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Line / Area Chart */}
      <div className="w-full h-56 my-auto pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="forestActivityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#174B3B" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#174B3B" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAF0E8" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#68766E" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={6}
            />
            <YAxis 
              stroke="#68766E" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 1200]}
              ticks={[0, 300, 600, 900, 1200]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#17231E',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(23, 35, 30, 0.2)',
                color: '#FFFFFF',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              labelStyle={{ color: '#D6E1D7', fontWeight: 700, marginBottom: '2px' }}
              itemStyle={{ color: '#FFFFFF', fontWeight: 600 }}
              formatter={(value: any) => [`${value} Activity Units`, 'Active Score']}
            />
            <Area 
              type="monotone" 
              dataKey="steps" 
              name="Activity" 
              stroke="#174B3B" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#forestActivityGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div className="flex items-center justify-between pt-3 border-t border-[#D6E1D7] text-xs text-[#68766E]">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#174B3B]"></span>
          <span>Consistent mobility recovery (+18% this week)</span>
        </div>
        <span className="font-bold text-[#17231E]">Goal Met: 5/7 Days</span>
      </div>
    </div>
  );
};
