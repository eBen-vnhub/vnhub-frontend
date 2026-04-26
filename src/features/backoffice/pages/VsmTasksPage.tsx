import { useLanguage } from '../../../i18n/LanguageContext';
import OnboardingBoard from '../components/onboarding/OnboardingBoard';

export default function VsmTasksPage() {
  const { t } = useLanguage();
  return (
    <OnboardingBoard
      title={t.onboarding.vsmTasksTitle}
      subtitle={t.onboarding.vsmTasksSubtitle}
      columns={['QUEUE', 'DATA_COLLECTION', 'TECHNICAL_SETUP', 'FINAL_REVIEW', 'DONE']}
    />
  );
}
