import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useVendors } from '../../../contexts/VendorsContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import SubscriptionCard from '../../../components/portal/SubscriptionCard';
import InlineSubscriptionModal from '../../../components/portal/InlineSubscriptionModal';
import VendorListingModal from '../../../components/portal/VendorListingModal';
import BenefitListingModal from '../../../components/portal/BenefitListingModal';
import NextActionModal from '../../../components/portal/NextActionModal';
import EditSubscriptionModal from '../../../components/portal/EditSubscriptionModal';
import PendingActionsSection from '../../../components/portal/PendingActionsSection';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import vendorsService from '../../../services/vendors';
import toast from 'react-hot-toast';

import { Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import type { Subscription } from '../../../types';

type ModalState =
  | { type: 'none' }
  | { type: 'subscribe' }
  | { type: 'vendor-listing' }
  | { type: 'benefit-listing' }
  | { type: 'next-action'; stepType: 'VENDOR_LISTING' | 'BENEFIT_LISTING' }
  | { type: 'edit-subscription'; subscription: Subscription };

export default function SubscriptionsPage() {
  const { displayName } = useAuth();
  const { vendor, subscriptions, isLoading, error, updateSubscriptionInContext, fetchDashboardData } = useVendors();
  const { t } = useLanguage();
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [isSaving, setIsSaving] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const { listingsData } = useCompanyProfile(vendor || ({} as any), () => {});
  const hasVendorListing = !!listingsData?.vendorListing;

  const closeModal = () => setModal({ type: 'none' });

  const handleEdit = (subscription: Subscription) => {
    setModal({ type: 'edit-subscription', subscription });
  };

  const handleSaveEdit = async (subscriptionId: number, data: { plan?: string; billingCycle?: string; locations?: string[] }) => {
    setIsSaving(true);
    try {
      const response = await vendorsService.updateSubscription(subscriptionId, data);
      updateSubscriptionInContext(response.subscription);
      closeModal();
      toast.success(t.portal.subscriptionCard.updateSuccess);
    } catch (err: any) {
      toast.error(err.response?.data?.error || t.portal.subscriptionCard.updateFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async (subscriptionId: number) => {
    setCancellingId(subscriptionId);
    try {
      const response = await vendorsService.cancelSubscription(subscriptionId);
      updateSubscriptionInContext(response.subscription);
      toast.success(t.portal.subscriptionCard.cancelSuccess);
    } catch (err: any) {
      toast.error(err.response?.data?.error || t.portal.subscriptionCard.cancelFailed);
    } finally {
      setCancellingId(null);
    }
  };

  const handleSubscriptionSuccess = async () => {
    closeModal();
    await fetchDashboardData();
    setModal({ type: 'next-action', stepType: 'VENDOR_LISTING' });
  };

  const handleAddBenefit = (subscriptionId: number) => {
    sessionStorage.setItem('activeSubscriptionId', String(subscriptionId));
    setModal({ type: 'benefit-listing' });
  };

  const completeStepLocally = async (stepType: string) => {
    const activeSubId = sessionStorage.getItem('activeSubscriptionId');
    const targetSub = activeSubId
      ? subscriptions.find(s => s.id === Number(activeSubId))
      : subscriptions.find(s => s.nextStep === stepType && s.status !== 'CANCELLED');

    if (targetSub) {
      try {
        const payload = { stepType };
        const response = await vendorsService.completeSubscriptionStep(targetSub.id, payload);
        updateSubscriptionInContext(response.subscription);
      } catch (err) {
        console.error('Failed to complete step', err);
      } finally {
        sessionStorage.removeItem('activeSubscriptionId');
      }
    }
  };

  const handleVendorListingSuccess = async () => {
    closeModal();
    await completeStepLocally('VENDOR_LISTING');
    await fetchDashboardData();
    setModal({ type: 'next-action', stepType: 'BENEFIT_LISTING' });
  };

  const handleBenefitListingSuccess = async () => {
    closeModal();
    await completeStepLocally('BENEFIT_LISTING');
    await fetchDashboardData();
    toast.success((t.portal as any).pendingActions?.benefitSuccess || 'Benefit listing submitted successfully!');
  };

  const handlePendingAction = async (actionType: string) => {
    if (actionType === 'VENDOR_LISTING') {
      setModal({ type: 'vendor-listing' });
    } else if (actionType === 'BENEFIT_LISTING') {
      setModal({ type: 'benefit-listing' });
    }
  };

  const handleModalContinue = () => {
    if (modal.type !== 'next-action') return;
    const stepType = modal.stepType;
    closeModal();
    handlePendingAction(stepType);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" className="text-brand" />
      </div>
    );
  }

  const editingSubscription = modal.type === 'edit-subscription' ? modal.subscription : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-gradient-to-br from-brand/10 to-brand/5 rounded-3xl p-8 border border-brand/10">
        <h2 className="text-lg font-semibold text-muted mb-2">
          {t.portal.subscriptions.greeting} <span className="text-main">{displayName}</span>
        </h2>
        <h1 className="text-3xl font-bold text-main leading-tight">
          {t.portal.subscriptions.welcomeTitle} <span className="text-brand">{t.portal.subscriptions.welcomeBrand}</span>!
        </h1>
        <p className="text-muted mt-3 max-w-2xl">
          {t.portal.subscriptions.welcomeDescription}
        </p>
      </section>

      <PendingActionsSection
        subscriptions={subscriptions}
        onAction={handlePendingAction}
        hasVendorListing={hasVendorListing}
      />

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-main">{t.portal.subscriptions.mySubscriptions}</h2>
            <div className="w-12 h-1 bg-brand rounded-full mt-2" />
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => setModal({ type: 'subscribe' })}
          >
            <Plus className="w-4 h-4" />
            {t.portal.subscriptions.subscribeNew}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl mb-6">
            {error}
          </div>
        )}

        {!vendor || subscriptions.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-3xl border-2 border-dashed border-border">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface-hover rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-main mb-2">{t.portal.subscriptions.noSubscriptionsTitle}</h3>
            <p className="text-muted max-w-md mx-auto">
              {t.portal.subscriptions.noSubscriptionsDescription}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {subscriptions.filter(s => s.status !== 'CANCELLED').map((sub) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                companyName={vendor.companyName}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onAddBenefit={handleAddBenefit}
                isCancelling={cancellingId === sub.id}
              />
            ))}
          </div>
        )}
      </section>

      <InlineSubscriptionModal
        isOpen={modal.type === 'subscribe'}
        onClose={closeModal}
        onSuccess={handleSubscriptionSuccess}
        newBranch={false}
      />

      <VendorListingModal
        isOpen={modal.type === 'vendor-listing'}
        onClose={closeModal}
        onSuccess={handleVendorListingSuccess}
      />

      <BenefitListingModal
        isOpen={modal.type === 'benefit-listing'}
        onClose={closeModal}
        onSuccess={handleBenefitListingSuccess}
      />

      <NextActionModal
        isOpen={modal.type === 'next-action'}
        onClose={closeModal}
        onContinue={handleModalContinue}
        nextStepType={modal.type === 'next-action' ? modal.stepType : 'VENDOR_LISTING'}
      />

      <EditSubscriptionModal
        isOpen={!!editingSubscription}
        subscription={editingSubscription}
        onClose={closeModal}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />
    </div>
  );
}
