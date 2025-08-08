import { useState, type JSX } from 'react';
import { QuoteCard } from './quote';
import { QuoteForm } from './quote-form';
import { useQuotes } from '../hooks/use-quotes';

export function QuoteList(): JSX.Element {
  const { data } = useQuotes();
  const [editingIds, setEditingIds] = useState<number[]>([]);

  const toggleEdit = (id: number): void => {
    setEditingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section className="flex flex-col gap-3">
      {data?.map((quote) => {
        return editingIds.includes(quote.id) ? (
          <QuoteForm
            key={quote.id}
            quote={quote}
            onCancel={() => toggleEdit(quote.id)}
          />
        ) : (
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
