import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function EmptyState({ icon, title, description, className = 'text-center py-12' }: EmptyStateProps) {
  return (
    <div className={`${className} flex flex-col items-center justify-center space-y-2`}>
      <div className="text-gray-400 rounded-full flex items-center justify-center">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
