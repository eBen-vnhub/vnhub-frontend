import { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import Button from '../ui/Button';
import type { Subscription } from '../../types';

interface EditSubscriptionModalProps {
  isOpen: boolean;
  subscription: Subscription | null;
  onClose: () => void;
  onSave: (subscriptionId: number, data: { plan?: string; billingCycle?: string; locations?: string[] }) => Promise<void>;
  isSaving: boolean;
}

const PLANS = [
  { value: 'PLUS', label: 'Plus' },
  { value: 'MULTI', label: 'Multi' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
  { value: 'CATEGORY', label: 'Category' },
];

const BILLING_CYCLES = [
  { value: 'ANNUAL', labelKey: 'annual' },
  { value: 'MONTHLY', labelKey: 'monthly' },
];

const AVAILABLE_LOCATIONS = [
  { value: 'UAE', label: 'UAE' },
  { value: 'KSA', label: 'KSA' },
  { value: 'EGYPT', label: 'Egypt' },
  { value: 'GLOBAL', label: 'Global' },
];

export default function EditSubscriptionModal({ isOpen, subscription, onClose, onSave, isSaving }: EditSubscriptionModalProps) {
  const { t } = useLanguage();
  const [plan, setPlan] = useState('');
  const [billingCycle, setBillingCycle] = useState('');
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    if (subscription) {
      setPlan(subscription.plan);
      setBillingCycle(subscription.billingCycle);
      setLocations(subscription.locations || []);
    }
  }, [subscription]);

  if (!isOpen || !subscription) return null;

  const toggleLocation = (loc: string) => {
    setLocations(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]);
  };

  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sorted1 = [...a].sort();
    const sorted2 = [...b].sort();
    return sorted1.every((v, i) => v === sorted2[i]);
  };

  const hasChanges = plan !== subscription.plan 
    || billingCycle !== subscription.billingCycle 
    || !arraysEqual(locations, subscription.locations || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: { plan?: string; billingCycle?: string; locations?: string[] } = {};
    if (plan !== subscription.plan) data.plan = plan;
    if (billingCycle !== subscription.billingCycle) data.billingCycle = billingCycle;
    if (!arraysEqual(locations, subscription.locations || [])) data.locations = locations;
    await onSave(subscription.id, data);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative bg-surface rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-hover/50">
          <h2 className="text-lg font-bold text-main">{t.portal.subscriptionCard.editSubscription}</h2>
          <button
            onClick={onClose}
            className="p-2 -me-2 text-muted hover:text-main hover:bg-surface-hover rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-main">{t.portal.subscriptionCard.plan}</label>
            <select
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-main cursor-pointer appearance-none"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              {PLANS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-main">{t.portal.subscriptionCard.billingCycle}</label>
            <div className="grid grid-cols-2 gap-3">
              {BILLING_CYCLES.map(bc => (
                <button
                  key={bc.value}
                  type="button"
                  onClick={() => setBillingCycle(bc.value)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                    billingCycle === bc.value
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-input bg-surface text-main hover:border-brand/50'
                  }`}
                >
                  {t.portal.subscriptionCard[bc.labelKey as keyof typeof t.portal.subscriptionCard] as string}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-main flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand" />
              {t.portal.subscriptionCard.locations}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_LOCATIONS.map(loc => (
                <button
                  key={loc.value}
                  type="button"
                  onClick={() => toggleLocation(loc.value)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                    locations.includes(loc.value)
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-input bg-surface text-main hover:border-brand/50'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={!hasChanges}
              className="flex-1"
            >
              {t.portal.subscriptionCard.saveChanges}
            </Button>
            <Button variant="outline" onClick={onClose} type="button" className="flex-1">
              {t.portal.subscriptionCard.cancelEdit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
