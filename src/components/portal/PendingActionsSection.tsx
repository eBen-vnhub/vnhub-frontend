import { AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Subscription } from '../../types';

interface PendingAction {
  type: 'VENDOR_LISTING' | 'BENEFIT_LISTING' | 'MARK_COMPLETE';
  label: string;
  description: string;
  benefitsSubmitted?: number;
  maxBenefits?: number;
  subscriptionId?: number;
}

interface PendingActionsSectionProps {
  subscriptions: Subscription[];
  onAction: (actionType: string, subscriptionId?: number) => void;
}

function usePendingActions(subscriptions: Subscription[]): PendingAction[] {
  const { t } = useLanguage();

  const vendorPendingSub = subscriptions.find(
    (s) => s.nextStep === 'VENDOR_LISTING' && s.status !== 'CANCELLED'
  );

  const benefitPendingSub = subscriptions.find(
    (s) => s.nextStep === 'BENEFIT_LISTING' && s.status !== 'CANCELLED'
  );

  const actions: PendingAction[] = [];

  if (vendorPendingSub) {
    actions.push({
      type: 'VENDOR_LISTING',
      label: (t.portal as any).pendingActions?.vendorListing || 'Complete Vendor Listing',
      description: (t.portal as any).pendingActions?.vendorListingDesc || 'Provide your company details to activate your workspace.',
      subscriptionId: vendorPendingSub.id
    });
  }

  if (benefitPendingSub) {
    const submitted = benefitPendingSub.benefitsSubmitted || 0;
    const max = benefitPendingSub.maxBenefits || 1;
    actions.push({
      type: 'BENEFIT_LISTING',
      label: `Benefits (${submitted}/${max}) — Add Benefit`,
      description: (t.portal as any).pendingActions?.benefitListingDesc || 'Set up your offers and discounts for the benefits center.',
      subscriptionId: benefitPendingSub.id
    });

    if (submitted > 0 && submitted < max) {
      actions.push({
        type: 'MARK_COMPLETE',
        label: 'Finish Setup Early',
        description: 'You have remaining benefits, but you can finish your setup now and add more later.',
        subscriptionId: benefitPendingSub.id
      });
    }
  }

  return actions;
}

export default function PendingActionsSection({ subscriptions, onAction }: PendingActionsSectionProps) {
  const { t } = useLanguage();
  const actions = usePendingActions(subscriptions);

  if (actions.length === 0) return null;

  return (
    <section className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-portal-accent relative z-10">
            {(t.portal as any).pendingActions?.title || 'Action Required'}
          </h3>
          <p className="text-sm text-portal-accent/80 font-medium relative z-10">
            {(t.portal as any).pendingActions?.subtitle || 'Please complete the following steps to activate your workspace:'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.type}
            className="bg-surface rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold text-main">{action.label}</p>
                <p className="text-sm text-muted mt-0.5">{action.description}</p>
              </div>
            </div>
            <Button
              onClick={() => onAction(action.type, action.subscriptionId)}
              className={`${action.type === 'MARK_COMPLETE' ? 'bg-surface-hover text-main hover:bg-surface-hover/80 border border-border' : 'bg-portal-accent text-white hover:bg-portal-accent/90'} whitespace-nowrap flex items-center gap-2`}
            >
              {action.type === 'MARK_COMPLETE' ? 'Complete Setup' : ((t.portal as any).pendingActions?.startButton || 'Start')}
              {action.type !== 'MARK_COMPLETE' && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
