import { type LanguageCode } from './translations';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  countryCode: string;
}

export const languageConfigs: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    countryCode: 'US'
  },
  {
    code: 'es',
    name: 'Español',
    countryCode: 'ES'
  },
  {
    code: 'fr',
    name: 'Français',
    countryCode: 'FR'
  },
  {
    code: 'ar',
    name: 'العربية',
    countryCode: 'SA'
  },
  {
    code: 'bn',
    name: 'বাংলা',
    countryCode: 'BD'
  },
  {
    code: 'hi',
    name: 'हिंदी',
    countryCode: 'IN'
  },
  {
    code: 'zh',
    name: '中文',
    countryCode: 'CN'
  }
];

export const getLanguageConfig = (code: LanguageCode): LanguageConfig | undefined => {
  return languageConfigs.find(config => config.code === code);
};

export const getLanguageName = (code: LanguageCode): string => {
  const config = getLanguageConfig(code);
  return config?.name || code;
};

export const getLanguageCountryCode = (code: LanguageCode): string => {
  const config = getLanguageConfig(code);
  return config?.countryCode || 'US';
}; 