import type { OnboardingTicket, TicketStatus } from '../../../../types/onboarding';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { usePreferences } from '../../../../hooks/usePreferences';
import { ChevronRight } from 'lucide-react';
import TicketCard from './TicketCard';

interface KanbanColumnProps {
  columnKey: string;
  statuses: TicketStatus[];
  tickets: OnboardingTicket[];
  onTicketClick: (ticket: OnboardingTicket) => void;
  boardId?: string;
}

const COLUMN_ACCENT: Record<string, string> = {
  QUEUE: 'bg-gray-400',
  DATA_COLLECTION: 'bg-amber-400',
  REVIEW: 'bg-purple-400',
  OPS_QUEUE: 'bg-blue-400',
  TECHNICAL_SETUP: 'bg-cyan-400',
  TESTING: 'bg-indigo-400',
  GO_LIVE: 'bg-orange-400',
  FINAL_REVIEW: 'bg-emerald-400',
  DONE: 'bg-green-500',
  OPS_IN_PROGRESS: 'bg-cyan-400',
  BENEFIT_IN_TESTING: 'bg-indigo-400',
  PENDING_GO_LIVE: 'bg-orange-400',
  VSM_FINAL_REVIEW: 'bg-emerald-400',
  COMPLETED: 'bg-green-500',
};

export default function KanbanColumn({ columnKey, statuses, tickets, onTicketClick, boardId = 'default' }: KanbanColumnProps) {
  const { t } = useLanguage();
  const { getPreference, updatePreference } = usePreferences();

  const prefKey = `kanban_${boardId}_${columnKey}`;
  const isExpanded = getPreference(prefKey, true);

  const columnTitle = t.onboarding.columns[columnKey as keyof typeof t.onboarding.columns] || columnKey;
  const filteredTickets = tickets.filter(ticket => statuses.includes(ticket.status));
  const accentColor = COLUMN_ACCENT[columnKey] || 'bg-gray-400';

  if (!isExpanded) {
    return (
      <button
        onClick={() => updatePreference(prefKey, true)}
        className="flex flex-col items-center gap-2 min-w-[44px] max-w-[44px] bg-surface border border-border rounded-2xl py-4 px-1 hover:border-brand/30 transition-colors cursor-pointer group h-fit"
        title={`${columnTitle} (${filteredTickets.length})`}
      >
        <div className={`w-2 h-2 rounded-full ${accentColor}`} />
        <span className="text-[10px] font-bold text-hint [writing-mode:vertical-lr] rotate-180 whitespace-nowrap">
          {columnTitle}
        </span>
        <span className="text-[10px] font-bold text-brand bg-brand/10 rounded-full w-5 h-5 flex items-center justify-center">
          {filteredTickets.length}
        </span>
        <ChevronRight className="w-3 h-3 text-hint group-hover:text-brand transition-colors" />
      </button>
    );
  }

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
      <div className="flex items-center gap-3 mb-4 px-1">
        <button
          onClick={() => updatePreference(prefKey, false)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          title="Collapse column"
        >
          <div className={`w-2 h-2 rounded-full ${accentColor}`} />
          <h3 className="text-sm font-bold text-main">{columnTitle}</h3>
        </button>
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
