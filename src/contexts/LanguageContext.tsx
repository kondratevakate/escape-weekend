import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, translations, getNestedValue } from '@/lib/i18n';

const STORAGE_KEY = 'app_language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === 'ru' || stored === 'en') return stored;
  } catch {}
  // Russian by default for everyone; users can switch via LanguageSwitcher.
  return 'ru';
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {}
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'ru' ? 'en' : 'ru');
  }, []);

  const t = useCallback((key: string): string => {
    const translation = getNestedValue(translations[language], key);
    return typeof translation === 'string' ? translation : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
