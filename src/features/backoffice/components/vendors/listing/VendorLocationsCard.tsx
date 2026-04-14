import { MapPin } from 'lucide-react';

interface Props {
  companyLocations: any[];
  deliveryLocations: any[];
}

export default function VendorLocationsCard({ companyLocations, deliveryLocations }: Props) {
  if (!companyLocations?.length && !deliveryLocations?.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {companyLocations?.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border p-4">
          <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">Company Locations</h4>
          <div className="flex flex-wrap gap-2">
            {companyLocations.map((loc: any) => (
              <span key={loc.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-brand/10 text-brand rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                {loc.country?.countryName || loc.country?.countryCode || 'Unknown'}
              </span>
            ))}
          </div>
        </div>
      )}
      {deliveryLocations?.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border p-4">
          <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">Delivery Coverage</h4>
          {deliveryLocations.map((dl: any) => (
            <div key={dl.id} className="text-sm font-medium text-main">
              {dl.isWorldwide ? '🌍 Worldwide Delivery' : 'Local Delivery'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
