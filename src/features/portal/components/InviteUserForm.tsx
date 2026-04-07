import { useState } from 'react';
import { UserPlus, Mail, Info } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

interface InviteUserFormProps {
  onInvite: (email: string) => Promise<void>;
  isInviting: boolean;
}

export default function InviteUserForm({ onInvite, isInviting }: InviteUserFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await onInvite(email);
    setEmail('');
  };

  return (
    <div className="bg-surface border border-border shadow-sm rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 pointer-events-none" />

      <h2 className="text-lg font-bold text-main flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-brand" />
        {t.portal.vendorAdmin.inviteUser}
      </h2>

      <div className="flex items-start gap-2 bg-brand/5 border border-brand/10 rounded-xl p-3 mb-5">
        <Info className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted leading-relaxed">{t.portal.vendorAdmin.inviteNote}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t.portal.vendorAdmin.emailAddress}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          placeholder={t.portal.vendorAdmin.emailPlaceholder}
        />

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isInviting}
          disabled={!email}
        >
          {t.portal.vendorAdmin.sendInvitation}
        </Button>
      </form>
    </div>
  );
}
