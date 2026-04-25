import { useLanguage } from '../../../i18n/LanguageContext';
import OnboardingBoard from '../components/onboarding/OnboardingBoard';

export default function AdminOnboardingPage() {
  const { t } = useLanguage();
  return (
    <OnboardingBoard
      title={t.onboarding.pageTitle}
      subtitle={t.onboarding.pageSubtitle}
      columns={['INTAKE', 'VENDOR_INPUT', 'OPS_PIPELINE', 'TESTING', 'FINAL']}
    />
  );
}
