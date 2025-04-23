import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Lista de idiomas soportados
const supportedLngs = ['es', 'en', 'es-HX', 'en-HX'];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    supportedLngs,
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
      allowMultiLoading: false,
      requestOptions: {
        cache: 'no-store'
      }
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['cookie']
    },
    saveMissing: false,
    missingKeyHandler: (lngs, ns, key) => {
      console.warn(`Missing translation key: ${key} for language ${lngs}`);
    }
  });

export default i18n;