import type { Subscription } from '../../types';
import Button from '../ui/Button';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  companyName: string;
  onNextAction: () => void;
}

export default function SubscriptionCard({ subscription, companyName, onNextAction }: SubscriptionCardProps) {
  const isActive = subscription.status?.toLowerCase() === 'active';
  
  return (
    <div className="bg-surface border border-border shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-main mb-1">{companyName}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-brand px-2.5 py-0.5 rounded-full bg-brand/10">
              {subscription.plan} Plan
            </span>
            <span className="text-sm text-muted">
              • {subscription.billingCycle}
            </span>
          </div>
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${isActive ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
          {isActive ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          <span>{subscription.status || 'Pending'}</span>
        </div>
      </div>

      <div className="border-t border-border-subtle pt-6">
        <h4 className="text-sm font-bold text-main mb-4">Required Action</h4>
        
        <div className="bg-surface-hover rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-main">Complete Vendor Listing</p>
            <p className="text-sm text-muted mt-0.5">Please provide your vendor details to proceed.</p>
          </div>
          
          <Button onClick={onNextAction} className="whitespace-nowrap">
            Open Form <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
