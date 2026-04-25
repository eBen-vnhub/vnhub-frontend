import { useLanguage } from '../../../../i18n/LanguageContext';
import type { OnboardingTicket, TicketStatus } from '../../../../types/onboarding';
import { CheckCircle, Clock, ExternalLink, FileText, Loader2, Rocket, Settings, Truck } from 'lucide-react';

interface OnboardingTicketCardProps {
  ticket: OnboardingTicket;
  onRespondTestLink: (ticket: OnboardingTicket) => void;
}

const STATUS_CONFIG: Record<TicketStatus, { icon: typeof Clock; color: string }> = {
  UNASSIGNED: { icon: Clock, color: 'text-gray-400' },
  ASSIGNED_TO_VSM: { icon: FileText, color: 'text-blue-500' },
  AWAITING_VENDOR_FORMS: { icon: FileText, color: 'text-amber-500' },
  VSM_REVIEW: { icon: FileText, color: 'text-indigo-500' },
  READY_FOR_OPS: { icon: Settings, color: 'text-purple-500' },
  OPS_PROCESSING: { icon: Loader2, color: 'text-purple-500' },
  IN_TESTING: { icon: Rocket, color: 'text-cyan-500' },
  OPS_REVISION: { icon: Settings, color: 'text-orange-500' },
  PENDING_LIVE_LINK: { icon: Truck, color: 'text-teal-500' },
  AWAITING_FINAL_VSM_APPROVAL: { icon: CheckCircle, color: 'text-emerald-500' },
  COMPLETED: { icon: CheckCircle, color: 'text-green-600' },
};

const PROGRESS_MAP: Record<TicketStatus, number> = {
  UNASSIGNED: 5,
  ASSIGNED_TO_VSM: 15,
  AWAITING_VENDOR_FORMS: 25,
  VSM_REVIEW: 35,
  READY_FOR_OPS: 45,
  OPS_PROCESSING: 55,
  IN_TESTING: 65,
  OPS_REVISION: 55,
  PENDING_LIVE_LINK: 75,
  AWAITING_FINAL_VSM_APPROVAL: 90,
  COMPLETED: 100,
};

export default function OnboardingTicketCard({ ticket, onRespondTestLink }: OnboardingTicketCardProps) {
  const { t } = useLanguage();
  const config = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.UNASSIGNED;
  const StatusIcon = config.icon;
  const progress = PROGRESS_MAP[ticket.status] || 0;
  const showTestLinkAction = ticket.status === 'IN_TESTING' && ticket.test_link;

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
              : 'bg-gray-50 text-gray-600'
          }`}>
            {t.onboarding.status[ticket.status] || ticket.status}
          </span>
        </div>

        <div className="mb-4">
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

        {ticket.test_link && (
          <div className="flex items-center gap-2 px-4 py-3 bg-blue-50/50 rounded-xl mb-4">
            <ExternalLink className="w-4 h-4 text-brand flex-shrink-0" />
            <a
              href={ticket.test_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand hover:underline truncate"
            >
              {t.vendorPortal.onboarding.viewTestLink}
            </a>
          </div>
        )}

        {ticket.live_link && (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50/50 rounded-xl mb-4">
            <ExternalLink className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <a
              href={ticket.live_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-emerald-600 hover:underline truncate"
            >
              {t.vendorPortal.onboarding.viewLiveLink}
            </a>
          </div>
        )}

        {showTestLinkAction && (
          <button
            onClick={() => onRespondTestLink(ticket)}
            className="w-full py-3 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-hover transition-colors shadow-sm"
          >
            {t.vendorPortal.onboarding.respondToTestLink}
          </button>
        )}
      </div>
    </div>
  );
}
