import { QuoteCard as BaseQuoteCard } from '@/components/quote/quote-card';
import { UpdateQuoteForm as BaseUpdateQuoteForm } from '@/components/quote/form/update-quote-form';
import { useCallback, useState, type JSX } from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import React from 'react';

const UpdateQuoteForm = React.memo(BaseUpdateQuoteForm);
const QuoteCard = React.memo(BaseQuoteCard);

export function QuoteListSection(): JSX.Element {
  const { data } = useQuotes();
  const [editingIds, setEditingIds] = useState<number[]>([]);

  const toggleEdit = useCallback(
    (id: number): void => {
      setEditingIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    },
    [setEditingIds],
  );

  return (
    <section className="flex flex-col gap-3">
      {data?.map((quote) => {
        if (editingIds.includes(quote.id)) {
          return (
            <UpdateQuoteForm
              key={quote.id}
              quote={quote}
              onCancel={toggleEdit}
            />
          );
        }

        return <QuoteCard key={quote.id} quote={quote} onEdit={toggleEdit} />;
      })}
    </section>
  );
}
