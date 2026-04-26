import { useState } from 'react';
import { useVendors } from '../../../contexts/VendorsContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import VendorListingModal from '../../../components/portal/VendorListingModal';
import VendorListingHeader from '../components/vendor-listing/VendorListingHeader';
import VendorListingDetails from '../components/vendor-listing/VendorListingDetails';
import VendorListingEmptyState from '../components/vendor-listing/VendorListingEmptyState';
import vendorsService from '../../../services/vendors';

export default function VendorListingPage() {
  const { vendor, subscriptions, isLoading: isVendorLoading, error: vendorError, fetchDashboardData, updateSubscriptionInContext } = useVendors();
  const { t } = useLanguage();
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  const { listingsData, isLoadingListings, canEditCompanyProfile } = useCompanyProfile(vendor || ({} as any), () => {});

  const handleSuccess = async () => {
    const pendingSubs = subscriptions.filter(s => s.nextStep === 'VENDOR_LISTING' && s.status !== 'CANCELLED');
    for (const sub of pendingSubs) {
      try {
        const res = await vendorsService.completeSubscriptionStep(sub.id, { stepType: 'VENDOR_LISTING' });
        updateSubscriptionInContext(res.subscription);
      } catch (err) {
        console.error('Failed to auto-complete vendor listing step', err);
      }
    }
    await fetchDashboardData();
    setIsVendorModalOpen(false);
  };

  if (isVendorLoading || isLoadingListings) {
    return (
      <div className="flex bg-surface rounded-2xl items-center justify-center p-8 mt-12 min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 md:w-16 md:h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted text-sm md:text-base animate-pulse">{t.portal.companyProfile.loadingProfile}</p>
        </div>
      </div>
    );
  }

  if (vendorError || !vendor) {
    return (
      <div className="flex bg-surface rounded-2xl items-center justify-center p-8 mt-12 min-h-[400px]">
        <div className="text-center text-red-500">
          <p>{vendorError || t.portal.companyProfile.loadFailed}</p>
        </div>
      </div>
    );
  }

  const hasVendorListing = !!listingsData?.vendorListing;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-surface border border-border shadow-sm rounded-3xl p-6 sm:p-8 animate-in fade-in duration-500">
          
          <VendorListingHeader
            hasVendorListing={hasVendorListing}
            canEditCompanyProfile={canEditCompanyProfile}
            t={t}
            onOpenModal={() => setIsVendorModalOpen(true)}
          />

          <div className="bg-surface border border-border hover:border-brand/30 transition-colors rounded-2xl p-6 shadow-sm">
            {hasVendorListing ? (
              <VendorListingDetails listingsData={listingsData} t={t} />
            ) : (
              <VendorListingEmptyState
                canEditCompanyProfile={canEditCompanyProfile}
                t={t}
                onOpenModal={() => setIsVendorModalOpen(true)}
              />
            )}
          </div>

        </div>
      </div>

      <VendorListingModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
