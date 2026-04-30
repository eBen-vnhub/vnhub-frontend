import type { BenefitTracker, BenefitStatus } from '../../../../types/onboarding';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { usePreferences } from '../../../../hooks/usePreferences';
import { ChevronRight } from 'lucide-react';
import BenefitCard from './BenefitCard';

interface BenefitKanbanColumnProps {
  columnKey: string;
  statuses: BenefitStatus[];
  benefits: BenefitTracker[];
  onBenefitClick: (benefit: BenefitTracker) => void;
  boardId?: string;
}

const COLUMN_ACCENT: Record<string, string> = {
  QUEUE: 'bg-gray-400',
  IN_PROGRESS: 'bg-indigo-400',
  TEST_REVIEW: 'bg-purple-400',
  LIVE_REVIEW: 'bg-teal-400',
  DONE: 'bg-emerald-400',
};

export default function BenefitKanbanColumn({ columnKey, statuses, benefits, onBenefitClick, boardId = 'benefit_tracker' }: BenefitKanbanColumnProps) {
  const { t } = useLanguage();
  const { getPreference, updatePreference } = usePreferences();

  const prefKey = `kanban_${boardId}_${columnKey}`;
  const isExpanded = getPreference(prefKey, true);

  const columnTitle = t.benefitTracker.columns[columnKey as keyof typeof t.benefitTracker.columns] || columnKey;
  const filtered = benefits.filter(b => statuses.includes(b.status));
  const accentColor = COLUMN_ACCENT[columnKey] || 'bg-gray-400';

  if (!isExpanded) {
    return (
      <button
        onClick={() => updatePreference(prefKey, true)}
        className="flex flex-col items-center gap-2 min-w-[44px] max-w-[44px] bg-surface border border-border rounded-2xl py-4 px-1 hover:border-brand/30 transition-colors cursor-pointer group h-fit"
        title={`${columnTitle} (${filtered.length})`}
      >
        <div className={`w-2 h-2 rounded-full ${accentColor}`} />
        <span className="text-[10px] font-bold text-hint [writing-mode:vertical-lr] rotate-180 whitespace-nowrap">
          {columnTitle}
        </span>
        <span className="text-[10px] font-bold text-brand bg-brand/10 rounded-full w-5 h-5 flex items-center justify-center">
          {filtered.length}
        </span>
        <ChevronRight className="w-3 h-3 text-hint group-hover:text-brand transition-colors" />
      </button>
    );
  }

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
      <div className="flex items-center gap-3 mb-4 px-1">
        <button
          onClick={() => updatePreference(prefKey, false)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          title="Collapse column"
        >
          <div className={`w-2 h-2 rounded-full ${accentColor}`} />
          <h3 className="text-sm font-bold text-main">{columnTitle}</h3>
        </button>
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
