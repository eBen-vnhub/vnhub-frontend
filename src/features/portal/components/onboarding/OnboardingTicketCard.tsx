import { useLanguage } from '../../../../i18n/LanguageContext';
import type { OnboardingTicket, TicketStatus } from '../../../../types/onboarding';
import { CheckCircle, Clock, FileText, Loader2, Settings } from 'lucide-react';

interface OnboardingTicketCardProps {
  ticket: OnboardingTicket;
}

const STATUS_CONFIG: Record<TicketStatus, { icon: typeof Clock; color: string }> = {
  UNASSIGNED: { icon: Clock, color: 'text-amber-500' },
  AWAITING_VENDOR_LISTING: { icon: Clock, color: 'text-amber-500' },
  VSM_REVIEW: { icon: Loader2, color: 'text-brand' },
  READY_FOR_OPS: { icon: Loader2, color: 'text-brand' },
  OPS_IN_PROGRESS: { icon: Loader2, color: 'text-brand' },
  VSM_FINAL_REVIEW: { icon: Loader2, color: 'text-brand' },
  COMPLETED: { icon: CheckCircle, color: 'text-emerald-500' },
};

const PROGRESS_MAP: Record<TicketStatus, number> = {
  UNASSIGNED: 10,
  AWAITING_VENDOR_LISTING: 25,
  VSM_REVIEW: 45,
  READY_FOR_OPS: 60,
  OPS_IN_PROGRESS: 75,
  VSM_FINAL_REVIEW: 90,
  COMPLETED: 100,
};

function getVendorFacingStatus(status: TicketStatus, t: any) {
  if (status === 'COMPLETED') return (t.vendorPortal as any).onboarding?.statuses?.completed || 'Live / Completed';
  if (status === 'UNASSIGNED' || status === 'AWAITING_VENDOR_LISTING') return (t.vendorPortal as any).onboarding?.statuses?.actionRequired || 'Action Required';
  return (t.vendorPortal as any).onboarding?.statuses?.inSetup || 'In Setup & Review';
}

export default function OnboardingTicketCard({ ticket }: OnboardingTicketCardProps) {
  const { t } = useLanguage();
  const config = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.UNASSIGNED;
  const StatusIcon = config.icon;
  const progress = PROGRESS_MAP[ticket.status] || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${config.color}`}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-main">{ticket.vendor_name}</h3>
              <p className="text-xs text-muted mt-0.5">
                {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
            ticket.status === 'COMPLETED'
              ? 'bg-emerald-50 text-emerald-700'
              : ticket.status === 'UNASSIGNED' || ticket.status === 'AWAITING_VENDOR_LISTING'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-brand/10 text-brand'
          }`}>
            {getVendorFacingStatus(ticket.status, t)}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-muted">{t.vendorPortal.onboarding.progress}</span>
            <span className="text-xs font-bold text-main">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                ticket.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-brand'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
