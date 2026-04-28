import { Clock, Briefcase, Activity } from 'lucide-react';
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

function formatLogMessage(log: LogEntry, language: string): string {
  const isAr = language === 'ar';
  const vendor = log.vendor_name ? `لشركة ${log.vendor_name}` : '';
  const vendorEn = log.vendor_name ? `for ${log.vendor_name}` : '';

  switch (log.action) {
    case 'TICKET_ASSIGNED':
      return isAr 
        ? `قام بتعيين تيكت التسجيل ${vendor} إلى VSM (${log.details?.vsm_name})`
        : `Assigned onboarding ticket ${vendorEn} to VSM (${log.details?.vsm_name})`;
    case 'OPS_ASSIGNED':
      return isAr
        ? `قام بتعيين تيكت التسجيل ${vendor} إلى مسؤول العمليات (${log.details?.ops_name})`
        : `Assigned onboarding ticket ${vendorEn} to Ops (${log.details?.ops_name})`;
    case 'STATUS_CHANGED':
      const st = log.details?.new_status || '';
      return isAr
        ? `تغيرت حالة التيكت ${vendor} إلى ${st}`
        : `Changed ticket status ${vendorEn} to ${st}`;
    case 'CHECKLIST_UPDATED':
      return isAr
        ? `قام بتحديث قائمة المهام ${vendor}`
        : `Updated checklist items ${vendorEn}`;
    case 'BENEFIT_SUBMITTED':
      return isAr
        ? `قام المورد برفع بيانات الميزة (${log.details?.benefit_name || 'بدون اسم'})`
        : `Vendor submitted benefit data (${log.details?.benefit_name || 'Unnamed'})`;
    case 'VENDOR_LISTING_UPDATED':
      return isAr
        ? `قام المورد بتحديث بيانات الشركة`
        : `Vendor updated their listing profile`;
    case 'PROFILE_UPDATED':
      return isAr
        ? `قام المورد بتحديث ملف الشركة`
        : `Vendor updated company profile`;
    case 'USER_INVITED':
      return isAr
        ? `قام بدعوة مستخدم جديد (${log.details?.invited_email}) بصلاحية ${log.details?.role}`
        : `Invited new user (${log.details?.invited_email}) with role ${log.details?.role}`;
    case 'SUBSCRIPTION_UPDATED':
      return isAr
        ? `تم تحديث بيانات الباقة ${vendor}`
        : `Updated subscription details ${vendorEn}`;
    case 'SUBSCRIPTION_CANCELLED':
      return isAr
        ? `تم إلغاء الباقة ${vendor}`
        : `Cancelled subscription ${vendorEn}`;
    default:
      return isAr
        ? `قام بإجراء ${log.action} على ${log.entity}`
        : `Performed ${log.action} on ${log.entity}`;
  }
}

export default function ActivityLogsList({ logs }: ActivityLogsListProps) {
  const { language } = useLanguage();

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
                  {formatLogMessage(log, language)}
                </span>
                {log.vendor_country && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-600 ml-2">
                    <Briefcase className="w-3 h-3" />
                    {log.vendor_country}
                  </span>
                )}
              </div>
              
              {/* Optional: Show feedback or specific details inline if available */}
              {log.details?.feedback && (
                <div className="mt-2 bg-red-50 text-red-800 p-2 rounded-lg text-xs border border-red-100">
                  <span className="font-bold">{language === 'ar' ? 'السبب:' : 'Feedback:'}</span> {log.details.feedback}
                </div>
              )}
              {log.details?.live_link && (
                <div className="mt-2 text-xs">
                  <span className="font-bold text-main">Live Link: </span>
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
            {language === 'ar' ? 'لا توجد سجلات نشاط.' : 'No activity logs found.'}
          </div>
        )}
      </div>
    </div>
  );
}
