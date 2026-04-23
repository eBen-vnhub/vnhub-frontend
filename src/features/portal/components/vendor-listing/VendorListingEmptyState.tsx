import { Store } from 'lucide-react';
import Button from '../../../../components/ui/Button';

interface VendorListingEmptyStateProps {
  canEditCompanyProfile: boolean;
  t: any;
  onOpenModal: () => void;
}

export default function VendorListingEmptyState({
  canEditCompanyProfile,
  t,
  onOpenModal
}: VendorListingEmptyStateProps) {
  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <Store className="w-8 h-8 text-brand/50" />
      </div>
      <h4 className="text-base font-bold text-main mb-2">
        {(t.portal.companyProfile as any).noVendorData || 'No vendor listing data provided yet.'}
      </h4>
      <p className="text-sm text-muted mb-6">
        {(t.portal.companyProfile as any).clickToUpdate || 'Click "Complete Vendor Listing" to finish your storefront setup.'}
      </p>
      {canEditCompanyProfile && (
        <Button onClick={onOpenModal}>
          {(t.portal.companyProfile as any).createVendorData || 'Complete Vendor Listing'}
        </Button>
      )}
    </div>
  );
}
