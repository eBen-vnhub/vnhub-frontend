import type { BenefitTracker } from '../../../../types/onboarding';
import { useLanguage } from '../../../../i18n/LanguageContext';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  ASSIGNED_TO_OPS: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  BUILDING: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  IN_TESTING: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
  REVISION: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
  PENDING_LIVE: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  LIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

interface BenefitCardProps {
  benefit: BenefitTracker;
  onClick: (benefit: BenefitTracker) => void;
}

export default function BenefitCard({ benefit, onClick }: BenefitCardProps) {
  const { t } = useLanguage();
  const colors = STATUS_COLORS[benefit.status] || STATUS_COLORS.PENDING;

  return (
    <button
      onClick={() => onClick(benefit)}
      className="w-full text-left bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-brand/30 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-main group-hover:text-brand transition-colors truncate">
          {benefit.vendor_name}
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors.bg} ${colors.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {t.benefitTracker.status[benefit.status as keyof typeof t.benefitTracker.status]}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="font-medium">{t.benefitTracker.benefitLabel} #{benefit.benefit_number}</span>
        <span>•</span>
        <span>{benefit.subscription_plan}</span>
      </div>
      {benefit.assigned_ops_name && (
        <div className="mt-2 text-[11px] text-hint font-medium">
          Ops: {benefit.assigned_ops_name}
        </div>
      )}
    </button>
  );
}
