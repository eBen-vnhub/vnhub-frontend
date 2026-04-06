import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import authService from '../../../services/auth';
import PasswordInput from '../../../components/ui/PasswordInput';
import Button from '../../../components/ui/Button';
import { showToast } from '../../../utils/toast';

function usePasswordValidation(password: string) {
  const errors: string[] = [];
  if (password.length < 8) errors.push('minLength');
  if (!/[A-Z]/.test(password)) errors.push('uppercase');
  if (!/[a-z]/.test(password)) errors.push('lowercase');
  if (!/[0-9]/.test(password)) errors.push('number');
  return { errors, isValid: errors.length === 0 };
}

export default function ResetPasswordForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { errors: passwordErrors, isValid: passwordValid } = usePasswordValidation(password);
  const passwordsMatch = password === confirmPassword;

  const requirementLabels: Record<string, string> = {
    minLength: t.auth.resetPassword.passwordMinLength,
    uppercase: t.auth.resetPassword.passwordUppercase,
    lowercase: t.auth.resetPassword.passwordLowercase,
    number: t.auth.resetPassword.passwordNumber,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid || !passwordsMatch) return;

    setIsSubmitting(true);

    try {
      await authService.resetPassword({ token, password });
      showToast.success(t.common.success);
      navigate('/login');
    } catch (err: any) {
      showToast.error(err.response?.data?.message || t.common.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-main mb-2">
          {t.auth.resetPassword.title}
        </h2>
        <p className="text-muted text-sm sm:text-base">
          {t.auth.resetPassword.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <PasswordInput
            label={t.auth.resetPassword.newPassword}
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
          />
          {password && (
            <div className="mt-2 space-y-1">
              {passwordErrors.map((key) => (
                <p key={key} className="text-xs sm:text-sm text-error flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-error rounded-full" />
                  {requirementLabels[key]}
                </p>
              ))}
              {passwordValid && (
                <p className="text-xs sm:text-sm text-success flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-success rounded-full" />
                  {t.auth.resetPassword.passwordRequirementsMet}
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <PasswordInput
            label={t.auth.resetPassword.confirmPassword}
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            required
          />
          {confirmPassword && (
            <p className={`mt-2 text-xs sm:text-sm flex items-center gap-2 ${passwordsMatch ? 'text-success' : 'text-error'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${passwordsMatch ? 'bg-success' : 'bg-error'}`} />
              {passwordsMatch ? t.auth.resetPassword.passwordsMatch : t.auth.resetPassword.passwordsDoNotMatch}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          disabled={!passwordValid || !passwordsMatch}
          className="w-full"
        >
          <span>{t.auth.resetPassword.resetPassword}</span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>

        <div className="text-center pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted hover:text-brand transition-colors font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:rotate-180" />
            {t.auth.resetPassword.backToLogin}
          </Link>
        </div>
      </form>
    </>
  );
}
