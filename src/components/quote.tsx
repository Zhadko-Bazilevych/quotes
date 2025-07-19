import { useState } from "react";

type QuoteProps = {
  author: string;
  sender: string;
  content: string;
  context: string;
  dateAdded: Date;
};

export function Quote(props: QuoteProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { author, sender, content, context, dateAdded } = props;
  return (
    <div>
      <div className="flex justify-between">
        <span>{author}</span>
        <span>{dateAdded.toDateString()}</span>
      </div>
      <div className="flex justify-between">
        <p>{content}</p>
        <button onClick={() => setIsDetailsOpen((prev) => !prev)}>
          Details
        </button>
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
