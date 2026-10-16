import { Card } from './Card';
import { FileText, Image, Trash2, FileCheck } from 'lucide-react';
import { UploadProgress } from './UploadProgress';

interface DocumentCardProps {
  file: File;
  progress: number;
  status: 'Uploading' | 'Processing' | 'Extraction Ready' | 'Idle';
  onRemove: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ file, progress, status, onRemove }) => {
  const isImage = file.type.startsWith('image/');
  
  const formatBytes = (bytes: number, decimals = 1) => {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <Card className="p-5 border-emerald/25 bg-white relative overflow-hidden shadow-card rounded-[22px]">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-soft-mint text-forest rounded-xl shrink-0">
          {status === 'Extraction Ready' ? (
            <FileCheck size={26} className="text-forest" />
          ) : isImage ? (
            <Image size={26} />
          ) : (
            <FileText size={26} />
          )}
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h4 className="font-bold text-sm text-charcoal truncate">{file.name}</h4>
          <div className="text-xs text-muted mt-1 flex items-center gap-2.5">
            <span>Size: {formatBytes(file.size)}</span>
            <span>•</span>
            <span className="uppercase text-[11px] font-bold text-emerald">
              {file.type ? file.type.split('/')[1] : 'PDF'}
            </span>
            <span>•</span>
            <span className="text-forest font-semibold">Ready for OCR Extraction</span>
          </div>
          
          {status !== 'Idle' && (
            <UploadProgress progress={progress} status={status as any} />
          )}
        </div>
      </div>
      
      {status === 'Idle' && (
        <button 
          onClick={onRemove}
          className="absolute top-4 right-4 p-2 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          title="Remove file"
          aria-label="Remove document"
        >
          <Trash2 size={17} />
        </button>
      )}
    </Card>
  );
};
