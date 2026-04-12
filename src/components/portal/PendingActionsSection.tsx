import { AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { Subscription } from '../../types';

interface PendingAction {
  type: 'VENDOR_LISTING' | 'BENEFIT_LISTING';
  label: string;
  description: string;
}

interface PendingActionsSectionProps {
  subscriptions: Subscription[];
  onAction: (actionType: string) => void;
}

function usePendingActions(subscriptions: Subscription[]): PendingAction[] {
  const { t } = useLanguage();

  const hasVendorListingPending = subscriptions.some(
    (s) => s.nextStep === 'VENDOR_LISTING' && s.status !== 'CANCELLED'
  );

  const hasBenefitListingPending = subscriptions.some(
    (s) => s.nextStep === 'BENEFIT_LISTING' && s.status !== 'CANCELLED'
  );

  const actions: PendingAction[] = [];

  if (hasVendorListingPending) {
    actions.push({
      type: 'VENDOR_LISTING',
      label: t.portal.pendingActions?.vendorListing || 'Complete Vendor Listing',
      description: t.portal.pendingActions?.vendorListingDesc || 'Provide your company details to activate your workspace.',
    });
  }

  if (hasBenefitListingPending) {
    actions.push({
      type: 'BENEFIT_LISTING',
      label: t.portal.pendingActions?.benefitListing || 'Complete Benefit Listing',
      description: t.portal.pendingActions?.benefitListingDesc || 'Set up your offers and discounts for the benefits center.',
    });
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
          <h3 className="text-lg font-bold text-main">
            {t.portal.pendingActions?.title || 'Pending Actions'}
          </h3>
          <p className="text-sm text-muted">
            {t.portal.pendingActions?.subtitle || 'Complete these steps to activate your workspace.'}
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
              onClick={() => onAction(action.type)}
              className="whitespace-nowrap flex items-center gap-2"
            >
              {t.portal.pendingActions?.startAction || 'Start'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
