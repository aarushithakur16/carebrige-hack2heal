import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  status: 'Uploading' | 'Processing' | 'Extraction Ready';
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress, status }) => {
  const steps = [
    { label: 'Secure Ingestion', min: 20 },
    { label: 'OCR Text Extraction', min: 60 },
    { label: 'AI Entity Parsing', min: 100 }
  ];

  return (
    <div className="w-full mt-4 space-y-3">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
          {status === 'Extraction Ready' ? (
            <Sparkles size={14} className="text-[#166534]" />
          ) : (
            <Loader2 size={14} className="animate-spin text-[#0F172A]" />
          )}
          {status === 'Uploading' && 'Uploading document to encrypted repository...'}
          {status === 'Processing' && 'Running intelligent OCR & parsing medical entities...'}
          {status === 'Extraction Ready' && 'Clinical entity extraction complete & validated'}
        </span>
        <span className="font-extrabold text-[#0F172A] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full border border-[#E2E8F0]">{progress}%</span>
      </div>

      <div className="w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
        <div 
          className="bg-[#0F172A] h-2 rounded-full transition-all duration-300 shadow-sm" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1">
        {steps.map((s, idx) => {
          const isDone = progress >= s.min;
          const isCurrent = progress < s.min && (idx === 0 || progress >= steps[idx - 1].min);
          return (
            <div 
              key={s.label} 
              className={`p-2 rounded-xl border text-center transition-all ${
                isDone 
                  ? 'bg-[#DCFCE7] border-[#86EFAC]/40 text-[#166534] font-bold' 
                  : isCurrent 
                    ? 'bg-[#F1F5F9] border-[#0F172A] text-[#0F172A] font-bold' 
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-muted'
              }`}
            >
              <div className="text-[10px] flex items-center justify-center gap-1">
                {isDone ? <CheckCircle2 size={11} className="text-[#166534]" /> : null}
                <span>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
