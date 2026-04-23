import { MapPin } from 'lucide-react';

interface VendorAddressSectionProps {
  vl: any;
  listing: any;
}

export default function VendorAddressSection({ vl, listing }: VendorAddressSectionProps) {
  const hq = vl.hqAddressEntity;

  return (
    <div className="border-t border-border pt-5 space-y-1.5">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
        <MapPin className="w-3 h-3" /> {listing.hqAddress}
      </span>
      {hq ? (
        <div className="text-sm text-main font-medium space-y-0.5">
          <p>{[hq.building, hq.street, hq.city].filter(Boolean).join(', ')}</p>
          {hq.postalCode && (
            <p className="text-muted text-xs">Postal Code: {hq.postalCode}</p>
          )}
          {hq.additionalNotes && (
            <p className="text-muted text-xs italic">"{hq.additionalNotes}"</p>
          )}
          {hq.googleMapsUrl && (
            <a
              href={hq.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
            >
              {listing.viewOnMaps}
            </a>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted">{listing.noAddress}</p>
      )}
    </div>
  );
}
