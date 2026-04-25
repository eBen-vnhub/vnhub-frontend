import { User, Calendar } from 'lucide-react';
import type { OnboardingTicket } from '../../../../types/onboarding';
import { useLanguage } from '../../../../i18n/LanguageContext';
import StatusBadge from './StatusBadge';

interface TicketCardProps {
  ticket: OnboardingTicket;
  onClick: (ticket: OnboardingTicket) => void;
}

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  const { t } = useLanguage();

  const formattedDate = new Date(ticket.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <button
      onClick={() => onClick(ticket)}
      className="w-full text-start bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-brand/30 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-bold text-main truncate group-hover:text-brand transition-colors">
          {ticket.vendor_name}
        </h4>
        <StatusBadge
          status={ticket.status}
          label={t.onboarding.status[ticket.status]}
        />
      </div>

      <p className="text-xs text-muted mb-3 truncate">
        {t.onboarding.labels.plan}: {ticket.subscription_plan}
      </p>

      <div className="flex items-center justify-between text-xs text-hint">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span>{ticket.assigned_vsm_name || t.onboarding.labels.unassigned}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </button>
  );
}
