import type { ReactNode } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import ebenLogo from '../assets/images/eBen-logo.png';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { direction } = useLanguage();

  return (
    <div dir={direction} className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6">
      <div className="absolute top-4 end-4 sm:top-6 sm:end-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 mb-6">
            <img src={ebenLogo} alt="eBen" className="w-full h-full object-contain" />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
