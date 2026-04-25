import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { request } from '../../../../services/api';
import ActionButton from './ActionButton';
import { useLanguage } from '../../../../i18n/LanguageContext';

interface AssignVSMFormProps {
  onAssign: (vsmId: string) => void;
  isSubmitting: boolean;
}

export default function AssignVSMForm({ onAssign, isSubmitting }: AssignVSMFormProps) {
  const { t } = useLanguage();
  const [vsmUsers, setVsmUsers] = useState<any[]>([]);
  const [selectedVsmId, setSelectedVsmId] = useState<string>('');

  useEffect(() => {
    request<any[]>('/backoffice/internal-users/?role=VSM')
      .then(data => {
        setVsmUsers(data);
        if (data.length > 0) setSelectedVsmId(data[0].id.toString());
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-hint mb-1">{t.onboarding.labels.selectVsm}</label>
        <select
          value={selectedVsmId}
          onChange={(e) => setSelectedVsmId(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
        >
          <option value="" disabled>{t.onboarding.labels.selectVsmPlaceholder}</option>
          {vsmUsers.map(v => (
            <option key={v.id} value={v.id}>{v.firstName} {v.lastName}</option>
          ))}
        </select>
      </div>
      <ActionButton
        icon={<User className="w-4 h-4" />}
        label={t.onboarding.actions.assignVsm}
        onClick={() => onAssign(selectedVsmId)}
        disabled={isSubmitting || !selectedVsmId}
      />
    </div>
  );
}
