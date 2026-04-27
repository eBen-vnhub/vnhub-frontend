import { useState, useMemo } from 'react';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { useOnboardingTickets } from '../../hooks/useOnboardingTickets';
import type { OnboardingTicket } from '../../../../types/onboarding';
import TicketDetailModal from './TicketDetailModal';
import { ClipboardList, LayoutDashboard, Clock, PlayCircle, Loader2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNotifications } from '../../../../hooks/useNotifications';

type FilterType = 'QUEUE' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export default function AdminOnboardingDashboard() {
  const { t } = useLanguage();
  const { tickets, isLoading, error, updateTicketLocally, refetch } = useOnboardingTickets();
  const [selectedTicket, setSelectedTicket] = useState<OnboardingTicket | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useNotifications(() => {
    refetch();
  });

  const handleTicketUpdate = (updated: OnboardingTicket) => {
    updateTicketLocally(updated);
    setSelectedTicket(updated);
  };

  const queueTickets = useMemo(() => tickets.filter(t => t.status === 'UNASSIGNED'), [tickets]);
  const inProgTickets = useMemo(() => tickets.filter(t => ['AWAITING_VENDOR_LISTING', 'READY_FOR_OPS', 'OPS_IN_PROGRESS'].includes(t.status)), [tickets]);
  const reviewTickets = useMemo(() => tickets.filter(t => ['VSM_REVIEW', 'VSM_FINAL_REVIEW'].includes(t.status)), [tickets]);
  const completedTickets = useMemo(() => tickets.filter(t => t.status === 'COMPLETED').sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()), [tickets]);

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
        {t.common?.error || 'An error occurred'}
      </div>
    );
  }

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    setCurrentPage(1);
  };

  const getFilteredTickets = () => {
    switch (activeFilter) {
      case 'QUEUE': return queueTickets;
      case 'IN_PROGRESS': return inProgTickets;
      case 'REVIEW': return reviewTickets;
      case 'COMPLETED': return completedTickets;
      default: return queueTickets; // Default to Queue if null
    }
  };

  const currentDisplayTickets = getFilteredTickets();
  const totalPages = Math.ceil(currentDisplayTickets.length / itemsPerPage);
  const paginatedTickets = currentDisplayTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <LayoutDashboard className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold text-main">{t.onboarding.dashboard?.title || 'Onboarding Overview'}</h1>
        </div>
        <p className="text-sm text-muted ms-9">{t.onboarding.dashboard?.subtitle || 'Master overview of all active vendor onboarding stages and statuses.'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => handleFilterClick('QUEUE')}
          className={`bg-surface border p-6 rounded-3xl shadow-sm cursor-pointer transition-all ${activeFilter === 'QUEUE' ? 'border-brand ring-2 ring-brand/20' : 'border-border hover:border-brand/50'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-muted">{t.onboarding.dashboard?.queueCount || 'Queue'}</h3>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-main">{queueTickets.length}</p>
        </div>
        <div 
          onClick={() => handleFilterClick('IN_PROGRESS')}
          className={`bg-surface border p-6 rounded-3xl shadow-sm cursor-pointer transition-all ${activeFilter === 'IN_PROGRESS' ? 'border-brand ring-2 ring-brand/20' : 'border-border hover:border-brand/50'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-muted">{t.onboarding.dashboard?.inProgressCount || 'In Progress'}</h3>
            <PlayCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-main">{inProgTickets.length}</p>
        </div>
        <div 
          onClick={() => handleFilterClick('REVIEW')}
          className={`bg-surface border p-6 rounded-3xl shadow-sm cursor-pointer transition-all ${activeFilter === 'REVIEW' ? 'border-brand ring-2 ring-brand/20' : 'border-border hover:border-brand/50'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-muted">{t.onboarding.dashboard?.reviewCount || 'Review'}</h3>
            <Loader2 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-black text-main">{reviewTickets.length}</p>
        </div>
        <div 
          onClick={() => handleFilterClick('COMPLETED')}
          className={`bg-surface border p-6 rounded-3xl shadow-sm cursor-pointer transition-all ${activeFilter === 'COMPLETED' ? 'border-brand ring-2 ring-brand/20' : 'border-border hover:border-brand/50'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-muted">{t.onboarding.dashboard?.doneCount || 'Done'}</h3>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-main">{completedTickets.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <h2 className="text-lg font-bold text-main flex items-center gap-2 mb-6">
            <ClipboardList className="w-5 h-5 text-brand" />
            {activeFilter ? t.onboarding.dashboard?.[`${activeFilter.toLowerCase()}Section` as keyof typeof t.onboarding.dashboard] || activeFilter : (t.onboarding.dashboard?.queueSection || 'Queue — Awaiting VSM Assignment')}
          </h2>
          
          <div className="flex-1 flex flex-col">
            {paginatedTickets.length === 0 ? (
              <div className="text-center py-8 text-muted text-sm border border-dashed border-border rounded-xl">
                {t.onboarding.dashboard?.noQueue || 'No tickets found'}
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {paginatedTickets.map(ticket => (
                  <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-hover/50 border border-border rounded-xl gap-4">
                    <div>
                      <h4 className="font-bold text-main">{ticket.vendor_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-brand/10 text-brand rounded-full">{ticket.subscription_plan} {t.onboarding.labels.plan}</span>
                        <span className="text-xs text-muted">• {new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-4 py-2 bg-brand/10 text-brand text-sm font-bold rounded-lg hover:bg-brand hover:text-white transition-colors whitespace-nowrap"
                    >
                      {ticket.status === 'UNASSIGNED' ? t.onboarding.actions.assignVsm : t.onboarding.actions.viewDetails}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <span className="text-xs font-bold text-muted">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-border text-muted hover:text-brand hover:border-brand disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-border text-muted hover:text-brand hover:border-brand disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-main flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            {t.onboarding.dashboard?.recentlyCompleted || 'Recently Completed'}
          </h2>
          {completedTickets.length === 0 ? (
            <div className="text-center py-8 text-muted text-sm border border-dashed border-border rounded-xl">
              {t.onboarding.dashboard?.noCompleted || 'No completed tickets yet'}
            </div>
          ) : (
            <div className="space-y-3">
              {completedTickets.slice(0, 5).map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-surface-hover/50 border border-border rounded-xl">
                  <div>
                    <h4 className="font-bold text-main">{ticket.vendor_name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                      <span>{ticket.subscription_plan} {t.onboarding.labels.plan}</span>
                      <span>•</span>
                      <span>{new Date(ticket.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-main">
                    VSM: {ticket.assigned_vsm_name || '-'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleTicketUpdate}
        />
      )}
    </div>
  );
}
