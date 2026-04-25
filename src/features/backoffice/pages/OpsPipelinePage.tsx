import { useLanguage } from '../../../i18n/LanguageContext';
import OnboardingBoard from '../components/onboarding/OnboardingBoard';

export default function OpsPipelinePage() {
  const { t } = useLanguage();
  return (
    <OnboardingBoard
      title={t.onboarding.opsPipelineTitle || 'Operations Pipeline'}
      subtitle={t.onboarding.opsPipelineSubtitle || 'Manage technical integrations and testing workflows.'}
      columns={['OPS_PIPELINE', 'TESTING']}
    />
  );
}
