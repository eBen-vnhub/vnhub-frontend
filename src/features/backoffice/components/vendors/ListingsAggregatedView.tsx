import { Building } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';
import ListingCardHeader from './listing/ListingCardHeader';
import VendorBrandCard from './listing/VendorBrandCard';
import VendorAdminCard from './listing/VendorAdminCard';
import VendorAddressCard from './listing/VendorAddressCard';
import VendorLocationsCard from './listing/VendorLocationsCard';
import VendorDocumentsCard from './listing/VendorDocumentsCard';
import VendorSocialCard from './listing/VendorSocialCard';
import BenefitListingCard from './listing/BenefitListingCard';

interface Props {
  data: { vendorListing: any; benefitListing: any } | null;
}

export default function ListingsAggregatedView({ data }: Props) {
  const { t } = useLanguage();

  if (!data) return null;

  const { vendorListing, benefitListing } = data;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-surface to-surface-hover/30 border border-border rounded-3xl overflow-hidden shadow-sm">
        <ListingCardHeader
          icon={<Building className="w-5 h-5 text-brand" />}
          title={t.backoffice.listing.vendorListingData}
          submittedAt={vendorListing?.submittedAt}
        />

        <div className="p-6">
          {!vendorListing ? (
            <div className="text-center py-8 text-muted border border-dashed border-border rounded-2xl bg-surface/50">
              {t.backoffice.listing.noVendorData}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <VendorBrandCard companyProfile={vendorListing.companyProfile} />
                <VendorAdminCard administrator={vendorListing.administrator} />
              </div>
              <VendorAddressCard hqAddress={vendorListing.hqAddressEntity} companyPhones={vendorListing.companyPhones} />
              <VendorLocationsCard companyLocations={vendorListing.companyLocations} deliveryLocations={vendorListing.deliveryLocations} />
              <VendorDocumentsCard files={vendorListing.files} />
              <VendorSocialCard companyProfile={vendorListing.companyProfile} socialLinks={vendorListing.socialLinks} />
            </div>
          )}
        </div>
      </div>

      <BenefitListingCard benefitListing={benefitListing} />
    </div>
  );
}
