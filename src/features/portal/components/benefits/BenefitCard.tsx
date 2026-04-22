import { Edit3, Gift } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';

interface BenefitCardProps {
  benefit: any;
  onEdit: (id: number) => void;
}

export default function BenefitCard({ benefit, onEdit }: BenefitCardProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow">
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
        <button
          onClick={() => onEdit(benefit.id)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold text-sm bg-surface-hover text-main hover:bg-gray-100 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          {(t.portal as any).myBenefits?.editBenefit || 'Edit Benefit'}
        </button>
      </div>
    </div>
  );
}
