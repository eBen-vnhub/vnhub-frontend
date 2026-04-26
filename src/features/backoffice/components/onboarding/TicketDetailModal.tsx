import { useState } from 'react';
import { X, ExternalLink, User, CheckCircle, XCircle, UserCheck } from 'lucide-react';
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

  const handleChecklistChange = async (field: string, checked: boolean) => {
    try {
      const updated = await onboardingService.updateChecklist(ticket.id, { [field]: checked });
      onUpdate(updated);
    } catch {
      toast.error('Failed to update checklist');
    }
  };

  const handleAssign = () =>
    handleAction(
      () => onboardingService.assignTicket(ticket.id),
      t.onboarding.toast.assignSuccess,
      t.onboarding.toast.assignError,
    );

  const handleStartReview = () =>
    handleAction(
      () => onboardingService.startReview(ticket.id),
      (t.onboarding.toast as any).reviewSuccess || 'Review started',
      (t.onboarding.toast as any).reviewError || 'Failed to start review',
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

      case 'AWAITING_VENDOR_LISTING':
        return isVsm ? (
          <div className="space-y-4">
            <p className="text-sm text-muted bg-gray-50 p-4 rounded-xl border border-gray-100">
              If the vendor has completed their profile setup, you can manually start the review process.
            </p>
            <ActionButton 
              icon={<CheckCircle className="w-4 h-4" />} 
              label="Start VSM Review" 
              onClick={handleStartReview} 
              disabled={isSubmitting} 
              variant="success" 
            />
          </div>
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
        const allChecked = ticket.setup_org && ticket.setup_location && ticket.setup_account && ticket.setup_admin;
        return isOps ? (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-main mb-2">Technical Setup Checklist</h4>
              <ChecklistItem label="Create Organization in ePN" checked={ticket.setup_org} onChange={(c) => handleChecklistChange('setup_org', c)} disabled={isSubmitting} />
              <ChecklistItem label="Setup Location / Branch" checked={ticket.setup_location} onChange={(c) => handleChecklistChange('setup_location', c)} disabled={isSubmitting} />
              <ChecklistItem label="Create Financial Account" checked={ticket.setup_account} onChange={(c) => handleChecklistChange('setup_account', c)} disabled={isSubmitting} />
              <ChecklistItem label="Generate Admin Credentials" checked={ticket.setup_admin} onChange={(c) => handleChecklistChange('setup_admin', c)} disabled={isSubmitting} />
            </div>
            <ActionButton 
              icon={<CheckCircle className="w-4 h-4" />} 
              label={t.onboarding.actions.markSetupComplete} 
              onClick={handleOpsComplete} 
              disabled={isSubmitting || !allChecked} 
              variant="success" 
            />
          </div>
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

function ChecklistItem({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (c: boolean) => void; disabled: boolean }) {
  return (
    <label className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${checked ? 'bg-emerald-50/50' : 'hover:bg-gray-100/50'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
        disabled={disabled}
        className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand"
      />
      <span className={`text-sm font-medium ${checked ? 'text-emerald-700 line-through opacity-70' : 'text-main'}`}>
        {label}
      </span>
    </label>
  );
}
