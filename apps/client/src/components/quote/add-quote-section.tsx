import { CreateQuoteForm } from '@/components/quote/form/create-quote-form';
import { Button } from '@/components/ui/button';
import { useState, type JSX } from 'react';

export function AddQuoteSection(): JSX.Element {
  const [isCreatingQuote, setIsCreatingQuote] = useState<boolean>(false);
  const toggleCreate = (): void => {
    setIsCreatingQuote((prev) => !prev);
  };

  return (
    <>
      {isCreatingQuote && <CreateQuoteForm onCancel={toggleCreate} />}
      {!isCreatingQuote && (
        <Button className="py-2" onClick={toggleCreate} variant="secondary">
          Create new quote?
        </Button>
      )}
    </>
  );
}
