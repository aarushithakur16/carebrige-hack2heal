
interface StatusBadgeProps {
  status: 'critical' | 'stable' | 'warning' | 'info' | 'success' | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  const normalized = (status || 'info').toLowerCase();
  let variant = 'info';

  if (['stable', 'taken', 'completed', 'active', 'verified', 'success'].includes(normalized)) {
    variant = 'stable';
  } else if (['critical', 'missed', 'rejected', 'severe'].includes(normalized)) {
    variant = 'critical';
  } else if (['warning', 'delayed', 'pending', 'moderate'].includes(normalized)) {
    variant = 'warning';
  } else {
    variant = 'info';
  }

  const displayLabel = label || status;

  return (
    <span className={`status-badge status-${variant} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {displayLabel}
    </span>
  );
};
