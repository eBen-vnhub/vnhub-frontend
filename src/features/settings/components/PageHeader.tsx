import type { ReactNode } from 'react';

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export default function PageHeader({ icon, title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-main flex items-center gap-2 mb-2">
        <div className="w-6 h-6 text-brand flex items-center justify-center">
          {icon}
        </div>
        {title}
      </h1>
      <p className="text-muted text-sm">{subtitle}</p>
    </div>
  );
}
