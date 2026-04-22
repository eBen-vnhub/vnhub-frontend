import { useEffect, useState, useCallback } from 'react';
import { Gift, Edit3, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import vendorsService from '../../../services/vendors';
import BenefitListingModal from '../../../components/portal/BenefitListingModal';

export default function MyBenefitsPage() {
  const { t } = useLanguage();
  const [benefits, setBenefits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBenefitId, setEditingBenefitId] = useState<number | null>(null);
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

  const handleEdit = (benefitId: number) => {
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
          My Benefits
        </h1>
        <p className="text-muted">Manage all your active and pending benefits across your subscriptions.</p>
      </div>

      {benefits.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-4">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-main mb-2">No Benefits Found</h3>
          <p className="text-muted max-w-md">
            You haven't added any benefits yet. Go to your Subscriptions page to add a new benefit to an active plan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit: any) => (
            <div key={benefit.id} className="bg-surface border border-border rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  {benefit.mediaAssets?.find((m: any) => m.mediaCategory === 'LOGO') ? (
                    <img 
                      src={benefit.mediaAssets.find((m: any) => m.mediaCategory === 'LOGO').fileUrl} 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Gift className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-brand/10 text-brand rounded-full">
                  {benefit.claimSettings?.claimMethod || 'Benefit'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-main mb-1 line-clamp-1">
                {benefit.benefitName || 'Unnamed Benefit'}
              </h3>
              
              <p className="text-sm text-muted mb-4 line-clamp-2 flex-grow">
                {benefit.benefitDescription || benefit.detailedContent || 'No description provided.'}
              </p>
              
              <div className="border-t border-border pt-4 mt-auto">
                <button
                  onClick={() => handleEdit(benefit.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold text-sm bg-surface-hover text-main hover:bg-gray-100 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Benefit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
