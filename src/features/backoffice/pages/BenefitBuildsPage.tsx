import { useLanguage } from '../../../i18n/LanguageContext';
import BenefitBoard from '../components/benefits/BenefitBoard';

export default function BenefitBuildsPage() {
  const { t } = useLanguage();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BenefitBoard
        title={t.backoffice.sidebar.benefitBuilds}
        subtitle={t.onboarding.opsSetupSubtitle}
        columns={['QUEUE', 'BUILDING', 'REVIEW', 'GO_LIVE']}
      />
    </div>
  );
}
