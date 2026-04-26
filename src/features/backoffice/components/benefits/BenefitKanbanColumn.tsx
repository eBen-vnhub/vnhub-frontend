import type { BenefitTracker, BenefitStatus } from '../../../../types/onboarding';
import { useLanguage } from '../../../../i18n/LanguageContext';
import BenefitCard from './BenefitCard';

interface BenefitKanbanColumnProps {
  columnKey: string;
  statuses: BenefitStatus[];
  benefits: BenefitTracker[];
  onBenefitClick: (benefit: BenefitTracker) => void;
}

const COLUMN_ACCENT: Record<string, string> = {
  QUEUE: 'bg-gray-400',
  BUILDING: 'bg-indigo-400',
  REVIEW: 'bg-purple-400',
  GO_LIVE: 'bg-emerald-400',
};

export default function BenefitKanbanColumn({ columnKey, statuses, benefits, onBenefitClick }: BenefitKanbanColumnProps) {
  const { t } = useLanguage();

  const columnTitle = t.benefitTracker.columns[columnKey as keyof typeof t.benefitTracker.columns] || columnKey;
  const filtered = benefits.filter(b => statuses.includes(b.status));

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className={`w-2 h-2 rounded-full ${COLUMN_ACCENT[columnKey] || 'bg-gray-400'}`} />
        <h3 className="text-sm font-bold text-main">{columnTitle}</h3>
        <span className="ml-auto text-xs font-semibold text-hint bg-gray-100 rounded-full px-2 py-0.5">
          {filtered.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-260px)] px-1 pb-4">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-hint border-2 border-dashed border-gray-200 rounded-xl">
            {t.onboarding.labels.noTickets}
          </div>
        ) : (
          filtered.map(benefit => (
            <BenefitCard key={benefit.id} benefit={benefit} onClick={onBenefitClick} />
          ))
        )}
      </div>
    </div>
  );
}
