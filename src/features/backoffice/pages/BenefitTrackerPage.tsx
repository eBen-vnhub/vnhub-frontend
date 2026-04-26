import { useLanguage } from '../../../i18n/LanguageContext';
import BenefitBoard from '../components/benefits/BenefitBoard';

export default function BenefitTrackerPage() {
  const { t } = useLanguage();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BenefitBoard
        title={t.onboarding.trackerTitle}
        subtitle={t.onboarding.trackerSubtitle}
        columns={['QUEUE', 'BUILDING', 'REVIEW', 'GO_LIVE']}
      />
    </div>
  );
}
