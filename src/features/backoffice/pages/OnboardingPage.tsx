import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useOnboardingTickets } from '../hooks/useOnboardingTickets';
import { KANBAN_COLUMNS } from '../../../types/onboarding';
import type { OnboardingTicket } from '../../../types/onboarding';
import KanbanColumn from '../components/onboarding/KanbanColumn';
import TicketDetailDrawer from '../components/onboarding/TicketDetailDrawer';
import { useNotifications } from '../../../hooks/useNotifications';

export default function OnboardingPage() {
  const { t } = useLanguage();
  const { tickets, isLoading, error, updateTicketLocally, refetch } = useOnboardingTickets();
  const [selectedTicket, setSelectedTicket] = useState<OnboardingTicket | null>(null);

  // Auto-refresh tickets when a WebSocket notification arrives
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
          <h1 className="text-2xl font-bold text-main">{t.onboarding.pageTitle}</h1>
        </div>
        <p className="text-sm text-muted ms-9">{t.onboarding.pageSubtitle}</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(KANBAN_COLUMNS).map(([key, statuses]) => (
          <KanbanColumn
            key={key}
            columnKey={key}
            statuses={statuses}
            tickets={tickets}
            onTicketClick={setSelectedTicket}
          />
        ))}
      </div>

      <TicketDetailDrawer
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdate={handleTicketUpdate}
      />
    </div>
  );
}
