import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supportedI18nLngs } from '@/i18n';
import { UaFlagIcon, UsFlagIcon } from '@/icons';

type SupportedLanguage = {
  label: string;
  code: string;
  icon: JSX.Element;
};

const supportedLangauges: SupportedLanguage[] = [
  {
    label: 'English',
    code: 'en',
    icon: <UsFlagIcon />,
  },
  {
    label: 'Українська',
    code: 'ua',
    icon: <UaFlagIcon />,
  },
].filter((lng) => supportedI18nLngs.includes(lng.code));

export function LanguageSelect(): JSX.Element {
  const { i18n } = useTranslation();

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
