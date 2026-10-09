import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="empty-state glass-panel flex flex-col items-center justify-center text-center p-8">
      <div className="empty-state-icon mb-4">
        <Icon size={48} className="text-muted" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted mb-6 max-w-md">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
