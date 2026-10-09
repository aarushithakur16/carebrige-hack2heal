
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`glass-panel ${onClick ? 'cursor-pointer hover-lift' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
