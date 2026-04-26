import { useState } from 'react';
import { X, ExternalLink, User, CheckCircle, XCircle, Send, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { OnboardingTicket } from '../../../../types/onboarding';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { useAuth } from '../../../../contexts/AuthContext';
import onboardingService from '../../../../services/onboarding';
import StatusBadge from './StatusBadge';
import ActionButton from './ActionButton';
import AssignVSMForm from './AssignVSMForm';
import AssignOpsForm from './AssignOpsForm';

interface TicketDetailModalProps {
  ticket: OnboardingTicket | null;
  onClose: () => void;
  onUpdate: (ticket: OnboardingTicket) => void;
}

export default function TicketDetailModal({ ticket, onClose, onUpdate }: TicketDetailModalProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!ticket) return null;

  const userRole = user?.role || user?.userType || '';

  const handleAction = async (action: () => Promise<OnboardingTicket>, successMsg: string, errorMsg: string) => {
    setIsSubmitting(true);
    try {
      const updated = await action();
      onUpdate(updated);
      toast.success(successMsg);
      setFeedback('');
      setShowRejectForm(false);
    } catch {
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssign = () =>
    handleAction(
      () => onboardingService.assignTicket(ticket.id),
      t.onboarding.toast.assignSuccess,
      t.onboarding.toast.assignError,
    );

  const handleSendForms = () =>
    handleAction(
      () => onboardingService.sendForms(ticket.id),
      t.onboarding.toast.sendFormsSuccess,
      t.onboarding.toast.sendFormsError,
    );

  const handleApprove = () =>
    handleAction(
      () => onboardingService.reviewListing(ticket.id, { approved: true }),
      t.onboarding.toast.reviewSuccess,
      t.onboarding.toast.reviewError,
    );

  const handleReject = () =>
    handleAction(
      () => onboardingService.reviewListing(ticket.id, { approved: false, feedback }),
      t.onboarding.toast.reviewSuccess,
      t.onboarding.toast.reviewError,
    );

  const handleOpsComplete = () =>
    handleAction(
      () => onboardingService.opsCompleteSetup(ticket.id),
      t.onboarding.toast.opsCompleteSuccess,
      t.onboarding.toast.opsCompleteError,
    );

  const handleVSMConfirm = () =>
    handleAction(
      () => onboardingService.vsmConfirmCompletion(ticket.id),
      t.onboarding.toast.confirmSuccess,
      t.onboarding.toast.confirmError,
    );

  const isVsm = ['SUPER_ADMIN', 'ADMIN', 'VSM'].includes(userRole);
  const isOps = ['SUPER_ADMIN', 'OPERATIONS'].includes(userRole);

  const handleAdminAssign = (vsmId: string) => {
    if (!vsmId) return;
    handleAction(
      () => onboardingService.assignTicket(ticket.id, parseInt(vsmId)),
      t.onboarding.toast.assignSuccess,
      t.onboarding.toast.assignError,
    );
  };

  const handleAssignOps = (opsId: string) => {
    if (!opsId) return;
    handleAction(
      () => onboardingService.assignTicketOps(ticket.id, parseInt(opsId)),
      t.onboarding.toast.assignOpsSuccess,
      t.onboarding.toast.assignOpsError,
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
            {showRejectForm ? (
              <>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder={t.onboarding.labels.feedbackPlaceholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <ActionButton icon={<XCircle className="w-4 h-4" />} label={t.onboarding.actions.confirmReject} onClick={handleReject} disabled={isSubmitting || !feedback} variant="danger" />
                  <button onClick={() => setShowRejectForm(false)} className="px-4 py-2 text-sm font-medium text-muted hover:text-main transition-colors">
                    {t.common.cancel}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <ActionButton icon={<CheckCircle className="w-4 h-4" />} label={t.onboarding.actions.approve} onClick={handleApprove} disabled={isSubmitting} variant="success" />
                <ActionButton icon={<XCircle className="w-4 h-4" />} label={t.onboarding.actions.requestChanges} onClick={() => setShowRejectForm(true)} disabled={isSubmitting} variant="danger" />
              </div>
            )}
          </div>
        ) : null;

      case 'READY_FOR_OPS':
        return isVsm ? (
          <AssignOpsForm onAssign={handleAssignOps} isSubmitting={isSubmitting} />
        ) : null;

      case 'OPS_IN_PROGRESS':
        return isOps ? (
          <ActionButton icon={<CheckCircle className="w-4 h-4" />} label={t.onboarding.actions.markSetupComplete} onClick={handleOpsComplete} disabled={isSubmitting} variant="success" />
        ) : null;

      case 'VSM_FINAL_REVIEW':
        return isVsm ? (
          <ActionButton icon={<UserCheck className="w-4 h-4" />} label={t.onboarding.actions.confirmCompletion} onClick={handleVSMConfirm} disabled={isSubmitting} variant="success" />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-main">{t.onboarding.labels.ticketDetails}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-main">{ticket.vendor_name}</h3>
                <Link
                  to={`/backoffice/vendors/${ticket.vendor_id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover transition-colors mt-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t.onboarding.labels.viewCompanyProfile}
                </Link>
              </div>
              <StatusBadge status={ticket.status} label={t.onboarding.status[ticket.status]} />
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <DetailField label={t.onboarding.labels.plan} value={ticket.subscription_plan} />
              <DetailField label={t.onboarding.labels.createdAt} value={new Date(ticket.created_at).toLocaleDateString()} />
              <DetailField label={t.onboarding.labels.assignedVsm} value={ticket.assigned_vsm_name} />
              <DetailField label={t.onboarding.labels.assignedOps} value={ticket.assigned_ops_name} />
            </div>

            {ticket.internal_notes && (
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                <p className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide">{t.onboarding.labels.notes}</p>
                <p className="text-sm text-amber-900 whitespace-pre-wrap">{ticket.internal_notes}</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              {renderActions()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted mb-1">{label}</p>
      <p className="text-sm font-bold text-main">{value || '—'}</p>
    </div>
  );
}
