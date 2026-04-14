import { Calendar } from 'lucide-react';
import { formatListingDate } from './utils';

interface Props {
  icon: React.ReactNode;
  title: string;
  status: string | null;
  submittedAt?: string;
  accentClass?: string;
}

export default function ListingCardHeader({ icon, title, status, submittedAt, accentClass = 'bg-brand/5' }: Props) {
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
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
          status ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500'
        }`}>
          {status || 'NOT SUBMITTED'}
        </span>
      </div>
    </div>
  );
}
