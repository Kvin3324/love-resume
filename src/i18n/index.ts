import i18next from 'i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = 'loveresume:language';

const getStoredLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'fr';

  try {
    const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return value === 'en' ? 'en' : 'fr';
  } catch {
    return 'fr';
  }
};

export const persistLanguage = (language: SupportedLanguage): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    return;
  }
};

const initialLanguage = getStoredLanguage();

i18next.init({
  lng: initialLanguage,
  fallbackLng: 'fr',
  resources: {
    fr: { translation: fr },
    en: { translation: en }
  },
  interpolation: { escapeValue: false }
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLanguage;
}

export { i18next };
