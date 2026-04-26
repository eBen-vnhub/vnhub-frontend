import { ArrowRight, LayoutList } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Subscription } from '../../types';

interface PendingAction {
  type: 'VENDOR_LISTING' | 'BENEFIT_LISTING';
  label: string;
  description: string;
  subscriptionId?: number;
}

interface PendingActionsSectionProps {
  subscriptions: Subscription[];
  onAction: (actionType: string, subscriptionId?: number) => void;
  hasVendorListing?: boolean;
}

function usePendingActions(subscriptions: Subscription[], hasVendorListing?: boolean): PendingAction[] {
  const { t } = useLanguage();

  const vendorPendingSub = subscriptions.find(
    (s) => s.nextStep === 'VENDOR_LISTING' && s.status !== 'CANCELLED'
  );

  const actions: PendingAction[] = [];

  if (vendorPendingSub && !hasVendorListing) {
    actions.push({
      type: 'VENDOR_LISTING',
      label: (t.portal as any).pendingActions?.vendorListing || 'Complete Vendor Listing',
      description: (t.portal as any).pendingActions?.vendorListingDesc || 'Provide your brand details to activate your storefront.',
      subscriptionId: vendorPendingSub.id
    });
  }

  return actions;
}

export default function PendingActionsSection({ subscriptions, onAction, hasVendorListing }: PendingActionsSectionProps) {
  const { t } = useLanguage();
  const actions = usePendingActions(subscriptions, hasVendorListing);

  if (actions.length === 0) return null;

  return (
    <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-start sm:items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center flex-shrink-0">
          <LayoutList className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-main">
            {(t.portal as any).pendingActions?.setupTitle || 'Account Setup'}
          </h3>
          <p className="text-sm text-muted mt-1">
            {(t.portal as any).pendingActions?.setupSubtitle || 'Complete these steps to fully activate your workspace and start receiving benefits.'}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {actions.map((action, index) => (
          <div
            key={action.type}
            className="group bg-surface hover:bg-surface-hover transition-colors rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-border hover:border-brand/30"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-surface-hover group-hover:bg-brand/10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                <span className="text-sm font-bold text-muted-foreground group-hover:text-brand">{index + 1}</span>
              </div>
              <div>
                <p className="font-bold text-main text-base">{action.label}</p>
                <p className="text-sm text-muted mt-1 leading-relaxed">{action.description}</p>
              </div>
            </div>
            <Button
              onClick={() => onAction(action.type, action.subscriptionId)}
              className="sm:w-auto w-full flex items-center justify-center gap-2"
            >
              {(t.portal as any).pendingActions?.startButton || 'Start Setup'}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
