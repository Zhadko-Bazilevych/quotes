import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateQuoteForm } from '@/components/quote/form/create-quote-form';
import { Button } from '@/components/ui/button';
import { LanguageSelect } from '@/components/ui/language-select';

export function AddQuoteSection(): JSX.Element {
  const { t } = useTranslation();
  const [isCreatingQuote, setIsCreatingQuote] = useState<boolean>(false);
  const toggleCreate = (): void => {
    setIsCreatingQuote((prev) => !prev);
  };

  return (
    <div className="flex gap-3">
      {isCreatingQuote && <CreateQuoteForm onCancel={toggleCreate} />}
      {!isCreatingQuote && (
        <Button className="grow" onClick={toggleCreate} variant="outline">
          {t(($) => $.quote.newQuotePrompt, {
            defaultValue: 'Create new quote?',
          })}
        </Button>
      )}
      <LanguageSelect />
    </div>
  );
}
