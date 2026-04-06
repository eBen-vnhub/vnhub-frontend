import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { validateEmail } from '../../../utils/validators';
import authService from '../../../services/auth';
import Input from '../../../components/ui/Input';
import PasswordInput from '../../../components/ui/PasswordInput';
import Button from '../../../components/ui/Button';
import { showToast } from '../../../utils/toast';

export default function LoginForm() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = t.auth.login.emailRequired;
    else if (!validateEmail(email)) newErrors.email = t.auth.login.emailInvalid;
    if (!password) newErrors.password = t.auth.login.passwordRequired;
    else if (password.length < 6) newErrors.password = t.auth.login.passwordMinLength;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await authService.login({ email, password });
      login(response.user);
      showToast.success(t.common.success);
      navigate('/');
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
          {t.auth.login.title}
        </h2>
        <p className="text-muted text-sm sm:text-base">
          {t.auth.login.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <Input
          label={t.auth.login.email}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.auth.login.emailPlaceholder}
          autoComplete="email"
          error={errors.email}
          isFocused={focusedField === 'email'}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
        />

        <PasswordInput
          label={t.auth.login.password}
          value={password}
          onChange={setPassword}
          placeholder={t.auth.login.passwordPlaceholder}
          autoComplete="current-password"
          required
          error={errors.password}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs sm:text-sm text-brand hover:text-brand-hover font-medium transition-colors"
          >
            {t.auth.login.forgotPassword}
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          className="w-full"
        >
          <span>{t.auth.login.signIn}</span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </form>
    </>
  );
}
