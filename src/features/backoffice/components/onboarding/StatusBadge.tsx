import type { TicketStatus } from '../../../../types/onboarding';

const STATUS_COLORS: Record<TicketStatus, { bg: string; text: string; dot: string }> = {
  UNASSIGNED: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  ASSIGNED_TO_VSM: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  AWAITING_VENDOR_LISTING: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  VSM_REVIEW: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
  READY_FOR_OPS: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  OPS_IN_PROGRESS: { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-400' },
  VSM_FINAL_REVIEW: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
};

interface StatusBadgeProps {
  status: TicketStatus;
  label: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.UNASSIGNED;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
}
