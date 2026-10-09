import { DocumentUploader } from '../components/DocumentUploader';

export const Documents: React.FC = () => {
  return (
    <div className="documents-page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Medical Documents</h1>
        <p className="text-muted">Upload prescriptions, test reports, and discharge summaries for automated processing.</p>
      </div>
      
      <div className="glass-panel p-8">
        <DocumentUploader />
      </div>
    </div>
  );
};
