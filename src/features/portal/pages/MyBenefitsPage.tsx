import { useEffect, useState, useCallback } from 'react';
import { Gift, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import vendorsService from '../../../services/vendors';
import BenefitListingModal from '../../../components/portal/BenefitListingModal';
import BenefitCard from '../components/benefits/BenefitCard';
import EmptyBenefits from '../components/benefits/EmptyBenefits';
import BenefitDetailsDrawer from '../components/benefits/BenefitDetailsDrawer';

export default function MyBenefitsPage() {
  const { t } = useLanguage();
  const [benefits, setBenefits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBenefit, setSelectedBenefit] = useState<any>(null);
  const [editingBenefitId, setEditingBenefitId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBenefits = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await vendorsService.getListingsData();
      if (data.benefitListing?.benefitOffers) {
        setBenefits(data.benefitListing.benefitOffers);
      } else {
        setBenefits([]);
      }
    } catch (error) {
      console.error('Failed to fetch benefits', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBenefits();
  }, [fetchBenefits]);

  const handleBenefitClick = (benefit: any) => {
    setSelectedBenefit(benefit);
    setIsDrawerOpen(true);
  };

  const handleEdit = (benefitId: number) => {
    setIsDrawerOpen(false);
    setSelectedBenefit(null);
    setEditingBenefitId(benefitId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBenefitId(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchBenefits();
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-main mb-2 flex items-center gap-3">
          <Gift className="w-8 h-8 text-brand" />
          {(t.portal as any).myBenefits?.title || 'My Benefits'}
        </h1>
        <p className="text-muted">
          {(t.portal as any).myBenefits?.subtitle || 'Manage all your active and pending benefits across your subscriptions.'}
        </p>
      </div>

      {benefits.length === 0 ? (
        <EmptyBenefits />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit: any) => (
            <BenefitCard key={benefit.id} benefit={benefit} onClick={handleBenefitClick} />
          ))}
        </div>
      )}

      <BenefitDetailsDrawer
        benefit={selectedBenefit}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={handleEdit}
      />

      {isModalOpen && (
        <BenefitListingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          benefitId={editingBenefitId || undefined}
        />
      )}
    </div>
  );
}
