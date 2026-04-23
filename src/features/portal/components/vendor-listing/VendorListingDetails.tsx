
import VendorBrandSection from './sections/VendorBrandSection';
import VendorAdminSection from './sections/VendorAdminSection';
import VendorAddressSection from './sections/VendorAddressSection';
import VendorWebSection from './sections/VendorWebSection';
import VendorLocationsSection from './sections/VendorLocationsSection';
import VendorSocialSection from './sections/VendorSocialSection';
import VendorDocumentsSection from './sections/VendorDocumentsSection';
import VendorTargetingSection from './sections/VendorTargetingSection';

interface VendorListingDetailsProps {
  listingsData: any;
  t: any;
}

export default function VendorListingDetails({ listingsData, t }: VendorListingDetailsProps) {
  const vl = listingsData.vendorListing;
  const listing = t.backoffice.listing;

  return (
    <div className="space-y-6">
      <VendorBrandSection vl={vl} listing={listing} />
      <VendorTargetingSection vl={vl} listing={listing} />
      {vl.administrator && <VendorAdminSection vl={vl} listing={listing} />}
      <VendorAddressSection vl={vl} listing={listing} />
      <VendorWebSection vl={vl} listing={listing} />
      <VendorLocationsSection vl={vl} listing={listing} />
      <VendorSocialSection vl={vl} listing={listing} />
      <VendorDocumentsSection vl={vl} listing={listing} t={t} />
    </div>
  );
}
