import { useState } from "react";
import { Quote } from "./quote";
import { QuoteForm } from "./quote-form";

type QuoteItem = Quote & {
  isEditing?: boolean;
};

const initialQuotes: QuoteItem[] = [
  {
    id: 1,
    author: "James",
    sender: "Mike",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    context: "Said during a random team meeting with no clear agenda.",
    dateAdded: new Date(),
  },
  {
    id: 2,
    author: "Emily",
    sender: "Sarah",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    context: "Context lost to time. Possibly while debugging CSS.",
    dateAdded: new Date(),
  },
  {
    id: 3,
    author: "John",
    sender: "David",
    content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    context: "He said this while trying to explain why the API failed.",
    dateAdded: new Date(),
  },
  {
    id: 4,
    author: "Olivia",
    sender: "Emma",
    content: "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    context: "Most likely said after 12 hours of meetings.",
    dateAdded: new Date(),
  },
  {
    id: 5,
    author: "Liam",
    sender: "Noah",
    content: "Cillum dolore eu fugiat nulla pariatur.",
    context: "Context missing. Probably Slack at 2am.",
    dateAdded: new Date(),
  },
  {
    id: 6,
    author: "Sophia",
    sender: "Isabella",
    content: "Excepteur sint occaecat cupidatat non proident.",
    context: "After three coffees and zero progress.",
    dateAdded: new Date(),
  },
  {
    id: 7,
    author: "William",
    sender: "Benjamin",
    content: "Sunt in culpa qui officia deserunt mollit anim id est laborum.",
    context: "No one knows why he said this, but it sounded smart.",
    dateAdded: new Date(),
  },
  {
    id: 8,
    author: "Ava",
    sender: "Mia",
    content: "Lorem ipsum, but make it agile.",
    context: "Retrospective turned philosophical.",
    dateAdded: new Date(),
  },
  {
    id: 9,
    author: "Lucas",
    sender: "Elijah",
    content: "Lorem ipsum — the universal placeholder for all our hopes.",
    context: "While staring blankly at an empty Figma frame.",
    dateAdded: new Date(),
  },
];

export function QuoteList() {
  const [quotes, setQuotes] = useState(initialQuotes);

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
