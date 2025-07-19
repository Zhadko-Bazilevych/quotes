import { useState } from "react";
import { Button } from "./ui/button";

export type Quote = {
  id: number;
  author: string;
  sender: string;
  content: string;
  context: string;
  dateAdded: Date;
};

export type QuoteProps = Quote & {
  onEdit: () => void;
};

export function Quote(props: QuoteProps) {
  const { author, sender, content, context, dateAdded, onEdit } = props;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 border rounded border-gray-300 p-2">
      <div className="flex justify-between">
        <span>{author}</span>
        <span>{dateAdded.toDateString()}</span>
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
          <span>Sender: {sender}</span>
        </div>
      )}
    </div>
  );
}
