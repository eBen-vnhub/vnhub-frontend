import { Store, Edit2 } from 'lucide-react';
import Button from '../../../../components/ui/Button';

interface VendorListingHeaderProps {
  hasVendorListing: boolean;
  canEditCompanyProfile: boolean;
  t: any;
  onOpenModal: () => void;
}

export default function VendorListingHeader({
  hasVendorListing,
  canEditCompanyProfile,
  t,
  onOpenModal
}: VendorListingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-main flex items-center gap-2">
          <Store className="w-5 h-5 text-brand" />
          {(t.portal.companyProfile as any).vendorListingData || 'Vendor Listing Data'}
        </h2>
        <p className="text-sm text-muted mt-1">
          {(t.portal.companyProfile as any).vendorListingDesc || 'Manage your company logo, trade license, specific brand information, and social media links.'}
        </p>
      </div>

      {canEditCompanyProfile && (
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 rounded-full"
          onClick={onOpenModal}
        >
          <Edit2 className="w-4 h-4" />
          {hasVendorListing
            ? ((t.portal.companyProfile as any).updateVendorData || 'Update Vendor Listing')
            : ((t.portal.companyProfile as any).createVendorData || 'Complete Vendor Listing')}
        </Button>
      )}
    </div>
  );
}
