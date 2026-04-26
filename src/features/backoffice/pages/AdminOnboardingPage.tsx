import { useLanguage } from '../../../i18n/LanguageContext';
import OnboardingBoard from '../components/onboarding/OnboardingBoard';

export default function AdminOnboardingPage() {
  const { t } = useLanguage();
  return (
    <OnboardingBoard
      title={t.onboarding.pageTitle}
      subtitle={t.onboarding.pageSubtitle}
      columns={['QUEUE', 'DATA_COLLECTION', 'REVIEW', 'TECHNICAL_SETUP', 'FINAL_REVIEW', 'DONE']}
    />
  );
}
