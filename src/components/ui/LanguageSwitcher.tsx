import { useLanguage } from '../../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted hover:text-main bg-white border border-border-subtle rounded-lg hover:bg-gray-50 transition-all duration-200"
    >
      {language === 'en' ? 'عربي' : 'English'}
    </button>
  );
}
