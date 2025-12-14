import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type supportedI18nLngs } from '@/i18n';
import { UaFlagIcon, UsFlagIcon } from '@/icons';

import { Badge } from './badge';

type SupportedLanguage = {
  label: JSX.Element | string;
  code: (typeof supportedI18nLngs)[number];
  icon: JSX.Element;
};

export function LanguageSelect(): JSX.Element {
  const { t, i18n } = useTranslation();

  const supportedLangauges: SupportedLanguage[] = [
    {
      label: 'English',
      code: 'en',
      icon: <UsFlagIcon />,
    },
    {
      label: (
        <>
          Українська{' '}
          <Badge variant="destructive" className="py-0 uppercase">
            {t(($) => $.common.beta, { lng: 'ua', defaultValue: 'beta' })}
          </Badge>
        </>
      ),
      code: 'ua',
      icon: <UaFlagIcon />,
    },
  ];

  return (
    <Select
      value={i18n.resolvedLanguage}
      onValueChange={(value) => void i18n.changeLanguage(value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {supportedLangauges.map((lng) => (
          <SelectItem key={lng.code} value={lng.code}>
            {lng.icon} {lng.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
