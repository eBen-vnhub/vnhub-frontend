import { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import { request } from '../../../../services/api';
import ActionButton from './ActionButton';
import { useLanguage } from '../../../../i18n/LanguageContext';

interface AssignOpsFormProps {
  onAssign: (opsId: string) => void;
  isSubmitting: boolean;
}

export default function AssignOpsForm({ onAssign, isSubmitting }: AssignOpsFormProps) {
  const { t } = useLanguage();
  const [opsUsers, setOpsUsers] = useState<any[]>([]);
  const [selectedOpsId, setSelectedOpsId] = useState<string>('');

  useEffect(() => {
    request<any[]>('/backoffice/internal-users/?role=OPERATIONS')
      .then(data => {
        setOpsUsers(data);
        if (data.length > 0) setSelectedOpsId(data[0].id.toString());
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-hint mb-1">{t.onboarding.labels.selectOps}</label>
        <select
          value={selectedOpsId}
          onChange={(e) => setSelectedOpsId(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
        >
          <option value="" disabled>{t.onboarding.labels.selectOpsPlaceholder}</option>
          {opsUsers.map(v => (
            <option key={v.id} value={v.id}>{v.firstName} {v.lastName}</option>
          ))}
        </select>
      </div>
      <ActionButton
        icon={<UserCheck className="w-4 h-4" />}
        label={t.onboarding.actions.assignOps}
        onClick={() => onAssign(selectedOpsId)}
        disabled={isSubmitting || !selectedOpsId}
      />
    </div>
  );
}
