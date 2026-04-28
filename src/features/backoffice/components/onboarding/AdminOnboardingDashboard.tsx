import { useState, useMemo } from 'react';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { useOnboardingTickets } from '../../hooks/useOnboardingTickets';
import type { OnboardingTicket, TicketStatus } from '../../../../types/onboarding';
import TicketDetailModal from './TicketDetailModal';
import { ClipboardList, Search, Filter, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useNotifications } from '../../../../hooks/useNotifications';
import StatusBadge from './StatusBadge';
import AssignVSMForm from './AssignVSMForm';
import onboardingService from '../../../../services/onboarding';
import toast from 'react-hot-toast';

export default function AdminOnboardingDashboard() {
  const { t } = useLanguage();
  const { tickets, isLoading, error, updateTicketLocally, refetch } = useOnboardingTickets();
  const [selectedTicket, setSelectedTicket] = useState<OnboardingTicket | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isSubmitting, setIsSubmitting] = useState(false);

  useNotifications(() => {
    refetch();
  });

  const handleTicketUpdate = (updated: OnboardingTicket) => {
    updateTicketLocally(updated);
    setSelectedTicket(updated);
  };

  const handleAdminAssign = async (ticketId: string, vsmId: string) => {
    if (!vsmId) return;
    setIsSubmitting(true);
    try {
      const updated = await onboardingService.assignTicket(ticketId, parseInt(vsmId));
      updateTicketLocally(updated);
      toast.success(t.onboarding.toast.assignSuccess);
    } catch {
      toast.error(t.onboarding.toast.assignError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.vendor_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
      const matchesCountry = countryFilter === 'ALL' || ticket.vendor_country === countryFilter;
      return matchesSearch && matchesStatus && matchesCountry;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [tickets, searchTerm, statusFilter, countryFilter]);

  const uniqueCountries = useMemo(() => {
    const countries = tickets.map(t => t.vendor_country).filter(Boolean);
    return Array.from(new Set(countries));
  }, [tickets]);

  const vsmWorkload = useMemo(() => {
    const workload: Record<string, number> = {};
    tickets.forEach(ticket => {
      if (ticket.assigned_vsm_name && ticket.status !== 'COMPLETED') {
        workload[ticket.assigned_vsm_name] = (workload[ticket.assigned_vsm_name] || 0) + 1;
      }
    });
    return Object.entries(workload).sort((a, b) => b[1] - a[1]);
  }, [tickets]);

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

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ClipboardList className="w-6 h-6 text-brand" />
            <h1 className="text-2xl font-bold text-main">Onboarding Pipeline</h1>
          </div>
          <p className="text-sm text-muted ms-9">Master overview of all vendor onboarding tickets.</p>
        </div>
      </div>

      {vsmWorkload.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-main mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-brand" />
            {t.onboarding.dashboard?.vsmActiveWorkload || 'VSM Active Workload'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {vsmWorkload.map(([vsm, count]) => (
              <div key={vsm} className="flex items-center gap-2 bg-surface-hover border border-border px-3 py-1.5 rounded-full text-sm">
                <span className="font-semibold text-main">{vsm}</span>
                <span className="bg-brand/10 text-brand text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface border border-border rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-border bg-surface-hover/30 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder={t.onboarding.dashboard?.searchVendor || 'Search vendor...'}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all bg-surface"
              />
            </div>
            
            <div className="flex items-center gap-2 relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                className="w-full pl-9 pr-8 py-2 border border-border rounded-xl text-sm appearance-none bg-surface focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
              >
                <option value="ALL">{t.onboarding.dashboard?.allStatuses || 'All Statuses'}</option>
                <option value="UNASSIGNED">{t.onboarding.status.UNASSIGNED}</option>
                <option value="DATA_COLLECTION">{t.onboarding.status.DATA_COLLECTION}</option>
                <option value="VSM_REVIEW">{t.onboarding.status.VSM_REVIEW}</option>
                <option value="OPS_IN_PROGRESS">{t.onboarding.status.OPS_IN_PROGRESS}</option>
                <option value="BENEFIT_IN_TESTING">{t.onboarding.status.BENEFIT_IN_TESTING}</option>
                <option value="PENDING_GO_LIVE">{t.onboarding.status.PENDING_GO_LIVE}</option>
                <option value="VSM_FINAL_REVIEW">{t.onboarding.status.VSM_FINAL_REVIEW}</option>
                <option value="COMPLETED">{t.onboarding.status.COMPLETED}</option>
              </select>
            </div>

            <div className="flex items-center gap-2 relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />
              <select
                value={countryFilter}
                onChange={(e) => { setCountryFilter(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-8 py-2 border border-border rounded-xl text-sm appearance-none bg-surface focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
              >
                <option value="ALL">{t.onboarding.dashboard?.allCountries || 'All Countries'}</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-hover/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-xs">{t.onboarding.columns?.vendor || 'Vendor'}</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-xs">{t.onboarding.columns?.country || 'Country'}</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-xs">{t.onboarding.columns?.plan || 'Plan'}</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-xs">{t.onboarding.columns?.status || 'Status'}</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-xs">{t.onboarding.columns?.vsm || 'VSM'}</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-xs">{t.onboarding.columns?.ops || 'Ops'}</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-xs">{t.onboarding.columns?.created || 'Created'}</th>
                <th className="px-6 py-4 font-bold text-muted uppercase tracking-wider text-xs text-right">{t.onboarding.columns?.action || 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList className="w-8 h-8 mb-2 opacity-20" />
                      <p>{t.onboarding.dashboard?.noQueue || 'No tickets found matching criteria'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-main whitespace-nowrap">{ticket.vendor_name}</td>
                    <td className="px-6 py-4 text-muted">{ticket.vendor_country || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                        {ticket.subscription_plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={ticket.status} label={t.onboarding.status[ticket.status]} />
                    </td>
                    <td className="px-6 py-4 text-muted font-medium whitespace-nowrap">
                      {ticket.assigned_vsm_name || (
                        <div className="w-48" onClick={e => e.stopPropagation()}>
                          <AssignVSMForm onAssign={(vsmId) => handleAdminAssign(ticket.id, vsmId)} isSubmitting={isSubmitting} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted whitespace-nowrap">{ticket.assigned_ops_name || '-'}</td>
                    <td className="px-6 py-4 text-muted whitespace-nowrap">{new Date(ticket.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-3 py-1.5 text-xs font-bold text-brand hover:text-brand-hover hover:bg-brand/5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {t.onboarding.actions?.viewDetails || 'View Details'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 sm:p-6 border-t border-border flex items-center justify-between bg-surface-hover/30">
            <span className="text-sm font-semibold text-muted">
              {t.onboarding.dashboard?.showingEntries
                ? t.onboarding.dashboard.showingEntries
                    .replace('{{start}}', String((currentPage - 1) * itemsPerPage + 1))
                    .replace('{{end}}', String(Math.min(currentPage * itemsPerPage, filteredTickets.length)))
                    .replace('{{total}}', String(filteredTickets.length))
                : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredTickets.length)} of ${filteredTickets.length} entries`
              }
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border text-muted hover:text-brand hover:border-brand disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border text-muted hover:text-brand hover:border-brand disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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
