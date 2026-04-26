import { useState, useMemo } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import SettingsTabs from '../components/SettingsTabs';
import PageHeader from '../components/PageHeader';
import ActivityLogsList from '../components/logs/ActivityLogsList';
import { ActivitySquare, Search, Filter } from 'lucide-react';

export default function ActivityLogsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const [logs] = useState([
    { id: '1', user: 'Admin User', action: 'approved vendor listing for', entity: 'TechCorp', timestamp: new Date().toISOString() },
    { id: '2', user: 'Ahmed Ali', action: 'assigned ops to onboarding ticket', entity: '#1045', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', user: 'System', action: 'created new onboarding ticket for', entity: 'NewVendor LLC', timestamp: new Date(Date.now() - 7200000).toISOString() },
  ]);

  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    const lower = search.toLowerCase();
    return logs.filter(l => 
      l.user.toLowerCase().includes(lower) || 
      l.action.toLowerCase().includes(lower) || 
      l.entity.toLowerCase().includes(lower)
    );
  }, [logs, search]);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        icon={<ActivitySquare />}
        title={t.settings?.logsTitle || 'Activity Logs'}
        subtitle={t.settings?.logsSubtitle || 'Monitor all system events and user actions.'}
      />

      <SettingsTabs />

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={t.settings?.searchLogs || 'Search logs by user, action, or entity...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-hover/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-surface-hover/50 text-main px-4 py-2 rounded-xl text-sm font-bold hover:bg-surface-hover transition-colors border border-border">
            <Filter className="w-4 h-4" />
            {t.common?.filter || 'Filter'}
          </button>
        </div>

        <ActivityLogsList logs={filteredLogs} />
      </div>
    </div>
  );
}
