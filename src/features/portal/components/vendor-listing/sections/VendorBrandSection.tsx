import { Store } from 'lucide-react';

interface VendorBrandSectionProps {
  vl: any;
  listing: any;
}

export default function VendorBrandSection({ vl, listing }: VendorBrandSectionProps) {
  return (
    <div className="flex items-center gap-4 border-b border-border pb-5">
      <div className="w-14 h-14 bg-brand/5 rounded-xl flex items-center justify-center flex-shrink-0">
        <Store className="w-7 h-7 text-brand" />
      </div>
      <div className="min-w-0">
        <h4 className="text-lg font-bold text-main truncate">{vl.companyProfile?.brandName || 'N/A'}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
          {vl.companyProfile?.brandDescription || listing.noDescription}
        </p>
      </div>
    </div>
  );
}
