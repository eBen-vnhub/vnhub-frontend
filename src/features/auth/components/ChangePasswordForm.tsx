import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../i18n/LanguageContext';
import PasswordInput from '../../../components/ui/PasswordInput';
import Button from '../../../components/ui/Button';
import authService from '../../../services/auth';

export default function ChangePasswordForm() {
  const { t } = useLanguage();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError(t.auth.changePassword.allFieldsRequired);
      return;
    }
    if (newPassword.length < 8) {
      setError(t.auth.changePassword.passwordMinLength);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t.auth.changePassword.passwordsDoNotMatch);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.changePassword({ old_password: oldPassword, new_password: newPassword });
      toast.success(t.auth.changePassword.success);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.message || t.auth.changePassword.failed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      <PasswordInput
        label={t.auth.changePassword.currentPassword}
        value={oldPassword}
        onChange={(val) => setOldPassword(val)}
        placeholder={t.auth.changePassword.currentPasswordPlaceholder}
        disabled={isLoading}
      />

      <PasswordInput
        label={t.auth.changePassword.newPassword}
        value={newPassword}
        onChange={(val) => setNewPassword(val)}
        placeholder={t.auth.changePassword.newPasswordPlaceholder}
        disabled={isLoading}
      />

      <PasswordInput
        label={t.auth.changePassword.confirmPassword}
        value={confirmPassword}
        onChange={(val) => setConfirmPassword(val)}
        placeholder={t.auth.changePassword.confirmPasswordPlaceholder}
        disabled={isLoading}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        {t.auth.changePassword.updatePassword}
      </Button>
    </form>
  );
}
