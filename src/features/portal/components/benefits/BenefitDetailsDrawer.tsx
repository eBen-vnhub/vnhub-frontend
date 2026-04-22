import { X, Edit3, MapPin, Users, Tag, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';
import Button from '../../../../components/ui/Button';

interface BenefitDetailsDrawerProps {
  benefit: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: number) => void;
}

export default function BenefitDetailsDrawer({ benefit, isOpen, onClose, onEdit }: BenefitDetailsDrawerProps) {
  const { t } = useLanguage();

  if (!isOpen || !benefit) return null;

  const enums = (t.portal.companyProfile as any).enums || {};

  const formatEnum = (val: string | null | undefined, mappings: Record<string, string> | undefined) => {
    if (!val) return 'N/A';
    const cleanVal = val.toUpperCase();
    if (mappings) {
      const found = mappings[cleanVal] || mappings[val];
      if (found) return found;
    }
    return val.replace(/_/g, ' ');
  };

  const getLogo = () => benefit.mediaAssets?.find((m: any) => m.mediaCategory === 'LOGO')?.fileUrl;

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-[110] w-full max-w-2xl bg-surface shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500 border-l border-border">
        <div className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-main flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand" />
            {(t.portal as any).myBenefits?.benefitDetails || 'Benefit Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-main hover:bg-surface-hover rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 shrink-0 rounded-2xl bg-surface-hover border border-border flex items-center justify-center overflow-hidden shadow-sm">
              {getLogo() ? (
                <img src={getLogo()} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Tag className="w-10 h-10 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-brand/10 text-brand rounded-full">
                  {formatEnum(benefit.claimSettings?.claimMethod, enums.claimMethod)}
                </span>
                {benefit.discountPercentage > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-green-500/10 text-green-700 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {benefit.discountPercentage}% OFF
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-main mb-2">
                {benefit.benefitName || 'Unnamed Benefit'}
              </h1>
              <p className="text-sm text-muted leading-relaxed">
                {benefit.benefitDescription || benefit.detailedContent || 'No description provided.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface-hover/30 rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground uppercase mb-1">Currency</p>
              <p className="text-lg font-bold text-main">{benefit.currency || 'N/A'}</p>
            </div>
            <div className="bg-surface-hover/30 rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground uppercase mb-1">Original Price</p>
              <p className="text-lg font-bold text-main">{benefit.originalPrice ?? 'N/A'}</p>
            </div>
            <div className="bg-surface-hover/30 rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground uppercase mb-1">Discount Price</p>
              <p className="text-lg font-bold text-brand">{benefit.discountedPrice ?? 'N/A'}</p>
            </div>
            <div className="bg-surface-hover/30 rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground uppercase mb-1">Product Units</p>
              <p className="text-lg font-bold text-main">{benefit.productUnits || 'N/A'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-main uppercase tracking-wide border-b border-border pb-2">
              Marketing & Content
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefit.brandIntro && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Brand Introduction</p>
                  <p className="text-sm text-main">{benefit.brandIntro}</p>
                </div>
              )}
              {benefit.brandDifferentiator && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Brand Differentiator</p>
                  <p className="text-sm text-main">{benefit.brandDifferentiator}</p>
                </div>
              )}
              {benefit.featuresContent && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Features</p>
                  <p className="text-sm text-main">{benefit.featuresContent}</p>
                </div>
              )}
              {benefit.limitationsContent && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Limitations</p>
                  <p className="text-sm text-main">{benefit.limitationsContent}</p>
                </div>
              )}
              {benefit.hasFreeGift && benefit.freeGiftDescription && (
                <div className="col-span-full">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Free Gift</p>
                  <p className="text-sm text-main">{benefit.freeGiftDescription}</p>
                </div>
              )}
            </div>
          </div>

          {benefit.targeting && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-main uppercase tracking-wide border-b border-border pb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand" /> Targeting
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 bg-surface-hover/30 p-4 rounded-xl border border-border">
                  <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Geographic</p>
                    <p className="text-sm font-semibold text-main">{formatEnum(benefit.targeting.geoTargetingType, enums.geo)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-surface-hover/30 p-4 rounded-xl border border-border">
                  <Users className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Gender</p>
                    <p className="text-sm font-semibold text-main">{formatEnum(benefit.targeting.genderTargeting, enums.gender)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-surface-hover/30 p-4 rounded-xl border border-border">
                  <Users className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Parent Status</p>
                    <p className="text-sm font-semibold text-main">{formatEnum(benefit.targeting.parentTargeting, enums.parent)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {benefit.claimSettings && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-main uppercase tracking-wide border-b border-border pb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand" /> Claim Settings
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Method</p>
                  <p className="text-sm font-medium text-main">{formatEnum(benefit.claimSettings.claimMethod, enums.claimMethod)}</p>
                </div>
                {benefit.claimSettings.discountCodeType && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Code Type</p>
                    <p className="text-sm font-medium text-main">{formatEnum(benefit.claimSettings.discountCodeType, enums.discountCodeType)}</p>
                  </div>
                )}
                {benefit.claimSettings.paymentCollection && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Payment</p>
                    <p className="text-sm font-medium text-main">{formatEnum(benefit.claimSettings.paymentCollection, enums.payment)}</p>
                  </div>
                )}
              </div>
              {benefit.claimSettings.claimTermsUrl && (
                <div className="mt-4 p-4 bg-brand/5 border border-brand/10 rounded-xl">
                  <p className="text-sm text-main font-medium mb-1">Terms & Conditions</p>
                  <a href={benefit.claimSettings.claimTermsUrl} target="_blank" rel="noreferrer" className="text-xs text-brand hover:underline">
                    View full terms document →
                  </a>
                </div>
              )}
            </div>
          )}

          {benefit.mediaAssets && benefit.mediaAssets.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-main uppercase tracking-wide border-b border-border pb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand" /> Media Assets
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {benefit.mediaAssets.map((asset: any) => (
                  <a key={asset.id} href={asset.fileUrl} target="_blank" rel="noreferrer" className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-surface-hover">
                    {asset.mediaType === 'IMAGE' ? (
                      <img src={asset.fileUrl} alt={asset.mediaCategory} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-[10px] font-bold uppercase">{asset.mediaType}</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                      <p className="text-[10px] font-bold text-white uppercase truncate">
                        {asset.mediaCategory.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 bg-surface/80 backdrop-blur-md border-t border-border p-4 sm:px-8 flex justify-end">
          <Button 
            onClick={() => {
              onClose();
              onEdit(benefit.id);
            }} 
            className="rounded-full shadow-lg"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {(t.portal as any).myBenefits?.editBenefit || 'Edit Benefit'}
          </Button>
        </div>
      </div>
    </>
  );
}
