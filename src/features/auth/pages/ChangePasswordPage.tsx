import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { LockKeyhole } from 'lucide-react';
import ChangePasswordForm from '../components/ChangePasswordForm';

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const displayName = user?.firstName ? user.firstName : (user?.companyName || user?.email?.split('@')[0] || 'User');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto space-y-6">
      <div className="bg-surface border border-border shadow-sm rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-main flex items-center gap-2">
              <LockKeyhole className="w-5 h-5 text-brand" />
              {t.auth.changePassword.title}
            </h2>
            <p className="text-sm text-muted mt-1">
              {t.auth.changePassword.subtitle} <span className="font-semibold text-brand">{displayName}</span>
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
