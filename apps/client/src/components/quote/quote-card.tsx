import { useState, type JSX } from 'react';
import { Button } from '../ui/button';
import type { Quote } from '@/types';

export type QuoteCardProps = {
  quote: Quote;
  onEdit: (id: number) => void;
};

export function QuoteCard(props: QuoteCardProps): JSX.Element {
  const { quote, onEdit } = props;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const toggleDetails = (): void => setIsDetailsOpen((prev) => !prev);

  return (
    <div className="flex flex-col gap-3 border rounded border-gray-300 p-2">
      <div className="flex justify-between">
        <span>{quote.author}</span>
        <span>Created: {quote.createdAt.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <p>{quote.content}</p>
        <div className="flex gap-1 items-start">
          <Button onClick={() => onEdit(quote.id)}>Edit</Button>
          <Button onClick={toggleDetails}>Details</Button>
        </div>
      </div>
      {isDetailsOpen && (
        <div>
          <p>{quote.context}</p>
          <div className="flex justify-between">
            <span>Sender: {quote.user}</span>
            <span>Updated: {quote.updatedAt.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
