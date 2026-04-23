import { MapPin, LayoutList, Share2 } from 'lucide-react';

interface VendorTargetingSectionProps {
  vl: any;
  listing: any;
}

export default function VendorTargetingSection({ vl, listing }: VendorTargetingSectionProps) {
  const cp = vl.companyProfile;
  if (!cp?.geoTargeting && !cp?.listingGoal && !cp?.advertisingFor) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {cp?.geoTargeting && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {listing.geoTargeting || 'Geo Targeting'}
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-main">
            <MapPin className="w-4 h-4 text-brand/70 flex-shrink-0" />
            {cp.geoTargeting}
          </div>
        </div>
      )}
      {cp?.listingGoal && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {listing.listingGoal || 'Listing Goal'}
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-main">
            <LayoutList className="w-4 h-4 text-brand/70 flex-shrink-0" />
            {cp.listingGoal}
          </div>
        </div>
      )}
      {cp?.advertisingFor && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {listing.advertisingFor || 'Advertising For'}
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-main">
            <Share2 className="w-4 h-4 text-brand/70 flex-shrink-0" />
            {cp.advertisingFor}
          </div>
        </div>
      )}
    </div>
  );
}
