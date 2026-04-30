import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { en } from './en';
import { ar } from './ar';
import type { Language, Direction } from '../types';

type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  direction: Direction;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

import { usePreferences } from '../hooks/usePreferences';

const translations: Record<Language, Translations> = { en, ar };

const LanguageContext = createContext<LanguageContextType | null>(null);

function getInitialLanguage(): Language {
  const stored = localStorage.getItem('vnhub-lang');
  if (stored === 'ar' || stored === 'en') return stored;
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const { preferences, updatePreference, isLoading } = usePreferences();

  useEffect(() => {
    if (!isLoading && preferences?.language && preferences.language !== language) {
      if (preferences.language === 'ar' || preferences.language === 'en') {
        setLanguageState(preferences.language as Language);
        localStorage.setItem('vnhub-lang', preferences.language);
        document.documentElement.dir = preferences.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = preferences.language;
      }
    }
  }, [preferences?.language, isLoading]);

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vnhub-lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try {
      updatePreference('language', lang);
    } catch {}
  }, [updatePreference]);

  return (
    <LanguageContext.Provider value={{ language, direction, t: translations[language], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
