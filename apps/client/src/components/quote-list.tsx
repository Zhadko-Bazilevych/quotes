import { useState, type JSX } from 'react';
import { QuoteCard } from './quote-card';
import { UpdateQuoteForm } from './update-quote-form';
import { useQuotes } from '@/hooks/use-quotes';
import { CreateQuoteForm } from '@/components/create-quote-form';
import { Button } from '@/components/ui/button';

export function QuoteList(): JSX.Element {
  const { data } = useQuotes();
  const [editingIds, setEditingIds] = useState<number[]>([]);
  const [isCreatingQuote, setIsCreatingQuote] = useState<boolean>(false);

  const toggleEdit = (id: number): void => {
    setEditingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const toggleCreate = (): void => {
    setIsCreatingQuote((prev) => !prev);
  };

  return (
    <section className="flex flex-col gap-3">
      {isCreatingQuote && <CreateQuoteForm onCancel={toggleCreate} />}
      {!isCreatingQuote && (
        <Button className="py-2" onClick={toggleCreate}>
          Create new quote?
        </Button>
      )}
      {data?.map((quote) => {
        if (editingIds.includes(quote.id)) {
          return (
            <UpdateQuoteForm
              key={quote.id}
              quote={quote}
              onCancel={() => toggleEdit(quote.id)}
            />
          );
        }

        return (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onEdit={() => toggleEdit(quote.id)}
          />
        );
      })}
    </section>
  );
}
