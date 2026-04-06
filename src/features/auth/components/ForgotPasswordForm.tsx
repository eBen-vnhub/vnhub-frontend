import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { validateEmail } from '../../../utils/validators';
import authService from '../../../services/auth';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { showToast } from '../../../utils/toast';

export default function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [focusedField, setFocusedField] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError(t.auth.forgotPassword.emailRequired);
      return;
    }
    if (!validateEmail(email)) {
      setError(t.auth.forgotPassword.emailInvalid);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await authService.forgotPassword(email);
      setEmailSent(true);
      showToast.success(t.common.success);
    } catch (err: any) {
      showToast.error(err.response?.data?.message || t.common.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-5 sm:space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-main">
            {t.auth.forgotPassword.successTitle}
          </h2>
          <p className="text-muted text-sm sm:text-base px-4">
            {t.auth.forgotPassword.successMessage}
          </p>
        </div>

        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-success to-brand rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl shadow-brand/30">
          <CheckCircle className="w-11 h-11 sm:w-14 sm:h-14 text-white" />
        </div>

        <div className="bg-brand-light border border-brand/20 rounded-xl p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-brand-active leading-relaxed">
            {t.auth.forgotPassword.successHint}
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-brand hover:text-brand-hover transition-colors font-semibold text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
            {t.auth.forgotPassword.backToLogin}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-main mb-2">
          {t.auth.forgotPassword.title}
        </h2>
        <p className="text-muted text-sm sm:text-base">
          {t.auth.forgotPassword.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <Input
          label={t.auth.forgotPassword.email}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.auth.forgotPassword.emailPlaceholder}
          autoComplete="email"
          error={error}
          isFocused={focusedField}
          onFocus={() => setFocusedField(true)}
          onBlur={() => setFocusedField(false)}
          icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
        />

        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          className="w-full"
        >
          <span>{t.auth.forgotPassword.sendResetLink}</span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>

        <div className="text-center pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted hover:text-brand transition-colors font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:rotate-180" />
            {t.auth.forgotPassword.backToLogin}
          </Link>
        </div>
      </form>
    </>
  );
}
