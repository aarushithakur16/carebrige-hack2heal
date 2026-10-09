import React from 'react';
import { Card } from './Card';
import { FileText, Image, Trash2 } from 'lucide-react';
import { UploadProgress } from './UploadProgress';

interface DocumentCardProps {
  file: File;
  progress: number;
  status: 'Uploading' | 'Processing' | 'Extraction Ready' | 'Idle';
  onRemove: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ file, progress, status, onRemove }) => {
  const isImage = file.type.startsWith('image/');
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <Card className="p-4 border-primary/30 mt-4 relative">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-800 rounded-lg text-primary">
          {isImage ? <Image size={24} /> : <FileText size={24} />}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm truncate pr-8">{file.name}</h4>
          <div className="text-xs text-muted mt-1 flex gap-3">
            <span>{formatBytes(file.size)}</span>
            <span>{file.type || 'Unknown Type'}</span>
          </div>
          
          {status !== 'Idle' && (
            <UploadProgress progress={progress} status={status as any} />
          )}
        </div>
      </div>
      
      {status === 'Idle' && (
        <button 
          onClick={onRemove}
          className="absolute top-4 right-4 text-muted hover:text-red-400 transition-colors"
          title="Remove file"
        >
          <Trash2 size={18} />
        </button>
      )}
    </Card>
  );
};
