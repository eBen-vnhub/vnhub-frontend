interface VendorSocialSectionProps {
  vl: any;
  listing: any;
}

export default function VendorSocialSection({ vl, listing }: VendorSocialSectionProps) {
  if (!vl.socialLinks?.length) return null;

  return (
    <div className="border-t border-border pt-5 space-y-2">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        {listing.webSocial}
      </span>
      <div className="flex flex-wrap gap-2">
        {vl.socialLinks.map((link: any, idx: number) => (
          <a
            key={idx}
            href={link.url || link.link}
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-surface-hover border border-border px-3 py-1.5 rounded-lg text-brand hover:underline capitalize transition-colors hover:border-brand/30"
          >
            {typeof link.platform === 'object' ? link.platform.platformName : (link.platform || link.type || 'Social')}
          </a>
        ))}
      </div>
    </div>
  );
}
