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
        <span className="font-bold text-forest flex items-center gap-1.5">
          {status === 'Extraction Ready' ? (
            <Sparkles size={14} className="text-emerald" />
          ) : (
            <Loader2 size={14} className="animate-spin text-emerald" />
          )}
          {status === 'Uploading' && 'Uploading document to encrypted repository...'}
          {status === 'Processing' && 'Running intelligent OCR & parsing medical entities...'}
          {status === 'Extraction Ready' && 'Clinical entity extraction complete & validated'}
        </span>
        <span className="font-extrabold text-forest bg-pale-sage px-2.5 py-0.5 rounded-full border border-emerald/20">{progress}%</span>
      </div>

      <div className="w-full bg-pale-sage rounded-full h-2 overflow-hidden border border-emerald/10">
        <div 
          className="bg-gradient-to-r from-forest-green to-emerald h-2 rounded-full transition-all duration-300 shadow-sm" 
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
                  ? 'bg-soft-mint/60 border-emerald/20 text-forest font-bold' 
                  : isCurrent 
                    ? 'bg-pale-sage border-emerald/40 text-forest font-bold' 
                    : 'bg-warm-cream border-border-light text-muted'
              }`}
            >
              <div className="text-[10px] flex items-center justify-center gap-1">
                {isDone ? <CheckCircle2 size={11} className="text-emerald" /> : null}
                <span>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
