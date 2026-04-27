import { useLanguage } from '../../../i18n/LanguageContext';
import OnboardingBoard from '../components/onboarding/OnboardingBoard';

export default function OpsVendorSetupPage() {
  const { t } = useLanguage();
  return (
    <OnboardingBoard
      title={t.onboarding.opsSetupTitle}
      subtitle={t.onboarding.opsSetupSubtitle}
      columns={['READY_FOR_OPS', 'OPS_IN_PROGRESS', 'VSM_FINAL_REVIEW', 'COMPLETED']}
    />
  );
}
