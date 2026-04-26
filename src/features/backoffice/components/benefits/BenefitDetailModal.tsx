import { useState } from 'react';
import { X, ExternalLink, CheckCircle, XCircle, Upload, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { BenefitTracker } from '../../../../types/onboarding';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { useAuth } from '../../../../contexts/AuthContext';
import onboardingService from '../../../../services/onboarding';
import AssignOpsForm from '../onboarding/AssignOpsForm';

interface BenefitDetailModalProps {
  benefit: BenefitTracker | null;
  onClose: () => void;
  onUpdate: (benefit: BenefitTracker) => void;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  ASSIGNED_TO_OPS: 'bg-blue-50 text-blue-700',
  BUILDING: 'bg-indigo-50 text-indigo-700',
  IN_TESTING: 'bg-purple-50 text-purple-700',
  REVISION: 'bg-red-50 text-red-700',
  PENDING_LIVE: 'bg-amber-50 text-amber-700',
  LIVE_REVIEW: 'bg-orange-50 text-orange-700',
  LIVE: 'bg-emerald-50 text-emerald-700',
};

export default function BenefitDetailModal({ benefit, onClose, onUpdate }: BenefitDetailModalProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!benefit) return null;

  const userRole = user?.role || '';
  const isVsm = ['SUPER_ADMIN', 'ADMIN', 'VSM'].includes(userRole);
  const isOps = ['SUPER_ADMIN', 'OPERATIONS'].includes(userRole);

  const handleAction = async (action: () => Promise<BenefitTracker>, successMsg: string, errorMsg: string) => {
    setIsSubmitting(true);
    try {
      const updated = await action();
      onUpdate(updated);
      toast.success(successMsg);
      setLink('');
      setNotes('');
      setFeedback('');
      setShowRejectForm(false);
    } catch {
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignOps = (opsId: string) => {
    handleAction(
      () => onboardingService.assignBenefitOps(benefit.id, opsId),
      t.benefitTracker.toast.assignOpsSuccess,
      t.benefitTracker.toast.assignOpsFailed,
    );
  };

  const handleUploadTestLink = () =>
    handleAction(
      () => onboardingService.uploadBenefitTestLink(benefit.id, { link, internal_notes: notes }),
      t.benefitTracker.toast.uploadTestSuccess,
      t.benefitTracker.toast.uploadTestFailed,
    );

  const handleUploadLiveLink = () =>
    handleAction(
      () => onboardingService.uploadBenefitLiveLink(benefit.id, { link }),
      t.benefitTracker.toast.uploadLiveSuccess,
      t.benefitTracker.toast.uploadLiveFailed,
    );

  const handleApproveTest = () =>
    handleAction(
      () => onboardingService.reviewBenefitTest(benefit.id, { approved: true }),
      t.benefitTracker.toast.reviewSuccess,
      t.benefitTracker.toast.reviewFailed,
    );

  const handleRejectTest = () =>
    handleAction(
      () => onboardingService.reviewBenefitTest(benefit.id, { approved: false, feedback }),
      t.benefitTracker.toast.reviewSuccess,
      t.benefitTracker.toast.reviewFailed,
    );

  const handleStartBuilding = () =>
    handleAction(
      () => onboardingService.startBuildingBenefit(benefit.id),
      t.benefitTracker.toast.assignOpsSuccess,
      t.benefitTracker.toast.assignOpsFailed,
    );

  const handleApproveLive = () =>
    handleAction(
      () => onboardingService.reviewBenefitLive(benefit.id, { approved: true }),
      t.benefitTracker.toast.reviewSuccess,
      t.benefitTracker.toast.reviewFailed,
    );

  const handleRejectLive = () =>
    handleAction(
      () => onboardingService.reviewBenefitLive(benefit.id, { approved: false, feedback }),
      t.benefitTracker.toast.reviewSuccess,
      t.benefitTracker.toast.reviewFailed,
    );

  const renderActions = () => {
    switch (benefit.status) {
      case 'PENDING':
        return isVsm ? (
          <AssignOpsForm onAssign={handleAssignOps} isSubmitting={isSubmitting} />
        ) : null;

      case 'ASSIGNED_TO_OPS':
        return isOps ? (
          <button
            onClick={handleStartBuilding}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {t.benefitTracker.actions.startBuilding}
          </button>
        ) : null;

      case 'BUILDING':
      case 'REVISION':
        return isOps ? (
          <div className="space-y-3">
            <input
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
            />
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t.onboarding.labels.notesPlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
              rows={2}
            />
            <button
              onClick={handleUploadTestLink}
              disabled={isSubmitting || !link}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {t.benefitTracker.actions.uploadTestLink}
            </button>
          </div>
        ) : null;

      case 'IN_TESTING':
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
                  <button
                    onClick={handleRejectTest}
                    disabled={isSubmitting || !feedback}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    {t.benefitTracker.actions.requestRevision}
                  </button>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2.5 text-sm font-medium text-muted hover:text-main transition-colors"
                  >
                    {t.common.cancel}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleApproveTest}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t.benefitTracker.actions.approveTest}
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  {t.benefitTracker.actions.requestRevision}
                </button>
              </div>
            )}
          </div>
        ) : null;

      case 'PENDING_LIVE':
        return isOps ? (
          <div className="space-y-3">
            <input
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
            />
            <button
              onClick={handleUploadLiveLink}
              disabled={isSubmitting || !link}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {t.benefitTracker.actions.uploadLiveLink}
            </button>
          </div>
        ) : null;

      case 'LIVE_REVIEW':
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
                  <button
                    onClick={handleRejectLive}
                    disabled={isSubmitting || !feedback}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    {t.benefitTracker.actions.rejectLive}
                  </button>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2.5 text-sm font-medium text-muted hover:text-main transition-colors"
                  >
                    {t.common.cancel}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleApproveLive}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t.benefitTracker.actions.approveLive}
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  {t.benefitTracker.actions.rejectLive}
                </button>
              </div>
            )}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-main">{t.benefitTracker.benefitLabel} #{benefit.benefit_number}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-main">{benefit.vendor_name}</h3>
              <Link
                to={`/backoffice/vendors/${benefit.vendor_id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover transition-colors mt-1"
              >
                <ExternalLink className="w-3 h-3" />
                {t.onboarding.labels.viewCompanyProfile}
              </Link>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[benefit.status] || 'bg-gray-100 text-gray-600'}`}>
              {t.benefitTracker.status[benefit.status as keyof typeof t.benefitTracker.status]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <DetailField label={t.onboarding.labels.plan} value={benefit.subscription_plan} />
            <DetailField label={t.onboarding.labels.createdAt} value={new Date(benefit.created_at).toLocaleDateString()} />
            <DetailField label={t.onboarding.labels.assignedOps} value={benefit.assigned_ops_name} />
            <DetailField label={t.onboarding.labels.assignedVsm} value={benefit.assigned_vsm_name} />
          </div>

          {benefit.test_link && (
            <LinkField label="Test Link" url={benefit.test_link} />
          )}

          {benefit.live_link && (
            <LinkField label="Live Link" url={benefit.live_link} />
          )}

          {benefit.internal_notes && (
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              <p className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide">{t.onboarding.labels.notes}</p>
              <p className="text-sm text-amber-900 whitespace-pre-wrap">{benefit.internal_notes}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            {renderActions()}
          </div>
        </div>
      </div>
    </div>
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

function LinkField({ label, url }: { label: string; url: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted mb-1">{label}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand-hover transition-colors bg-brand/5 px-3 py-2 rounded-lg"
      >
        <ExternalLink className="w-4 h-4" />
        {url}
      </a>
    </div>
  );
}
