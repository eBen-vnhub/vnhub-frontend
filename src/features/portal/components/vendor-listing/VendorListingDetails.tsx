import { Store, LayoutList, Share2, MapPin } from 'lucide-react';

interface VendorListingDetailsProps {
  listingsData: any;
  t: any;
}

export default function VendorListingDetails({ listingsData, t }: VendorListingDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand/5 rounded-xl flex items-center justify-center flex-shrink-0">
            <Store className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-main">{listingsData.vendorListing.companyProfile?.brandName || 'N/A'}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {listingsData.vendorListing.companyProfile?.brandDescription || (t.backoffice.listing as any).noDescription || 'No description provided'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {(t.backoffice.listing as any).geoTargeting || 'Geo Targeting'}
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-main">
            <MapPin className="w-4 h-4 text-brand/70" />
            {listingsData.vendorListing.companyProfile?.geoTargeting || 'N/A'}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {(t.backoffice.listing as any).listingGoal || 'Listing Goal'}
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-main">
            <LayoutList className="w-4 h-4 text-brand/70" />
            {listingsData.vendorListing.companyProfile?.listingGoal || 'N/A'}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {(t.backoffice.listing as any).advertisingFor || 'Advertising For'}
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-main">
            <Share2 className="w-4 h-4 text-brand/70" />
            {listingsData.vendorListing.companyProfile?.advertisingFor || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
