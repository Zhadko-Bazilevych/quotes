import 'i18next';
import type { defaultNS } from '@/i18n';
import type en from '../../public/locales/en/translation.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: { translation: typeof en };
    strictKeyChecks: true;
    enableSelector: true;
  }
}
