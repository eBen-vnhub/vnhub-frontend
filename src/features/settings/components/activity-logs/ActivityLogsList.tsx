import { Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  user: string;
  action: string;
  entity: string;
  timestamp: string;
}

interface ActivityLogsListProps {
  logs: LogEntry[];
}

export default function ActivityLogsList({ logs }: ActivityLogsListProps) {
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
                <span className="text-muted">{log.action}</span>{' '}
                <span className="font-bold text-main">{log.entity}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted mt-2">
                <Clock className="w-3 h-3" />
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-12 text-muted">
            No activity logs found.
          </div>
        )}
      </div>
    </div>
  );
}
