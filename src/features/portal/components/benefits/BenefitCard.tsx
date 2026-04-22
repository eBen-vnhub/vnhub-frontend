import { Gift } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';

interface BenefitCardProps {
  benefit: any;
  onClick: (benefit: any) => void;
}

export default function BenefitCard({ benefit, onClick }: BenefitCardProps) {
  const { t } = useLanguage();

  return (
    <div 
      className="bg-surface border border-border rounded-2xl p-6 flex flex-col hover:shadow-lg hover:border-brand/30 transition-all cursor-pointer group"
      onClick={() => onClick(benefit)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
          {benefit.mediaAssets?.find((m: any) => m.mediaCategory === 'LOGO') ? (
            <img 
              src={benefit.mediaAssets.find((m: any) => m.mediaCategory === 'LOGO').fileUrl} 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          ) : (
            <Gift className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-brand/10 text-brand rounded-full">
          {benefit.claimSettings?.claimMethod || 'Benefit'}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-main mb-1 line-clamp-1">
        {benefit.benefitName || (t.portal as any).myBenefits?.unnamedBenefit || 'Unnamed Benefit'}
      </h3>
      
      <p className="text-sm text-muted mb-4 line-clamp-2 flex-grow">
        {benefit.benefitDescription || benefit.detailedContent || (t.portal as any).myBenefits?.noDescription || 'No description provided.'}
      </p>
      
      <div className="border-t border-border pt-4 mt-auto">
        <p className="w-full text-center text-xs font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity">
          Click to view details
        </p>
      </div>
    </div>
  );
}
