import { MapPin, Truck } from 'lucide-react';
import { useLanguage } from '../../../../../i18n/LanguageContext';

interface Props {
  companyLocations: any[];
  deliveryLocations: any[];
}

export default function VendorLocationsCard({ companyLocations, deliveryLocations }: Props) {
  const { t } = useLanguage();

  if (!companyLocations?.length && !deliveryLocations?.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {companyLocations?.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border p-4">
          <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {t.backoffice.listing.companyLocations}
          </h4>
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
          <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> {t.backoffice.listing.deliveryCoverage}
          </h4>
          <div className="flex flex-wrap gap-2">
            {deliveryLocations.map((dl: any) => (
              <span key={dl.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-emerald-500/10 text-emerald-700 rounded-full">
                {dl.isWorldwide ? (
                  <><MapPin className="w-3.5 h-3.5" /> 🌍 {t.backoffice.listing.worldwide}</>
                ) : (
                  <><MapPin className="w-3.5 h-3.5" /> {dl.country?.countryName || dl.country?.countryCode || 'Unknown'}</>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
