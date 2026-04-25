import { useLanguage } from '../../../i18n/LanguageContext';
import OnboardingBoard from '../components/onboarding/OnboardingBoard';

export default function VsmTasksPage() {
  const { t } = useLanguage();
  return (
    <OnboardingBoard
      title={t.onboarding.vsmTasksTitle || 'My Onboarding Tasks'}
      subtitle={t.onboarding.vsmTasksSubtitle || 'Manage your active vendor onboarding processes.'}
      columns={['INTAKE', 'VENDOR_INPUT', 'FINAL']}
    />
  );
}
