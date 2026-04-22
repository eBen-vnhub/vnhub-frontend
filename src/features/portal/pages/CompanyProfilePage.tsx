import { useState } from 'react';
import { useVendors } from '../../../contexts/VendorsContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import CompanyProfileForm from '../components/CompanyProfileForm';
import VendorListingModal from '../../../components/portal/VendorListingModal';

export default function CompanyProfilePage() {
  const { vendor, isLoading, error, updateVendorContext, fetchDashboardData } = useVendors();
  const { t } = useLanguage();
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex bg-surface rounded-2xl items-center justify-center p-8 mt-12 min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 md:w-16 md:h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted text-sm md:text-base animate-pulse">{t.portal.companyProfile.loadingProfile}</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex bg-surface rounded-2xl items-center justify-center p-8 mt-12 min-h-[400px]">
        <div className="text-center text-red-500">
          <p>{error || t.portal.companyProfile.loadFailed}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl mx-auto space-y-6">
        <CompanyProfileForm
          initialData={vendor}
          onUpdate={(updatedData) => {
            updateVendorContext(updatedData);
          }}
          onUpdateVendorListing={() => setIsVendorModalOpen(true)}
        />
      </div>

      <VendorListingModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        onSuccess={() => fetchDashboardData()}
      />
    </div>
  );
}
