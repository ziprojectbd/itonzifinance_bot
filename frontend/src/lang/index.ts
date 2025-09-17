export { translations, type LanguageCode, type TranslationKey } from './translations';
export { 
  languageConfigs, 
  getLanguageConfig, 
  getLanguageName, 
  getLanguageCountryCode,
  type LanguageConfig 
} from './languageConfig';

// Language utility functions
export const getTranslation = (lang: LanguageCode, key: TranslationKey): string => {
  return translations[lang]?.[key] || translations.en[key] || key;
};

export const getCurrentLanguage = (): LanguageCode => {
  const savedLang = localStorage.getItem('language') as LanguageCode;
  return savedLang && translations[savedLang] ? savedLang : 'en';
};

export const setLanguage = (lang: LanguageCode): void => {
  if (translations[lang]) {
    localStorage.setItem('language', lang);
  }
};

export const getAvailableLanguages = (): LanguageCode[] => {
  return Object.keys(translations) as LanguageCode[];
}; 