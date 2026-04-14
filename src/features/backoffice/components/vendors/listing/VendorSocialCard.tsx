import { Share2, Globe, Play } from 'lucide-react';
import { useLanguage } from '../../../../../i18n/LanguageContext';

interface Props {
  companyProfile: any;
  socialLinks: any[];
}

export default function VendorSocialCard({ companyProfile, socialLinks }: Props) {
  const { t } = useLanguage();
  const websiteUrl = companyProfile?.websiteUrl;
  const youtubeUrl = companyProfile?.youtubeVideoUrl;
  const hasSocial = socialLinks && socialLinks.length > 0;
  const hasAny = websiteUrl || youtubeUrl || hasSocial;

  return (
    <div>
      <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" /> {t.backoffice.listing.webSocial}
      </h4>
      <div className="bg-surface rounded-xl border border-border divide-y divide-border/50">
        {websiteUrl && (
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-main">
              <Globe className="w-4 h-4 text-brand" /> {t.backoffice.listing.website}
            </div>
            <a href={websiteUrl} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline truncate max-w-[250px]">
              {websiteUrl}
            </a>
          </div>
        )}
        {youtubeUrl && (
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-main">
              <Play className="w-4 h-4 text-red-500" /> YouTube
            </div>
            <a href={youtubeUrl} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline truncate max-w-[250px]">
              {t.backoffice.listing.watchVideo}
            </a>
          </div>
        )}
        {hasSocial && socialLinks.map((link: any, idx: number) => (
          <div key={idx} className="px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-main capitalize">
              {typeof link.platform === 'object' ? link.platform.platformName : (link.platform || link.type || 'Social')}
            </span>
            <a href={link.url || link.link} target="_blank" rel="noreferrer" className="text-sm text-brand hover:underline truncate max-w-[250px]">
              {(link.url || link.link || '').replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </div>
        ))}
        {!hasAny && (
          <div className="px-4 py-3 text-sm text-muted text-center">{t.backoffice.listing.noLinks}</div>
        )}
      </div>
    </div>
  );
}
