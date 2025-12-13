import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateQuoteForm } from '@/components/quote/form/create-quote-form';
import { AuthRequiredButton } from '@/components/ui/button/auth-required-button';

export function AddQuoteSection(): JSX.Element {
  const { t } = useTranslation();
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);

  const toggleCreate = (): void => {
    setIsCreatingQuote((prev) => !prev);
  };

  return (
    <>
      {!isCreatingQuote && (
        <AuthRequiredButton
          className="py-2"
          onClick={toggleCreate}
          variant="outline"
        >
          {t(($) => $.quote.newQuotePrompt, {
            defaultValue: 'Create new quote?',
          })}
        </AuthRequiredButton>
      )}
      {isCreatingQuote && <CreateQuoteForm onCancel={toggleCreate} />}
    </>
  );
}
