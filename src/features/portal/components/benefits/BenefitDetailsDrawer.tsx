import { X, Edit3, MapPin, Users, Tag, CheckCircle2, Image as ImageIcon, Briefcase, CreditCard } from 'lucide-react';
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

  const labels = (t.portal as any).myBenefits || {};
  const profileLabels = t.portal.companyProfile as any;
  const enums = profileLabels.enums || {};

  const formatEnum = (val: string | null | undefined, mappings: Record<string, string> | undefined) => {
    if (!val) return '';
    const cleanVal = val.toUpperCase();
    if (mappings) {
      const found = mappings[cleanVal] || mappings[val];
      if (found) return found;
    }
    return val.replace(/_/g, ' ');
  };

  const formatMultipleEnums = (val: string | null | undefined, mappings: Record<string, string> | undefined) => {
    if (!val) return '';
    return val.split(',').map(v => formatEnum(v.trim(), mappings)).join(', ');
  };

  const getLogo = () => benefit.mediaAssets?.find((m: any) => m.mediaCategory === 'LOGO')?.fileUrl;

  const DetailRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: any }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-4">
        <div className="mt-0.5 bg-surface-hover p-2 rounded-lg text-brand">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</p>
          <p className="text-sm font-medium text-main">{value}</p>
        </div>
      </div>
    );
  };

  const hasPricing = benefit.currency || benefit.originalPrice != null || benefit.discountedPrice != null || benefit.productUnits;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-10 pointer-events-none">
        <div className="bg-surface rounded-3xl shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden pointer-events-auto">

          <div className="relative h-28 bg-gradient-to-r from-brand/10 via-brand/5 to-surface-hover shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-main bg-surface/50 hover:bg-surface backdrop-blur-md rounded-full shadow-sm transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute -bottom-10 left-8">
              <div className="w-20 h-20 rounded-2xl bg-surface border-4 border-surface flex items-center justify-center overflow-hidden shadow-md">
                {getLogo() ? (
                  <img src={getLogo()} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Tag className="w-8 h-8 text-brand/50" />
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pt-14 pb-8 space-y-10">

            <div>
              <h1 className="text-2xl font-black text-main mb-4 leading-tight">
                {benefit.benefitName || labels.unnamedBenefit || 'Unnamed Benefit'}
              </h1>
              <div className="flex flex-wrap gap-2">
                {benefit.discountPercentage > 0 && (
                  <span className="px-3 py-1 bg-green-500/10 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {benefit.discountPercentage}% {((t.portal.companyProfile as any).off) || 'OFF'}
                  </span>
                )}
              </div>
            </div>

            {(benefit.benefitDescription || benefit.detailedContent) && (
              <div className="prose prose-sm max-w-none text-muted leading-relaxed">
                <p>{benefit.benefitDescription || benefit.detailedContent}</p>
              </div>
            )}

            {hasPricing && (
              <div className="flex flex-wrap items-center gap-x-12 gap-y-6 py-6 border-y border-border">
                {benefit.originalPrice != null && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{profileLabels.originalPrice || 'Original Price'}</p>
                    <p className="text-xl font-medium text-muted line-through">{benefit.originalPrice} {formatEnum(benefit.currency, enums.currency)}</p>
                  </div>
                )}
                {benefit.discountedPrice != null && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{profileLabels.discountedPrice || 'Discount Price'}</p>
                    <p className="text-2xl font-black text-brand">{benefit.discountedPrice} {formatEnum(benefit.currency, enums.currency)}</p>
                  </div>
                )}
                {!benefit.originalPrice && !benefit.discountedPrice && benefit.currency && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{profileLabels.currency || 'Currency'}</p>
                    <p className="text-xl font-bold text-main">{formatEnum(benefit.currency, enums.currency)}</p>
                  </div>
                )}
                {benefit.productUnits && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{profileLabels.productUnits || 'Product Unit'}</p>
                    <p className="text-xl font-medium text-main capitalize">{formatEnum(benefit.productUnits, enums.productUnits)}</p>
                  </div>
                )}
              </div>
            )}

            {(benefit.valueProposition || benefit.brandIntro || benefit.brandDifferentiator || benefit.featuresContent || benefit.limitationsContent || benefit.freeGiftDescription || benefit.referenceUrl) && (
              <div>
                <h3 className="text-sm font-bold text-main uppercase tracking-widest mb-6 border-b border-border pb-3">
                  {labels.drawerOfferDetails || 'Offer Details'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DetailRow icon={Tag} label={profileLabels.valueProposition || 'Value Proposition'} value={formatEnum(benefit.valueProposition, enums.valueProp)} />
                  <DetailRow icon={Briefcase} label={profileLabels.brandIntro || 'Brand Intro'} value={benefit.brandIntro} />
                  <DetailRow icon={Briefcase} label={profileLabels.brandDifferentiator || 'Brand Differentiator'} value={benefit.brandDifferentiator} />
                  <DetailRow icon={CheckCircle2} label={profileLabels.features || 'Features'} value={benefit.featuresContent} />
                  <DetailRow icon={X} label={profileLabels.limitations || 'Limitations'} value={benefit.limitationsContent} />
                  <DetailRow icon={Tag} label={profileLabels.freeGift || 'Free Gift'} value={benefit.freeGiftDescription} />
                  {benefit.referenceUrl && (
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 bg-surface-hover p-2 rounded-lg text-brand">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{profileLabels.referenceUrl || 'Reference URL'}</p>
                        <a href={benefit.referenceUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand hover:underline block break-all">
                          {benefit.referenceUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {benefit.targeting && (
                <div>
                  <h3 className="text-sm font-bold text-main uppercase tracking-widest mb-6 border-b border-border pb-3">
                    {profileLabels.targeting || 'Targeting'}
                  </h3>
                  <div className="space-y-6">
                    <DetailRow icon={MapPin} label={profileLabels.geoTargeting || 'Geographic'} value={formatEnum(benefit.targeting.geoTargetingType, enums.geo)} />
                    <DetailRow icon={Users} label={profileLabels.genderTargeting || 'Gender'} value={formatEnum(benefit.targeting.genderTargeting, enums.gender)} />
                    <DetailRow icon={Users} label={profileLabels.parentTargeting || 'Parent Status'} value={formatEnum(benefit.targeting.parentTargeting, enums.parent)} />
                  </div>
                </div>
              )}

              {benefit.claimSettings && (
                <div>
                  <h3 className="text-sm font-bold text-main uppercase tracking-widest mb-6 border-b border-border pb-3">
                    {labels.drawerClaimPayment || 'Claim & Payment'}
                  </h3>
                  <div className="space-y-6">
                    {benefit.claimSettings.claimMethod && (
                      <DetailRow icon={Tag} label={profileLabels.claimMethod || 'Claim Method'} value={formatEnum(benefit.claimSettings.claimMethod, enums.claimMethod)} />
                    )}
                    {benefit.claimSettings.discountCodeType && (
                      <DetailRow icon={Tag} label={profileLabels.codeType || 'Code Type'} value={formatEnum(benefit.claimSettings.discountCodeType, enums.discountCodeType)} />
                    )}
                    {benefit.claimSettings.paymentCollection && (
                      <DetailRow icon={CreditCard} label={profileLabels.payment || 'Payment'} value={formatEnum(benefit.claimSettings.paymentCollection, enums.payment)} />
                    )}
                    {benefit.claimSettings.purchaseMethod && (
                      <DetailRow icon={CreditCard} label={profileLabels.purchaseMethod || 'Purchase Method'} value={formatMultipleEnums(benefit.claimSettings.purchaseMethod, enums.purchaseMethod)} />
                    )}
                    {benefit.claimSettings.receiveMethod && (
                      <DetailRow icon={MapPin} label={profileLabels.receiveMethod || 'Receive Method'} value={formatMultipleEnums(benefit.claimSettings.receiveMethod, enums.receiveMethod)} />
                    )}
                    {benefit.claimSettings.claimButtonText && (
                      <DetailRow icon={Tag} label={profileLabels.claimButton || 'CTA Button'} value={formatEnum(benefit.claimSettings.claimButtonText, enums.ctaButtons)} />
                    )}
                    {benefit.claimSettings.claimTermsUrl && (
                      <div className="mt-4">
                        <a href={benefit.claimSettings.claimTermsUrl} target="_blank" rel="noreferrer" className="text-sm text-brand font-semibold hover:underline">
                          {profileLabels.viewTerms || 'View Terms & Conditions'} →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {benefit.mediaAssets && benefit.mediaAssets.filter((m: any) => m.mediaCategory !== 'LOGO').length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-main uppercase tracking-widest mb-6 border-b border-border pb-3">
                  {labels.drawerMedia || 'Media & Gallery'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {benefit.mediaAssets.filter((m: any) => m.mediaCategory !== 'LOGO').map((asset: any) => (
                    <a key={asset.id} href={asset.fileUrl} target="_blank" rel="noreferrer" className="group relative aspect-video sm:aspect-square rounded-xl overflow-hidden bg-surface-hover border border-border">
                      {asset.mediaType === 'IMAGE' ? (
                        <img src={asset.fileUrl} alt={asset.mediaCategory} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-muted-foreground">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-30 group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-[10px] font-bold uppercase">{asset.mediaType}</span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 bg-surface/80 backdrop-blur-xl border-t border-border p-6 flex justify-end shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <Button
              onClick={() => {
                onClose();
                onEdit(benefit.id);
              }}
              className="rounded-full shadow-lg px-8 py-2.5 font-bold tracking-wide"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {labels.editBenefit || 'Edit Benefit'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
