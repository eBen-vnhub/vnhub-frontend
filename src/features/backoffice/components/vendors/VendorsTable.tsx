import { Link } from 'react-router-dom';
import { Building2, MapPin, Tag, ArrowRight, Crown, Users, Globe, Calendar } from 'lucide-react';
import type { BackofficeVendorSummary } from '../../../../services/backoffice';
import { useLanguage } from '../../../../i18n/LanguageContext';

interface Props {
  vendors: BackofficeVendorSummary[];
  isLoading: boolean;
}

const PLAN_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  PLUS: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  MULTI: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  ENTERPRISE: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  CATEGORY: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  PENDING: 'bg-amber-500/10 text-amber-600 border-amber-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border-gray-200',
};

function VendorAvatar({ name }: { name: string }) {
  const initials = (name || 'VN').substring(0, 2).toUpperCase();
  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand/70 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm">
      {initials}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const style = PLAN_STYLES[plan] || PLAN_STYLES.PLUS;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${style.bg} ${style.text} ${style.border}`}>
      <Crown className="w-3 h-3" />
      {plan}
    </span>
  );
}

function StatusDot({ status }: { status: string | null }) {
  if (!status) return null;
  const style = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${style}`}>
      {status}
    </span>
  );
}

function VendorCardSkeleton() {
  return (
    <div className="animate-pulse bg-surface rounded-2xl border border-border p-5">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-surface-hover" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-surface-hover rounded-lg w-2/5" />
          <div className="h-4 bg-surface-hover rounded-lg w-3/5" />
        </div>
      </div>
    </div>
  );
}

export default function VendorsTable({ vendors, isLoading }: Props) {
  const { t } = useLanguage();
  const vendorLabels = (t.backoffice as any)?.vendors || {};
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <VendorCardSkeleton key={i} />)}
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="bg-surface rounded-2xl p-16 text-center border border-dashed border-border">
        <Building2 className="w-12 h-12 text-muted mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-bold text-main mb-2">{vendorLabels.noVendorsAvailable || 'No vendors found'}</h3>
        <p className="text-sm text-muted">{vendorLabels.noVendorsStored || 'Try adjusting your filters.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vendors.map((vendor) => {
        const plans = vendor.subscriptions
          ? [...new Set(vendor.subscriptions.map(s => s.plan))]
          : [];

        return (
          <Link
            key={vendor.id}
            to={`/backoffice/vendors/${vendor.id}`}
            className="group block bg-surface hover:bg-surface-hover/50 border border-border hover:border-brand/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center gap-5">
              <VendorAvatar name={vendor.companyName} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <h3 className="font-bold text-main text-lg truncate max-w-[300px]">
                    {vendor.companyName || vendorLabels.unnamedVendor || 'Unnamed Vendor'}
                  </h3>
                  <StatusDot status={vendor.latestStatus} />
                  {plans.map(p => <PlanBadge key={p} plan={p} />)}
                </div>

                <div className="flex items-center flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                  {vendor.companyCountry && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand/60" />
                      <span>{vendor.companyCountry}</span>
                    </div>
                  )}

                  {vendor.businessCategory && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-brand/60" />
                      <span>{vendor.businessCategory}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-brand/60" />
                    <span>{vendor.subscriptionCount} {vendorLabels.subscription || 'Subscription'}{vendor.subscriptionCount !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-brand/60" />
                    <span>{vendor.teamCount} {vendorLabels.member || 'Member'}{vendor.teamCount !== 1 ? 's' : ''}</span>
                  </div>

                  {vendor.createdAt && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand/60" />
                      <span>{new Date(vendor.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/20">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
