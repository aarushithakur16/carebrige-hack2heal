import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Info } from 'lucide-react';

interface MacroItem {
  name: string;
  shortName: string;
  value: number;
  color: string;
}

const MACRO_DATA: MacroItem[] = [
  { name: 'Carbohydrates', shortName: 'Carbs', value: 48, color: '#174B3B' },
  { name: 'Protein', shortName: 'Protein', value: 20, color: '#315E4E' },
  { name: 'Fats', shortName: 'Fats', value: 15, color: '#68766E' },
  { name: 'Fiber / Other', shortName: 'Fiber', value: 17, color: '#FFFFFF' },
];

export const NutritionOverviewCard: React.FC = () => {
  return (
    <div className="card-soft-sage p-6 sm:p-7 flex flex-col justify-between h-full min-h-[380px] shadow-subtle border border-[#174B3B]/15">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold tracking-tight text-[#17231E]">
          Macro Balance
        </h3>
        <span 
          className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/40 text-[#17231E] border border-[#17231E]/10"
          title="Sample nutrition intake for reference only"
        >
          Demo Intake
        </span>
      </div>

      <p className="text-xs text-[#17231E]/75 leading-relaxed">
        Post-procedure recovery dietary balance. High protein supports tissue regeneration.
      </p>

      {/* Donut Chart and Legend Row (Matches Reference Image) */}
      <div className="flex items-center justify-between gap-4 my-auto py-2">
        {/* Left: Recharts Donut Pie */}
        <div className="w-36 h-36 shrink-0 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                formatter={(val: any, name: any) => [`${val}%`, name]}
                contentStyle={{
                  backgroundColor: '#17231E',
                  borderRadius: '10px',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  padding: '6px 10px'
                }}
              />
              <Pie
                data={MACRO_DATA}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {MACRO_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Nutritive Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-[#17231E]">1,850</span>
            <span className="text-[9px] uppercase font-semibold text-[#17231E]/70">kcal</span>
          </div>
        </div>

        {/* Right: Legend with dot indicators matching reference */}
        <div className="flex-1 space-y-2">
          {MACRO_DATA.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-[#17231E]">{item.shortName}</span>
              </div>
              <span className="font-bold text-[#17231E]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-3 border-t border-[#17231E]/10 flex items-start gap-1.5 text-[10px] text-[#17231E]/70 leading-normal">
        <Info size={13} className="shrink-0 mt-0.5 text-[#17231E]" />
        <span>Values are for demonstrative recovery tracking only. Follow physician dietary guidelines.</span>
      </div>
    </div>
  );
};
