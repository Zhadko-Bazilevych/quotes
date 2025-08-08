import { useState, type JSX } from 'react';
import { Quote } from './quote';
import { QuoteForm } from './quote-form';
import { useQuery } from '@tanstack/react-query';

export function QuoteList(): JSX.Element {
  const { data } = useQuery<Quote[]>({
    queryKey: ['QuoteList'],
    queryFn: () => {
      return fetch('http://localhost:3000/quotes', { method: 'GET' }).then(
        (res) => res.json(),
      );
    },
  });

  const [isEditingIds, setIsEditingIds] = useState<number[]>([]);

  const toggleEdit = (id: number): void => {
    setIsEditingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section className="flex flex-col gap-3">
      {data?.map((quote) => {
        return isEditingIds.includes(quote.id) ? (
          <QuoteForm
            id={quote.id}
            author={quote.author}
            content={quote.content}
            user={quote.user}
            context={quote.context}
            key={quote.id}
            onCancel={() => toggleEdit(quote.id)}
          />
        ) : (
          <Quote
            id={quote.id}
            author={quote.author}
            content={quote.content}
            user={quote.user}
            context={quote.context}
            key={quote.id}
            dateAdded={quote.dateAdded}
            onEdit={() => toggleEdit(quote.id)}
          />
        );
      })}
    </section>
  );
}
