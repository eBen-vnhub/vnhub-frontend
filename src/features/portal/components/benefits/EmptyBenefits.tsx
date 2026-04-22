import { Gift } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';

export default function EmptyBenefits() {
  const { t } = useLanguage();

  return (
    <div className="bg-surface border border-border rounded-2xl p-12 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-4">
        <Gift className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-main mb-2">
        {(t.portal as any).myBenefits?.noBenefitsTitle || 'No Benefits Found'}
      </h3>
      <p className="text-muted max-w-md">
        {(t.portal as any).myBenefits?.noBenefitsDesc || "You haven't added any benefits yet. Go to your Subscriptions page to add a new benefit to an active plan."}
      </p>
    </div>
  );
}
