import type { Patient } from '../data/mockPatients';

interface Props {
  patient: Patient;
  delayIndex: number;
}

export const PatientCard: React.FC<Props> = ({ patient, delayIndex }) => {
  const isCritical = patient.status === 'Critical';
  const delayClass = `delay-${(delayIndex % 3 + 1) * 100}`;

  return (
    <div className={`glass-panel patient-card animate-slide-up ${delayClass}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{patient.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            ID: {patient.id} • {patient.age} yrs
          </p>
        </div>
        <span className={`status-badge ${isCritical ? 'status-critical' : 'status-stable'}`}>
          {patient.status}
        </span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Condition</p>
        <p style={{ fontWeight: '500' }}>{patient.condition}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: 'auto' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <p>Attending: <span style={{ color: 'var(--text-main)' }}>{patient.doctor}</span></p>
          <p style={{ marginTop: '4px' }}>Updated {patient.lastUpdated}</p>
        </div>
        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
          View Details
        </button>
      </div>
    </div>
  );
};
