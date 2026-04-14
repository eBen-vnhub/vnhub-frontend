import { Building } from 'lucide-react';
import { useLanguage } from '../../../../../i18n/LanguageContext';

interface Props {
  companyProfile: any;
}

export default function VendorBrandCard({ companyProfile }: Props) {
  const { t } = useLanguage();
  const brandName = companyProfile?.brandName;
  const brandDescription = companyProfile?.brandDescription;

  return (
    <div className="bg-surface rounded-2xl border border-border p-4">
      <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">{t.backoffice.listing.brandIdentity}</h4>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold text-2xl flex-shrink-0">
          {brandName?.charAt(0) || <Building className="w-6 h-6" />}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-main text-lg truncate">{brandName || 'N/A'}</div>
          <div className="text-sm text-muted line-clamp-2">{brandDescription || t.backoffice.listing.noDescription}</div>
          {companyProfile?.companyName && companyProfile.companyName !== brandName && (
            <div className="text-xs text-muted mt-1">{companyProfile.companyName}</div>
          )}
        </div>
      </div>
    </div>
  );
}
