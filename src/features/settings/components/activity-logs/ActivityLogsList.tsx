import { Clock, Briefcase } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';

export interface LogEntry {
  id: string;
  user: string;
  action: string;
  entity: string;
  vendor_name?: string;
  vendor_country?: string;
  details?: any;
  timestamp: string;
}

interface ActivityLogsListProps {
  logs: LogEntry[];
}

function interpolate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{{${key}}}`, value || ''),
    template
  );
}

function formatLogMessage(log: LogEntry, t: any): string {
  const al = t.settings?.activityLog;
  if (!al) return `${log.action} — ${log.entity}`;

  const vendor = log.vendor_name ? `(${log.vendor_name})` : '';

  switch (log.action) {
    case 'TICKET_ASSIGNED':
      return interpolate(al.ticketAssigned, { vendor, vsm: log.details?.vsm_name || '' });
    case 'OPS_ASSIGNED':
      return interpolate(al.opsAssigned, { vendor, ops: log.details?.ops_name || '' });
    case 'STATUS_CHANGED':
      return interpolate(al.statusChanged, { vendor, status: log.details?.new_status || '' });
    case 'CHECKLIST_UPDATED':
      return interpolate(al.checklistUpdated, { vendor });
    case 'BENEFIT_SUBMITTED':
      return interpolate(al.benefitSubmitted, { benefit: log.details?.benefit_name || al.unnamed });
    case 'VENDOR_LISTING_UPDATED':
      return al.vendorListingUpdated;
    case 'PROFILE_UPDATED':
      return al.profileUpdated;
    case 'USER_INVITED':
      return interpolate(al.userInvited, { email: log.details?.invited_email || '', role: log.details?.role || '' });
    case 'SUBSCRIPTION_UPDATED':
      return interpolate(al.subscriptionUpdated, { vendor });
    case 'SUBSCRIPTION_CANCELLED':
      return interpolate(al.subscriptionCancelled, { vendor });
    default:
      return interpolate(al.defaultAction, { action: log.action, entity: log.entity });
  }
}

export default function ActivityLogsList({ logs }: ActivityLogsListProps) {
  const { t, language } = useLanguage();
  const al = t.settings?.activityLog;

  return (
    <div className="p-6">
      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="flex gap-4 items-start p-4 border border-border rounded-xl hover:bg-surface-hover/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 text-brand">
              {log.user.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-bold text-main">{log.user}</span>{' '}
                <span className="text-muted leading-relaxed">
                  {formatLogMessage(log, t)}
                </span>
                {log.vendor_country && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-600 ml-2">
                    <Briefcase className="w-3 h-3" />
                    {log.vendor_country}
                  </span>
                )}
              </div>

              {log.details?.feedback && (
                <div className="mt-2 bg-red-50 text-red-800 p-2 rounded-lg text-xs border border-red-100">
                  <span className="font-bold">{al?.feedback}</span> {log.details.feedback}
                </div>
              )}
              {log.details?.live_link && (
                <div className="mt-2 text-xs">
                  <span className="font-bold text-main">{al?.liveLink} </span>
                  <a href={log.details.live_link} target="_blank" rel="noreferrer" className="text-brand hover:underline">{log.details.live_link}</a>
                </div>
              )}

              <div className="flex items-center gap-1 text-xs text-muted mt-2">
                <Clock className="w-3 h-3" />
                {new Date(log.timestamp).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
              </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-12 text-muted">
            {al?.noLogs}
          </div>
        )}
      </div>
    </div>
  );
}
