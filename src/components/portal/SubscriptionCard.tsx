import { useState } from 'react';
import type { Subscription } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import Button from '../ui/Button';
import { CheckCircle2, MapPin, Calendar, Edit3, Trash2 } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  companyName: string;
  onEdit: (subscription: Subscription) => void;
  onCancel: (subscriptionId: number) => void;
  onAddBenefit: (subscriptionId: number) => void;
  isCancelling: boolean;
}

export default function SubscriptionCard({ subscription, companyName, onEdit, onCancel, onAddBenefit, isCancelling }: SubscriptionCardProps) {
  const { t } = useLanguage();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const statusKey = subscription.status?.toLowerCase() || 'pending';
  const isCancelled = statusKey === 'cancelled';
  const formattedDate = subscription.createdAt
    ? new Date(subscription.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <div className={`bg-surface border shadow-sm rounded-2xl p-6 transition-all hover:shadow-md ${isCancelled ? 'border-error/20 opacity-75' : 'border-border'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-main mb-1">{companyName}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-brand px-2.5 py-0.5 rounded-full bg-brand/10">
              {subscription.plan} {t.portal.subscriptionCard.plan}
            </span>
            <span className="text-sm text-muted">• {subscription.billingCycle}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {subscription.locations && subscription.locations.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <MapPin className="w-4 h-4 text-brand flex-shrink-0" />
            <span>{subscription.locations.join(', ')}</span>
          </div>
        )}
        {formattedDate && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Calendar className="w-4 h-4 text-brand flex-shrink-0" />
            <span>{t.portal.subscriptionCard.subscribedOn} {formattedDate}</span>
          </div>
        )}
      </div>

      {!isCancelled && (
        <div className="flex items-center gap-2 border-t border-border-subtle pt-4">
          <Button
            variant="outline"
            onClick={() => onEdit(subscription)}
            className="flex items-center gap-2 text-sm"
          >
            <Edit3 className="w-4 h-4" />
            {t.portal.subscriptionCard.edit}
          </Button>

          {subscription.benefitsSubmitted !== undefined && subscription.maxBenefits !== undefined && subscription.benefitsSubmitted < subscription.maxBenefits && (
            <Button
              onClick={() => onAddBenefit(subscription.id)}
              className="bg-portal-accent text-white hover:bg-portal-accent/90 text-sm flex items-center gap-2 py-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Add Benefit
              <span className="text-xs bg-white/20 px-1.5 rounded ml-1">
                {subscription.maxBenefits - subscription.benefitsSubmitted} left
              </span>
            </Button>
          )}

          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-error hover:bg-error/5 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t.portal.subscriptionCard.cancel}
            </button>
          ) : (
            <div className="flex items-center gap-2 animate-in fade-in duration-200">
              <span className="text-sm text-error font-semibold">{t.portal.subscriptionCard.confirmCancel}</span>
              <Button
                variant="outline"
                onClick={() => { onCancel(subscription.id); setShowCancelConfirm(false); }}
                isLoading={isCancelling}
                className="!text-error !border-error/30 hover:!bg-error/5 text-sm"
              >
                {t.portal.subscriptionCard.yes}
              </Button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-3 py-2 text-sm font-semibold text-muted hover:text-main transition-colors"
              >
                {t.portal.subscriptionCard.no}
              </button>
            </div>
          )}
        </div>
      )}


    </div>
  );
}
