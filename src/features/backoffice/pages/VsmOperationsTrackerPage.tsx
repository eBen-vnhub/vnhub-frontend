import { useLanguage } from '../../../i18n/LanguageContext';
import OnboardingBoard from '../components/onboarding/OnboardingBoard';

export default function VsmOperationsTrackerPage() {
  const { t } = useLanguage();
  return (
    <OnboardingBoard
      title={t.onboarding.trackerTitle || 'Operations Tracker'}
      subtitle={t.onboarding.trackerSubtitle || 'Monitor technical progress of your vendors.'}
      columns={['OPS_PIPELINE', 'TESTING']}
    />
  );
}
