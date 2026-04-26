import type { OnboardingTicket, TicketStatus } from '../../../../types/onboarding';
import { useLanguage } from '../../../../i18n/LanguageContext';
import TicketCard from './TicketCard';

interface KanbanColumnProps {
  columnKey: string;
  statuses: TicketStatus[];
  tickets: OnboardingTicket[];
  onTicketClick: (ticket: OnboardingTicket) => void;
}

const COLUMN_ACCENT: Record<string, string> = {
  QUEUE: 'bg-gray-400',
  DATA_COLLECTION: 'bg-amber-400',
  REVIEW: 'bg-purple-400',
  TECHNICAL_SETUP: 'bg-indigo-400',
  FINAL_REVIEW: 'bg-cyan-400',
  DONE: 'bg-emerald-400',
};

export default function KanbanColumn({ columnKey, statuses, tickets, onTicketClick }: KanbanColumnProps) {
  const { t } = useLanguage();

  const columnTitle = t.onboarding.columns[columnKey as keyof typeof t.onboarding.columns] || columnKey;
  const filteredTickets = tickets.filter(ticket => statuses.includes(ticket.status));

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className={`w-2 h-2 rounded-full ${COLUMN_ACCENT[columnKey] || 'bg-gray-400'}`} />
        <h3 className="text-sm font-bold text-main">{columnTitle}</h3>
        <span className="ml-auto text-xs font-semibold text-hint bg-gray-100 rounded-full px-2 py-0.5">
          {filteredTickets.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-260px)] px-1 pb-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-8 text-xs text-hint border-2 border-dashed border-gray-200 rounded-xl">
            {t.onboarding.labels.noTickets}
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} onClick={onTicketClick} />
          ))
        )}
      </div>
    </div>
  );
}
