
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationJA from './locales/ja/translation.json';
import translationFR from './locales/fr/translation.json';
import translationDE from './locales/de/translation.json';
import translationKO from './locales/ko/translation.json';
import translationZH from './locales/zh/translation.json';
import translationRU from './locales/ru/translation.json';
import translationAR from './locales/ar/translation.json';
import translationPT from './locales/pt/translation.json';
import translationIT from './locales/it/translation.json';
import translationHI from './locales/hi/translation.json';
import translationNL from './locales/nl/translation.json';
import translationTR from './locales/tr/translation.json';
import translationPL from './locales/pl/translation.json';


const resources = {
  en: { translation: translationEN },
  es: { translation: translationES },
  ja: { translation: translationJA },
  fr: { translation: translationFR },
  de: { translation: translationDE },
  ko: { translation: translationKO },
  zh: { translation: translationZH },
  ru: { translation: translationRU },
  ar: { translation: translationAR },
  pt: { translation: translationPT },
  it: { translation: translationIT },
  hi: { translation: translationHI },
  nl: { translation: translationNL },
  tr: { translation: translationTR },
  pl: { translation: translationPL },
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    supportedLngs: Object.keys(resources),
    fallbackLng: 'en', // use en if detected lng is not available
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      // Order of detection methods.
      // 1. localStorage: checks for a language set by the user on a previous visit.
      // 2. navigator: checks the browser's language setting.
      // 'htmlTag' was removed to prevent it from incorrectly reading the static
      // lang="en" attribute on the initial load.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
