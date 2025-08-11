import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function EmptyState({ icon, title, description, className = 'text-center py-12' }: EmptyStateProps) {
  return (
    <div className={className}>
      <div className="mx-auto h-12 w-12 text-gray-400">{icon}</div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
