import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import PageHeader from '../components/PageHeader';
import ActivityLogsList from '../components/activity-logs/ActivityLogsList';
import { ActivitySquare, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { settingsService } from '../../../services/settings';
import type { ActivityLog } from '../../../services/settings';

export default function ActivityLogsPage() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getLogs(dateFilter, page);
      setLogs(data.results);
      setTotalCount(data.count);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogs([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [dateFilter, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setPage(1);
  }, [dateFilter]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    const lower = search.toLowerCase();
    return logs.filter(l => 
      (l.user_name && l.user_name.toLowerCase().includes(lower)) || 
      (l.user_email && l.user_email.toLowerCase().includes(lower)) ||
      l.action.toLowerCase().includes(lower) || 
      l.entity.toLowerCase().includes(lower) ||
      (l.vendor_name && l.vendor_name.toLowerCase().includes(lower)) ||
      (l.vendor_country && l.vendor_country.toLowerCase().includes(lower))
    );
  }, [logs, search]);

  const mappedLogs = filteredLogs.map(l => ({
    id: l.id.toString(),
    user: l.user_name || l.user_email || 'System / External',
    action: l.action,
    entity: l.entity,
    vendor_name: l.vendor_name,
    vendor_country: l.vendor_country,
    details: l.details,
    timestamp: l.timestamp
  }));

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        icon={<ActivitySquare />}
        title={t.settings?.logsTitle || 'Activity Logs'}
        subtitle={t.settings?.logsSubtitle || 'Monitor all system events and user actions.'}
      />

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={t.settings?.searchLogs || 'Search logs by user, action, or entity...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-hover/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-surface-hover/50 border border-border rounded-xl px-3 py-2 text-sm text-main focus:ring-2 focus:ring-brand/20 outline-none"
            />
            {dateFilter && (
              <button 
                onClick={() => setDateFilter('')}
                className="text-xs text-brand font-bold hover:underline"
              >
                {t.settings?.activityLog?.clear}
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted">
            {t.settings?.activityLog?.loading}
          </div>
        ) : (
          <>
            <ActivityLogsList logs={mappedLogs} />
            {totalPages > 1 && (
              <div className="p-4 border-t border-border flex items-center justify-between">
                <span className="text-sm font-bold text-muted">
                  {t.settings?.table?.page} {page} {t.settings?.table?.of} {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl border border-border text-muted hover:text-brand hover:border-brand disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl border border-border text-muted hover:text-brand hover:border-brand disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
