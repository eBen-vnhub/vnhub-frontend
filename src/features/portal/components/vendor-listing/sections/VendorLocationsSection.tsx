import { MapPin, Truck } from 'lucide-react';

interface VendorLocationsSectionProps {
  vl: any;
  listing: any;
}

export default function VendorLocationsSection({ vl, listing }: VendorLocationsSectionProps) {
  const hasCompanyLocations = vl.companyLocations?.length > 0;
  const hasDeliveryLocations = vl.deliveryLocations?.length > 0;

  if (!hasCompanyLocations && !hasDeliveryLocations) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-border pt-5">
      {hasCompanyLocations && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {listing.companyLocations}
          </span>
          <p className="text-sm text-main font-medium">
            {vl.companyLocations.map((loc: any) => loc.country?.countryName || loc.country?.countryCode).join(', ')}
          </p>
        </div>
      )}
      {hasDeliveryLocations && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            <Truck className="w-3 h-3" /> {listing.deliveryCoverage}
          </span>
          <p className="text-sm text-main font-medium">
            {vl.deliveryLocations.map((dl: any) =>
              dl.isWorldwide ? `🌍 ${listing.worldwide}` : (dl.country?.countryName || dl.country?.countryCode)
            ).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
