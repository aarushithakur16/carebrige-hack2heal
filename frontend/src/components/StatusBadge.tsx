import React from 'react';

interface StatusBadgeProps {
  status: 'critical' | 'stable' | 'warning' | 'info' | 'success';
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  return (
    <span className={`status-badge status-${status}`}>
      {label}
    </span>
  );
};
