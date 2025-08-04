import { useState } from 'react';
import { Quote } from './quote';
import { QuoteForm } from './quote-form';

type QuoteItem = Quote & {
  isEditing?: boolean;
};

const initialQuotes: QuoteItem[] = [
  {
    id: 1,
    author: 'Test from docker stack using turborepo',
    sender: 'test',
    content: 'testing context',
    context: 'test',
    dateAdded: 'now',
  },
  {
    id: 2,
    author: 'Test 2',
    sender: 'test',
    content: 'testing context',
    context: 'test',
    dateAdded: 'now',
  },
  {
    id: 3,
    author: 'Test 3',
    sender: 'test',
    content: 'testing context',
    context: 'test',
    dateAdded: 'now',
  },
  {
    id: 4,
    author: 'Test 4',
    sender: 'test',
    content: 'testing context',
    context: 'test',
    dateAdded: 'now',
  },
];

export function QuoteList() {
  const [quotes, setQuotes] = useState(initialQuotes);

  // useEffect(() => {
  //   fetch("http://localhost:3000/quotes")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((result) => {
  //       setQuotes(result);
  //     });
  // }, []);

  function toggleEdit(id: number) {
    setQuotes((prev) => {
      const idx = prev.findIndex((quote) => quote.id === id);
      if (idx === undefined) {
        return prev;
      }
      const quote = prev[idx];
      const newQuoteList = [
        ...prev.slice(0, idx),
        { ...quote, isEditing: !quote.isEditing },
        ...prev.slice(idx + 1),
      ];
      return newQuoteList;
    });
  }

  return (
    <section className="flex flex-col gap-3">
      {quotes.map((quote) => {
        return quote.isEditing ? (
          <QuoteForm
            id={quote.id}
            author={quote.author}
            content={quote.content}
            sender={quote.sender}
            context={quote.context}
            key={quote.id}
            onEdit={() => toggleEdit(quote.id)}
          />
        ) : (
          <Quote
            id={quote.id}
            author={quote.author}
            content={quote.content}
            sender={quote.sender}
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
