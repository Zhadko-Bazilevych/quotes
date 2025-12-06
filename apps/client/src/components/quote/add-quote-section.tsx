import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useAbility } from '@casl/react';

import { CreateQuoteForm } from '@/components/quote/form/create-quote-form';
import { Button } from '@/components/ui/button';
import { AbilityContext } from '@/lib/casl/permissions';

export function AddQuoteSection(): JSX.Element {
  const { t } = useTranslation();
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const ability = useAbility(AbilityContext);

  const toggleCreate = (): void => {
    setIsCreatingQuote((prev) => !prev);
  };

  const onClick = (): void => {
    if (ability.can('create', 'Quote')) {
      toggleCreate();
    } else {
      toast.warning(
        t(($) => $.quote.createQuoteUnauthorized, {
          defaultValue: 'You need to sign in to create a quote.',
        }),
      );
    }
  };

  return (
    <>
      {!isCreatingQuote && (
        <Button className="py-2" onClick={onClick} variant="outline">
          {t(($) => $.quote.newQuotePrompt, {
            defaultValue: 'Create new quote?',
          })}
        </Button>
      )}
      {isCreatingQuote && <CreateQuoteForm onCancel={toggleCreate} />}
    </>
  );
}
