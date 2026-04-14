import { MapPin, Phone, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../../../../i18n/LanguageContext';

interface Props {
  hqAddress: any;
  companyPhones: any;
}

export default function VendorAddressCard({ hqAddress, companyPhones }: Props) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-surface rounded-2xl border border-border p-4">
        <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> {t.backoffice.listing.hqAddress}
        </h4>
        {hqAddress ? (
          <div className="space-y-2">
            <div className="text-sm font-medium text-main">
              {[hqAddress.building, hqAddress.street].filter(Boolean).join(', ')}
            </div>
            <div className="text-sm text-muted">
              {[hqAddress.city, hqAddress.governorate, hqAddress.country].filter(Boolean).join(', ')}
            </div>
            {hqAddress.postalCode && (
              <div className="text-xs text-muted">Postal: {hqAddress.postalCode}</div>
            )}
            {hqAddress.googleMapsUrl && (
              <a href={hqAddress.googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-brand hover:underline mt-1">
                <ExternalLink className="w-3 h-3" /> {t.backoffice.listing.viewOnMaps}
              </a>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted">{t.backoffice.listing.noAddress}</div>
        )}
      </div>

      <div className="bg-surface rounded-2xl border border-border p-4">
        <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" /> {t.backoffice.listing.companyPhones}
        </h4>
        {companyPhones ? (
          <div className="space-y-3">
            <div>
              <div className="text-[10px] uppercase text-muted font-semibold mb-1">{t.backoffice.listing.landline}</div>
              <div className="text-sm font-medium text-main">
                {companyPhones.hqLandlineCountryCode} {companyPhones.hqLandlineNumber}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-muted font-semibold mb-1">{t.backoffice.listing.mobile}</div>
              <div className="text-sm font-medium text-main">
                {companyPhones.companyMobileCountryCode} {companyPhones.companyMobileNumber}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted">{t.backoffice.listing.noPhoneInfo}</div>
        )}
      </div>
    </div>
  );
}
