import i18next from 'i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

i18next.init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: { translation: fr },
    en: { translation: en }
  },
  interpolation: { escapeValue: false }
});

export { i18next };
