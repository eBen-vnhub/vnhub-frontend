import { useState, useEffect } from 'react';
import { X, ExternalLink, CheckCircle, XCircle, UserCheck, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { OnboardingTicket } from '../../../../types/onboarding';
import type { BenefitTracker } from '../../../../types/onboarding';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { useAuth } from '../../../../contexts/AuthContext';
import onboardingService from '../../../../services/onboarding';
import StatusBadge from './StatusBadge';
import ActionButton from './ActionButton';
import AssignVSMForm from './AssignVSMForm';
import AssignOpsForm from './AssignOpsForm';
import BenefitDetailModal from '../benefits/BenefitDetailModal';

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
  const [linkedBenefits, setLinkedBenefits] = useState<BenefitTracker[]>([]);
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitTracker | null>(null);
  const [liveLinkInput, setLiveLinkInput] = useState('');

  useEffect(() => {
    if (ticket?.vendor_id) {
      onboardingService.getBenefitTrackers(ticket.vendor_id).then(setLinkedBenefits).catch(() => {});
    }
  }, [ticket?.vendor_id]);

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

  const handleApproveTest = () =>
    handleAction(
      () => onboardingService.approveTest(ticket.id, { approved: true }),
      'Test approved',
      'Failed to approve test',
    );

  const handleRejectTest = () =>
    handleAction(
      () => onboardingService.approveTest(ticket.id, { approved: false, feedback }),
      'Revision requested',
      'Failed to request revision',
    );

  const isVsm = ['SUPER_ADMIN', 'VSM'].includes(userRole);
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

  const handleSubmitLiveLink = () =>
    handleAction(
      () => onboardingService.submitLiveLink(ticket.id, liveLinkInput),
      t.onboarding.toast.liveLinkSuccess,
      t.onboarding.toast.liveLinkError,
    );

  const renderActions = () => {
    switch (ticket.status) {
      case 'UNASSIGNED':
        if (['SUPER_ADMIN', 'ADMIN'].includes(userRole)) {
          return <AssignVSMForm onAssign={handleAdminAssign} isSubmitting={isSubmitting} />;
        }
        return null;

      case 'DATA_COLLECTION':
        return (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-medium">
              {t.onboarding.labels.waitingVendorListing}
            </p>
            <div className="mt-3 flex gap-3 text-xs">
              <span className={`px-2 py-1 rounded-full font-bold ${ticket.has_vendor_listing ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {t.onboarding.labels.vendorListing} {ticket.has_vendor_listing ? '✓' : '○'}
              </span>
              <span className={`px-2 py-1 rounded-full font-bold ${ticket.has_benefit_listing ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {t.onboarding.labels.benefitListing} {ticket.has_benefit_listing ? '✓' : '○'}
              </span>
            </div>
          </div>
        );

      case 'VSM_REVIEW':
        if (!isVsm) return null;
        return (
          <div className="space-y-3">
            {!ticket.assigned_ops && (
              <AssignOpsForm onAssign={handleAssignOps} isSubmitting={isSubmitting} />
            )}
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
                <ActionButton icon={<XCircle className="w-4 h-4" />} label={t.onboarding.actions.requestChanges} onClick={() => setShowRejectForm(true)} disabled={isSubmitting} variant="danger" />
              </div>
            )}
          </div>
        );

      case 'OPS_QUEUE':
        if (isOps && ticket.assigned_ops) {
          return (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
              <p className="text-sm text-blue-800 font-medium">
                {t.onboarding.labels?.opsQueueMessage || 'This ticket is in your queue. Review the details and start work when ready.'}
              </p>
              <ActionButton
                icon={<CheckCircle className="w-4 h-4" />}
                label={t.onboarding.actions?.startWork || 'Start Work'}
                onClick={() => handleAction(
                  () => onboardingService.startOpsWork(ticket.id),
                  t.onboarding.toast?.startWorkSuccess || 'Work started successfully',
                  t.onboarding.toast?.startWorkError || 'Failed to start work',
                )}
                disabled={isSubmitting}
                variant="primary"
              />
            </div>
          );
        }
        return (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-medium">
              {t.onboarding.labels?.opsQueueWaiting || 'Waiting for Operations to start work.'}
            </p>
          </div>
        );

      case 'OPS_IN_PROGRESS':
        if (!ticket.assigned_ops && ['SUPER_ADMIN', 'ADMIN'].includes(userRole)) {
          return <AssignOpsForm onAssign={handleAssignOps} isSubmitting={isSubmitting} />;
        }
        const allChecked = ticket.setup_org && ticket.setup_location && ticket.setup_account && ticket.setup_admin_account && ticket.setup_admin_credentials && ticket.benefit_built && !!ticket.test_link;
        return isOps && ticket.assigned_ops ? (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-main mb-2">{t.onboarding.labels.techSetupChecklist}</h4>
              <ChecklistItem label={t.onboarding.labels.createOrgEpn} checked={ticket.setup_org} onChange={(c) => handleChecklistChange('setup_org', c)} disabled={isSubmitting} />
              <ChecklistItem label={t.onboarding.labels.setupLocation} checked={ticket.setup_location} onChange={(c) => handleChecklistChange('setup_location', c)} disabled={isSubmitting} />
              <ChecklistItem label={t.onboarding.labels.createFinance} checked={ticket.setup_account} onChange={(c) => handleChecklistChange('setup_account', c)} disabled={isSubmitting} />
              <ChecklistItem label={t.onboarding.labels.generateAdminAccount} checked={ticket.setup_admin_account} onChange={(c) => handleChecklistChange('setup_admin_account', c)} disabled={isSubmitting} />
              <ChecklistItem label={t.onboarding.labels.generateAdminCredentials} checked={ticket.setup_admin_credentials} onChange={(c) => handleChecklistChange('setup_admin_credentials', c)} disabled={isSubmitting} />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-main mb-2">{t.onboarding.labels.benefitBuild}</h4>
              <ChecklistItem label={t.onboarding.labels.benefitBuiltCheck} checked={ticket.benefit_built} onChange={(c) => handleChecklistChange('benefit_built', c)} disabled={isSubmitting} />
              <div className="pt-2">
                <label className="block text-xs font-bold text-muted mb-1.5">{t.onboarding.labels.testLink}</label>
                <input
                  type="url"
                  value={ticket.test_link || ''}
                  onChange={(e) => handleChecklistChange('test_link', e.target.value as any)}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
                />
              </div>
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

      case 'BENEFIT_IN_TESTING':
        if (!isVsm) return null;
        return (
          <div className="space-y-4">
            {ticket.test_link && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-800 mb-1">{t.onboarding.labels.testLink}</p>
                <a href={ticket.test_link} target="_blank" rel="noopener noreferrer" className="text-sm text-brand hover:underline break-all">
                  {ticket.test_link}
                </a>
              </div>
            )}
            {showRejectForm ? (
              <>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder={t.onboarding.labels.describeFix}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <ActionButton icon={<XCircle className="w-4 h-4" />} label={t.onboarding.labels.requestRevision} onClick={handleRejectTest} disabled={isSubmitting || !feedback} variant="danger" />
                  <button onClick={() => setShowRejectForm(false)} className="px-4 py-2 text-sm font-medium text-muted hover:text-main transition-colors">
                    {t.onboarding.labels.cancel}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <ActionButton icon={<CheckCircle className="w-4 h-4" />} label={t.onboarding.labels.approveTest} onClick={handleApproveTest} disabled={isSubmitting} variant="success" />
                <ActionButton icon={<XCircle className="w-4 h-4" />} label={t.onboarding.labels.requestRevision} onClick={() => setShowRejectForm(true)} disabled={isSubmitting} variant="danger" />
              </div>
            )}
          </div>
        );

      case 'PENDING_GO_LIVE':
        return isOps ? (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <label className="block text-xs font-bold text-muted mb-1.5">{t.onboarding.labels.liveLink}</label>
              <input
                type="url"
                value={liveLinkInput}
                onChange={(e) => setLiveLinkInput(e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
              />
            </div>
            <ActionButton
              icon={<CheckCircle className="w-4 h-4" />}
              label="Submit Live Link"
              onClick={handleSubmitLiveLink}
              disabled={isSubmitting || !liveLinkInput}
              variant="success"
            />
          </div>
        ) : null;

      case 'VSM_FINAL_REVIEW':
        if (!isVsm) return null;
        return (
          <div className="space-y-4">
            {ticket.live_link && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-800 mb-1">Live Link</p>
                <a href={ticket.live_link} target="_blank" rel="noopener noreferrer" className="text-sm text-brand hover:underline break-all">
                  {ticket.live_link}
                </a>
              </div>
            )}
            <ActionButton icon={<UserCheck className="w-4 h-4" />} label={t.onboarding.actions.confirmCompletion} onClick={handleVSMConfirm} disabled={isSubmitting} variant="success" />
          </div>
        );

      default:
        return null;
    }
  };

  const showBenefitsSection = linkedBenefits.length > 0 && ['VSM_REVIEW', 'OPS_IN_PROGRESS', 'VSM_FINAL_REVIEW'].includes(ticket.status);

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

            {showBenefitsSection && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                <h4 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Linked Benefits ({linkedBenefits.length})
                </h4>
                <div className="space-y-2">
                  {linkedBenefits.map(b => (
                    <div key={b.id} className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2 text-sm border border-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer group" onClick={() => setSelectedBenefit(b)}>
                      <span className="font-medium text-main group-hover:text-brand transition-colors">
                        {t.benefitTracker.benefitLabel} #{b.benefit_number}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          b.status === 'LIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {t.benefitTracker.status[b.status]}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-400 group-hover:text-brand transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

      <BenefitDetailModal
        benefit={selectedBenefit}
        onClose={() => setSelectedBenefit(null)}
        onUpdate={(updated) => {
          setLinkedBenefits(prev => prev.map(b => b.id === updated.id ? updated : b));
          setSelectedBenefit(updated);
        }}
      />
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
