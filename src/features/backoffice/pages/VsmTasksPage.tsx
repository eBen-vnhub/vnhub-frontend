import { useLanguage } from '../../../i18n/LanguageContext';
import OnboardingBoard from '../components/onboarding/OnboardingBoard';

export default function VsmTasksPage() {
  const { t } = useLanguage();
  return (
    <OnboardingBoard
      title={t.onboarding.vsmTasksTitle}
      subtitle={t.onboarding.vsmTasksSubtitle}
      columns={['DATA_COLLECTION', 'REVIEW', 'OPS_QUEUE', 'TECHNICAL_SETUP', 'TESTING', 'GO_LIVE', 'FINAL_REVIEW', 'DONE']}
      boardId="vsm_pipeline"
    />
  );
}
