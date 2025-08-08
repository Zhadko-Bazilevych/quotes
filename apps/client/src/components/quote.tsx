import { useState, type JSX } from 'react';
import { Button } from './ui/button';

export type Quote = {
  id: number;
  author: string;
  user: string;
  content: string;
  context: string;
  dateAdded: string;
};

export type QuoteProps = Quote & {
  onEdit: () => void;
};

export function Quote(props: QuoteProps): JSX.Element {
  const { author, user, content, context, dateAdded, onEdit } = props;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 border rounded border-gray-300 p-2">
      <div className="flex justify-between">
        <span>{author}</span>
        <span>{dateAdded}</span>
      </div>
      <div className="flex justify-between">
        <p>{content}</p>
        <div className="flex gap-1 items-start">
          <Button onClick={onEdit}>Edit</Button>
          <Button onClick={() => setIsDetailsOpen((prev) => !prev)}>
            Details
          </Button>
        </div>
      </div>
      {isDetailsOpen && (
        <div>
          <p>{context}</p>
          <span>Sender: {user}</span>
        </div>
      )}
    </div>
  );
}
