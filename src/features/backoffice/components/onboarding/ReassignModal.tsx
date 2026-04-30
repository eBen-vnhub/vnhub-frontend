import { useState, useEffect } from 'react';
import { X, UserCheck } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { request } from '../../../../services/api';
import ActionButton from './ActionButton';
import toast from 'react-hot-toast';

interface ReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'VSM' | 'OPERATIONS';
  currentAssigneeName: string | null;
  onAssign: (userId: number, reason: string) => Promise<void>;
}

export default function ReassignModal({ isOpen, onClose, type, currentAssigneeName, onAssign }: ReassignModalProps) {
  const { t } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      request<any[]>(`/backoffice/internal-users/?role=${type}`)
        .then(data => {
          setUsers(data);
        })
        .catch(console.error);
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    try {
      await onAssign(parseInt(selectedId), reason);
      onClose();
    } catch {
      toast.error(t.common.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-hover">
          <h2 className="text-lg font-bold text-main">
            {type === 'VSM' ? (t.onboarding.actions as any).reassignVsm : (t.onboarding.actions as any).reassignOps}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-main mb-1">{(t.onboarding.labels as any).currentAssignee}</label>
            <p className="text-sm text-muted bg-gray-50 px-4 py-2.5 rounded-xl border border-border">
              {currentAssigneeName || t.onboarding.labels.unassigned}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-main mb-1">{(t.onboarding.labels as any).newAssignee}</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
            >
              <option value="" disabled>{type === 'VSM' ? t.onboarding.labels.selectVsmPlaceholder : t.onboarding.labels.selectOpsPlaceholder}</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-main mb-1">{(t.onboarding.labels as any).reassignReason}</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={(t.onboarding.labels as any).reassignReasonPlaceholder}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none resize-none"
              rows={3}
            />
          </div>

          <div className="pt-2">
            <ActionButton
              icon={<UserCheck className="w-4 h-4" />}
              label={(t.onboarding.actions as any).confirmReassign}
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedId}
              variant="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
