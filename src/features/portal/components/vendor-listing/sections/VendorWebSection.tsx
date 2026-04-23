import { Globe } from 'lucide-react';

interface VendorWebSectionProps {
  vl: any;
  listing: any;
}

export default function VendorWebSection({ vl, listing }: VendorWebSectionProps) {
  const cp = vl.companyProfile;
  const hasWebsite = !!cp?.websiteUrl;
  const hasYoutube = !!cp?.youtubeVideoUrl;

  if (!hasWebsite && !hasYoutube) return null;

  return (
    <div className="border-t border-border pt-5 space-y-3">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
        <Globe className="w-3 h-3" /> {listing.website}
      </span>
      {hasWebsite && (
        <a
          href={cp.websiteUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-brand font-medium truncate block hover:underline"
        >
          {cp.websiteUrl}
        </a>
      )}
      {hasYoutube && (
        <div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">YouTube</span>
          <a
            href={cp.youtubeVideoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-red-600 font-medium truncate block hover:underline mt-0.5"
          >
            {listing.watchVideo}
          </a>
        </div>
      )}
    </div>
  );
}
