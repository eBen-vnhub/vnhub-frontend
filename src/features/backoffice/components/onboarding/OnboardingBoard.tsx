import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { useOnboardingTickets } from '../../hooks/useOnboardingTickets';
import { ONBOARDING_COLUMNS } from '../../../../types/onboarding';
import type { OnboardingTicket } from '../../../../types/onboarding';
import KanbanColumn from './KanbanColumn';
import TicketDetailModal from './TicketDetailModal';
import { useNotifications } from '../../../../hooks/useNotifications';

interface OnboardingBoardProps {
  title: string;
  subtitle: string;
  columns: (keyof typeof ONBOARDING_COLUMNS)[];
  boardId?: string;
}

export default function OnboardingBoard({ title, subtitle, columns, boardId }: OnboardingBoardProps) {
  const { t } = useLanguage();
  const { tickets, isLoading, error, updateTicketLocally, refetch } = useOnboardingTickets();
  const [selectedTicket, setSelectedTicket] = useState<OnboardingTicket | null>(null);

  useNotifications(() => {
    refetch();
  });

  const handleTicketUpdate = (updated: OnboardingTicket) => {
    updateTicketLocally(updated);
    setSelectedTicket(updated);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        {t.common.error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold text-main">{title}</h1>
        </div>
        <p className="text-sm text-muted ms-9">{subtitle}</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((key) => {
          const statuses = ONBOARDING_COLUMNS[key];
          if (!statuses) return null;
          return (
            <KanbanColumn
              key={key}
              columnKey={key}
              statuses={statuses}
              tickets={tickets}
              onTicketClick={setSelectedTicket}
              boardId={boardId || 'onboarding'}
            />
          );
        })}
      </div>

      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdate={handleTicketUpdate}
      />
    </div>
  );
}
