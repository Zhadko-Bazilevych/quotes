import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateQuoteForm } from '@/components/quote/form/create-quote-form';
import PermissionButton from '@/components/ui/button/permission-button';

export function AddQuoteSection(): JSX.Element {
  const { t } = useTranslation();
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);

  const toggleCreate = (): void => {
    setIsCreatingQuote((prev) => !prev);
  };

  return (
    <>
      {!isCreatingQuote && (
        <PermissionButton
          className="py-2"
          onClick={toggleCreate}
          variant="outline"
        >
          {t(($) => $.quote.newQuotePrompt, {
            defaultValue: 'Create new quote?',
          })}
        </PermissionButton>
      )}
      {isCreatingQuote && <CreateQuoteForm onCancel={toggleCreate} />}
    </>
  );
}
