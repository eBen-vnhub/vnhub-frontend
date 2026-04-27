import { useEffect, useState, useCallback } from 'react';
import { Gift, Loader2, Package } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import vendorsService from '../../../services/vendors';
import onboardingService from '../../../services/onboarding';
import BenefitListingModal from '../../../components/portal/BenefitListingModal';
import BenefitCard from '../components/benefits/BenefitCard';
import EmptyBenefits from '../components/benefits/EmptyBenefits';
import BenefitDetailsDrawer from '../components/benefits/BenefitDetailsDrawer';

interface GroupedBenefits {
  subscriptionId: number;
  planName: string;
  benefits: any[];
}
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
    const [listingsData, trackersData] = await Promise.all([
      vendorsService.getListingsData(),
      onboardingService.getBenefitTrackers().catch(() => [])
    ]);

    const offersMap: Record<string, any> = {};
    if (listingsData.benefitListing?.benefitOffers) {
      for (const offer of listingsData.benefitListing.benefitOffers) {
        if (offer.id) offersMap[String(offer.id)] = offer;
      }
    }

    const mappedBenefits = trackersData.map((tracker: any) => {
      const matchedOffer = tracker.external_benefit_id
        ? offersMap[String(tracker.external_benefit_id)]
        : null;
      return {
        id: tracker.id,
        benefitNumber: tracker.benefit_number,
        offerType: matchedOffer?.offerType || 'Benefit',
        offerDescription: matchedOffer?.offerDescription || tracker.benefit_number,
        discountValue: matchedOffer?.discountValue || '',
        ...matchedOffer,
        trackerStatus: tracker.status || 'PENDING',
        subscriptionPlan: tracker.subscription_plan || 'Unknown',
        subscriptionId: tracker.subscription || 0,
        testLink: tracker.test_link,
        liveLink: tracker.live_link,
      };
    });
    setBenefits(mappedBenefits);
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

const groupedBenefits = Object.values(
  benefits.reduce((acc, benefit) => {
    const subId = benefit.subscriptionId || 0;
    if (!acc[subId]) {
      acc[subId] = {
        subscriptionId: subId,
        planName: benefit.subscriptionPlan,
        benefits: []
      };
    }
    acc[subId].benefits.push(benefit);
    return acc;
  }, {} as Record<number, GroupedBenefits>)
);

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

    {groupedBenefits.length === 0 ? (
      <EmptyBenefits />
    ) : (
      <div className="space-y-8">
        {groupedBenefits.map((group: any) => (
          <div key={group.subscriptionId} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-surface-hover px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-main flex items-center gap-2">
                <Package className="w-5 h-5 text-brand" />
                {((t.portal as any).myBenefits?.planBenefits || '{{plan}} Plan Benefits').replace('{{plan}}', group.planName)}
              </h2>
              <span className="text-sm font-semibold bg-brand/10 text-brand px-3 py-1 rounded-full">
                {((t.portal as any).myBenefits?.benefitsCount || '{{count}} Benefits').replace('{{count}}', group.benefits.length.toString())}
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {group.benefits.map((benefit: any) => (
                <BenefitCard key={benefit.id} benefit={benefit} onClick={handleBenefitClick} />
              ))}
            </div>
          </div>
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
