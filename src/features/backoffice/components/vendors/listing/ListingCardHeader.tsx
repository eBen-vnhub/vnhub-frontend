import { Calendar } from 'lucide-react';
import { formatListingDate } from './utils';

interface Props {
  icon: React.ReactNode;
  title: string;
  submittedAt?: string;
  accentClass?: string;
}

export default function ListingCardHeader({ icon, title, submittedAt, accentClass = 'bg-brand/5' }: Props) {
  return (
    <div className={`${accentClass} border-b border-border/50 px-6 py-4 flex flex-wrap items-center justify-between gap-3`}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-bold text-main">{title}</h3>
      </div>
      <div className="flex items-center gap-3">
        {submittedAt && (
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Calendar className="w-3.5 h-3.5" />
            {formatListingDate(submittedAt)}
          </span>
        )}
      </div>
    </div>
  );
}
