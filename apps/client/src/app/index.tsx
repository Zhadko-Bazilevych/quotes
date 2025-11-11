import type { JSX } from 'react';

import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supportedLngs } from '@/i18n';

import { Header } from '@/components/header';

export function App(): JSX.Element {
  const { i18n } = useTranslation();

  return (
    <div className="flex flex-col items-center">
      <Header />
      <div className="my-2 w-full px-2 sm:w-3/5 sm:min-w-160">
        <div>
          <Select
            value={i18n.resolvedLanguage}
            onValueChange={(value) => void i18n.changeLanguage(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedLngs.map((lng) => (
                <SelectItem key={lng} value={lng}>
                  {lng}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </div>
    </div>
  );
}
