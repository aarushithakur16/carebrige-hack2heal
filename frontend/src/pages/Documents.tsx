import { DocumentUploader } from '../components/DocumentUploader';
import { Card } from '../components/Card';
import { FileText, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const Documents: React.FC = () => {
  const recentDocuments = [
    {
      id: 'doc-hist-1',
      title: 'Inpatient_Discharge_Summary_GeneralHospital.pdf',
      type: 'Discharge Summary',
      date: 'Oct 14, 2026',
      itemsCount: '4 Meds, 2 Appts',
      status: 'verified'
    },
    {
      id: 'doc-hist-2',
      title: 'PostOp_Prescription_Cardiology.jpg',
      type: 'Prescription Note',
      date: 'Oct 15, 2026',
      itemsCount: '2 Meds Extracted',
      status: 'verified'
    }
  ];

  return (
    <div className="documents-page-container max-w-6xl mx-auto space-y-7 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#5B21B6] border border-[#C4B5FD]/40 flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#5B21B6]" /> OCR & NLP Entity Extraction
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#166534]" /> HIPAA Redaction Engine Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">Clinical Document Ingestion</h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Upload hospital discharge papers, handwritten doctor prescriptions, or diagnostic lab tests to automatically extract active medications, instructions, and appointments.
          </p>
        </div>
      </div>
      
      {/* Upload Zone Panel */}
      <div className="content-card p-6 sm:p-9 shadow-card">
        <DocumentUploader />
      </div>

      {/* Previously Processed Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-charcoal flex items-center gap-2">
            <Clock size={18} className="text-[#0F172A]" /> Ingestion History & Promoted Records
          </h2>
          <span className="text-xs text-muted font-medium">2 Documents Active</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recentDocuments.map(doc => (
            <Card key={doc.id} className="p-4 flex items-center justify-between hover-lift">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 bg-[#F1F5F9] text-[#0F172A] rounded-xl border border-[#E2E8F0] shrink-0">
                  <FileText size={22} />
                </div>
                <div className="min-w-0 pr-2">
                  <h4 className="font-bold text-sm text-charcoal truncate">{doc.title}</h4>
                  <p className="text-xs text-muted mt-0.5">{doc.type} • {doc.date} • {doc.itemsCount}</p>
                </div>
              </div>
              <StatusBadge status={doc.status} label="Promoted" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
