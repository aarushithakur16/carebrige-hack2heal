import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from './Button';
import { DocumentCard } from './DocumentCard';

type UploadStatus = 'Idle' | 'Uploading' | 'Processing' | 'Extraction Ready';

export const DocumentUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('Idle');
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSetFile = (file: File) => {
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadStatus('Idle');
      setProgress(0);
    } else {
      alert('Please select a PDF or Image file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    if (!selectedFile) return;
    
    setUploadStatus('Uploading');
    setProgress(0);
    
    // Simulate Uploading phase (0-50%)
    let currentProgress = 0;
    const uploadInterval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 50) {
        clearInterval(uploadInterval);
        setUploadStatus('Processing');
        
        // Simulate Processing phase (50-100%)
        const processInterval = setInterval(() => {
          currentProgress += 10;
          setProgress(currentProgress);
          
          if (currentProgress >= 100) {
            clearInterval(processInterval);
            setUploadStatus('Extraction Ready');
          }
        }, 400);
      }
    }, 200);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus('Idle');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="document-uploader max-w-2xl mx-auto">
      
      {!selectedFile ? (
        <div 
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-white/20 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-slate-800 rounded-full text-primary">
              <UploadCloud size={40} />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Drag & Drop your document here</h3>
          <p className="text-muted text-sm mb-6">Supports PDF, JPG, PNG (Max 10MB)</p>
          
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="application/pdf, image/*"
            onChange={handleFileSelect}
          />
          <Button 
            variant="secondary" 
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <DocumentCard 
            file={selectedFile} 
            progress={progress} 
            status={uploadStatus} 
            onRemove={removeFile}
          />
          
          {uploadStatus === 'Idle' && (
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={removeFile}>Cancel</Button>
              <Button onClick={simulateUpload}>Upload Document</Button>
            </div>
          )}
          
          {uploadStatus === 'Extraction Ready' && (
            <div className="flex flex-col items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 mt-4 text-center space-y-4">
              <p>Mock OCR extraction complete. Data is ready for review.</p>
              <Button onClick={() => window.location.href = '/verification'}>
                Review & Verify Data
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
