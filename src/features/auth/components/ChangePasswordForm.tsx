import { useState } from 'react';
import toast from 'react-hot-toast';
import PasswordInput from '../../../components/ui/PasswordInput';
import Button from '../../../components/ui/Button';
import authService from '../../../services/auth';

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.changePassword({ old_password: oldPassword, new_password: newPassword });
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to change password. Please verify your old password.');
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
        label="Current Password"
        value={oldPassword}
        onChange={(val) => setOldPassword(val)}
        placeholder="Enter your current password"
        disabled={isLoading}
      />

      <PasswordInput
        label="New Password"
        value={newPassword}
        onChange={(val) => setNewPassword(val)}
        placeholder="Enter your new password"
        disabled={isLoading}
      />

      <PasswordInput
        label="Confirm New Password"
        value={confirmPassword}
        onChange={(val) => setConfirmPassword(val)}
        placeholder="Confirm your new password"
        disabled={isLoading}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Update Password
      </Button>
    </form>
  );
}
