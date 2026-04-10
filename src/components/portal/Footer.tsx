import { useLanguage } from '../../i18n/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="w-full py-8 mt-12 border-t border-border-subtle bg-surface">
      <div className="text-center">
        <p className="text-sm text-muted">
          © {currentYear} <span className="text-brand font-semibold">eBen</span>. {t.portal.footer?.allRightsReserved || 'All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}
