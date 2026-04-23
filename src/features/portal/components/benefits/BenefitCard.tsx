import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';

interface BenefitCardProps {
  benefit: any;
  onClick: (benefit: any) => void;
}

export default function BenefitCard({ benefit, onClick }: BenefitCardProps) {
  const { t } = useLanguage();




  return (
    <div 
      className="bg-surface border border-border rounded-2xl flex flex-col hover:shadow-lg hover:-translate-y-1 hover:border-brand/30 transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => onClick(benefit)}
    >
      <div className="h-2 bg-gradient-to-r from-brand to-brand/60" />
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4 gap-3">
          <h3 className="text-xl font-extrabold text-main line-clamp-2 group-hover:text-brand transition-colors">
            {benefit.benefitName || (t.portal as any).myBenefits?.unnamedBenefit || 'Unnamed Benefit'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] font-semibold text-muted-foreground">
          {benefit.discountPercentage > 0 && (
            <span className="flex items-center gap-1 text-green-700 bg-green-500/10 px-2 py-0.5 rounded-full">
              💰 {benefit.discountPercentage}% {((t.portal.companyProfile as any).off) || 'OFF'}
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted line-clamp-2 flex-grow mb-6 leading-relaxed">
          {benefit.benefitDescription || benefit.detailedContent || (t.portal as any).myBenefits?.noDescription || 'No description provided.'}
        </p>
        
        <div className="flex items-center text-xs font-bold text-brand mt-auto pt-4 border-t border-border opacity-70 group-hover:opacity-100 transition-opacity">
          {(t.portal as any).myBenefits?.clickViewDetails || 'View details'}
          <ArrowRight className="w-4 h-4 ml-1.5 rtl:ml-0 rtl:mr-1.5 transform rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
