import React from 'react';

interface UploadProgressProps {
  progress: number;
  status: 'Uploading' | 'Processing' | 'Extraction Ready';
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress, status }) => {
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-primary">{status}...</span>
        <span className="text-muted">{progress}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
