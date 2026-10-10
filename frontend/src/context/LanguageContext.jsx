import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/translations';

const LanguageContext = createContext(null);

export const languages = [
  { code: 'uz', short: 'UZB', label: "O'zbekcha" },
  { code: 'en', short: 'ENG', label: 'English' },
  { code: 'ru', short: 'RUS', label: 'Русский' },
];

export const normalizeLang = (code) => {
  if (!code) return 'uz';
  const c = code.toLowerCase();
  if (c === 'uz' || c === 'uzb' || c === 'uzbek') return 'uz';
  if (c === 'ru' || c === 'rus' || c === 'russian') return 'ru';
  if (c === 'en' || c === 'eng' || c === 'english') return 'en';
  return 'uz';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      return normalizeLang(localStorage.getItem('sports_lang') || 'uz');
    } catch {
      return 'uz';
    }
  });

  const setLanguage = (lang) => {
    const normalized = normalizeLang(lang);
    setLanguageState(normalized);
    try {
      localStorage.setItem('sports_lang', normalized);
    } catch (e) {
      console.error('Failed to save language in localStorage', e);
    }
  };

  const t = (key) => {
    const lang = normalizeLang(language);
    const dict = translations[lang] || translations['uz'] || translations['en'];
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    return translations['en']?.[key] || key;
  };

  const currentLangObj = languages.find((l) => l.code === normalizeLang(language)) || languages[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages,
        currentLangObj,
      }}
    >
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
