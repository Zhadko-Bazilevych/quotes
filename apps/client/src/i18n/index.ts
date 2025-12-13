import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { env } from '@/env';

export const defaultNS = 'translation';
export const supportedI18nLngs = env.VITE_ENABLE_I18N ? ['en', 'ua'] : ['en'];

void i18n
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .use(I18NextHttpBackend)
  .init({
    debug: env.DEV,
    supportedLngs: supportedI18nLngs,
    fallbackLng: 'en',
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n };
