import { useState } from 'react';
import { X, ExternalLink, User, Send, CheckCircle, XCircle, Upload, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';
import type { OnboardingTicket } from '../../../../types/onboarding';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { useAuth } from '../../../../contexts/AuthContext';
import onboardingService from '../../../../services/onboarding';
import StatusBadge from './StatusBadge';
import ActionButton from './ActionButton';
import AssignVSMForm from './AssignVSMForm';

interface TicketDetailDrawerProps {
  ticket: OnboardingTicket | null;
  onClose: () => void;
  onUpdate: (ticket: OnboardingTicket) => void;
}

export default function TicketDetailDrawer({ ticket, onClose, onUpdate }: TicketDetailDrawerProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');

  if (!ticket) return null;

  const userRole = user?.role || user?.userType || '';

  const handleAction = async (action: () => Promise<OnboardingTicket>, successMsg: string, errorMsg: string) => {
    setIsSubmitting(true);
    try {
      const updated = await action();
      onUpdate(updated);
      toast.success(successMsg);
      setFeedback('');
      setLink('');
      setNotes('');
    } catch {
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssign = () =>
    handleAction(
      () => onboardingService.assignToMe(ticket.id),
      t.onboarding.toast.assignSuccess,
      t.onboarding.toast.assignError,
    );

  const handleSendForms = () =>
    handleAction(
      () => onboardingService.sendForms(ticket.id),
      t.onboarding.toast.sendFormsSuccess,
      t.onboarding.toast.sendFormsError,
    );

  const handleReview = (approved: boolean) =>
    handleAction(
      () => onboardingService.reviewForms(ticket.id, { approved, feedback }),
      t.onboarding.toast.reviewSuccess,
      t.onboarding.toast.reviewError,
    );

  const handleUploadTestLink = () =>
    handleAction(
      () => onboardingService.uploadTestLink(ticket.id, { link, internal_notes: notes }),
      t.onboarding.toast.uploadSuccess,
      t.onboarding.toast.uploadError,
    );

  const handleUploadLiveLink = () =>
    handleAction(
      () => onboardingService.uploadLiveLink(ticket.id, { link }),
      t.onboarding.toast.uploadSuccess,
      t.onboarding.toast.uploadError,
    );

  const handleGoLive = () =>
    handleAction(
      () => onboardingService.goLive(ticket.id),
      t.onboarding.toast.goLiveSuccess,
      t.onboarding.toast.goLiveError,
    );

  const handleVendorRespond = (approved: boolean) =>
    handleAction(
      () => onboardingService.vendorRespondTestLink(ticket.id, { approved, feedback }),
      t.onboarding.toast.respondSuccess,
      t.onboarding.toast.respondError,
    );

  const isVsm = ['SUPER_ADMIN', 'ADMIN', 'VSM'].includes(userRole);
  const isOps = ['SUPER_ADMIN', 'OPERATIONS'].includes(userRole);
  const isVendor = userRole === 'VENDOR_PRIMARY_ADMIN' || userRole === 'VENDOR';

  const handleAdminAssign = (vsmId: string) => {
    if (!vsmId) return;
    handleAction(
      () => onboardingService.assignTicket(ticket.id, parseInt(vsmId)),
      t.onboarding.toast.assignSuccess,
      t.onboarding.toast.assignError,
    );
  };

  const renderActions = () => {
    switch (ticket.status) {
      case 'UNASSIGNED':
        if (['SUPER_ADMIN', 'ADMIN'].includes(userRole)) {
          return <AssignVSMForm onAssign={handleAdminAssign} isSubmitting={isSubmitting} />;
        }
        return userRole === 'VSM' ? (
          <ActionButton icon={<User className="w-4 h-4" />} label={t.onboarding.actions.assignToMe} onClick={handleAssign} disabled={isSubmitting} />
        ) : null;

      case 'ASSIGNED_TO_VSM':
        return isVsm ? (
          <ActionButton icon={<Send className="w-4 h-4" />} label={t.onboarding.actions.sendForms} onClick={handleSendForms} disabled={isSubmitting} />
        ) : null;

      case 'VSM_REVIEW':
        return isVsm ? (
          <div className="space-y-3">
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder={t.onboarding.labels.feedbackPlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <ActionButton icon={<CheckCircle className="w-4 h-4" />} label={t.onboarding.actions.approve} onClick={() => handleReview(true)} disabled={isSubmitting} variant="success" />
              <ActionButton icon={<XCircle className="w-4 h-4" />} label={t.onboarding.actions.reject} onClick={() => handleReview(false)} disabled={isSubmitting} variant="danger" />
            </div>
          </div>
        ) : null;

      case 'READY_FOR_OPS':
      case 'OPS_PROCESSING':
      case 'OPS_REVISION':
        return isOps ? (
          <div className="space-y-3">
            <input
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder={t.onboarding.labels.linkPlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
            />
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t.onboarding.labels.notesPlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
              rows={2}
            />
            <ActionButton icon={<Upload className="w-4 h-4" />} label={t.onboarding.actions.uploadTestLink} onClick={handleUploadTestLink} disabled={isSubmitting || !link} />
          </div>
        ) : null;

      case 'IN_TESTING':
        return isVendor ? (
          <div className="space-y-3">
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder={t.onboarding.labels.feedbackPlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <ActionButton icon={<CheckCircle className="w-4 h-4" />} label={t.onboarding.actions.approve} onClick={() => handleVendorRespond(true)} disabled={isSubmitting} variant="success" />
              <ActionButton icon={<XCircle className="w-4 h-4" />} label={t.onboarding.actions.reject} onClick={() => handleVendorRespond(false)} disabled={isSubmitting} variant="danger" />
            </div>
          </div>
        ) : null;

      case 'PENDING_LIVE_LINK':
        return isOps ? (
          <div className="space-y-3">
            <input
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder={t.onboarding.labels.linkPlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
            />
            <ActionButton icon={<Upload className="w-4 h-4" />} label={t.onboarding.actions.uploadLiveLink} onClick={handleUploadLiveLink} disabled={isSubmitting || !link} />
          </div>
        ) : null;

      case 'AWAITING_FINAL_VSM_APPROVAL':
        return isVsm ? (
          <ActionButton icon={<Rocket className="w-4 h-4" />} label={t.onboarding.actions.goLive} onClick={handleGoLive} disabled={isSubmitting} variant="success" />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 end-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slideIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-main">{t.onboarding.labels.ticketDetails}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-main">{ticket.vendor_name}</h3>
            <StatusBadge status={ticket.status} label={t.onboarding.status[ticket.status]} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailField label={t.onboarding.labels.plan} value={ticket.subscription_plan} />
            <DetailField label={t.onboarding.labels.assignedVsm} value={ticket.assigned_vsm_name} />
            <DetailField label={t.onboarding.labels.assignedOps} value={ticket.assigned_ops_name} />
            <DetailField label={t.onboarding.labels.createdAt} value={new Date(ticket.created_at).toLocaleDateString()} />
          </div>

          {ticket.test_link && (
            <LinkField label={t.onboarding.labels.testLink} url={ticket.test_link} />
          )}

          {ticket.live_link && (
            <LinkField label={t.onboarding.labels.liveLink} url={ticket.live_link} />
          )}

          {ticket.internal_notes && (
            <div>
              <p className="text-xs font-semibold text-hint mb-1">{t.onboarding.labels.notes}</p>
              <p className="text-sm text-muted bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">{ticket.internal_notes}</p>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100">
            {renderActions()}
          </div>
        </div>
      </div>
    </>
  );
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-semibold text-hint mb-0.5">{label}</p>
      <p className="text-sm font-medium text-main">{value || '—'}</p>
    </div>
  );
}

function LinkField({ label, url }: { label: string; url: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-hint mb-1">{label}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        {url}
      </a>
    </div>
  );
}
