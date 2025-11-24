import React, { useState, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import type { Quote } from '@/types/quotes';
import { useDeleteQuoteMutation } from '@/hooks/use-delete-quote';
import { formatDatetime } from '@/utils/formatters';
import { useDisclosure } from '@/hooks/use-disclosure';
import { PencilIcon } from 'lucide-react';
import DeleteModal from '@/components/quote/delete-quote-modal';

export type QuoteCardProps = {
  quote: Quote;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export const QuoteCard = React.memo(function QuoteCard(
  props: QuoteCardProps,
): JSX.Element {
  const { quote, onEdit, onDelete } = props;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { isPending, mutate } = useDeleteQuoteMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toggleDetails = (): void => setIsDetailsOpen((prev) => !prev);

  const deleteQuote = (): void => {
    mutate(
      { id: quote.id },
      {
        onSuccess() {
          onDelete(quote.id);
          onClose();
        },
      },
    );
  };

  const toggleEdit = (): void => onEdit(quote.id);

  return (
    <div className="bg-card flex flex-col gap-3 rounded border p-2">
      <div className="flex justify-between">
        <span className="truncate">{quote.author}</span>
        <span className="hidden sm:block">
          Created: {formatDatetime(quote.createdAt)}
        </span>
      </div>
      <p className="wrap-break-word whitespace-pre-wrap">{quote.content}</p>
      <div className="flex justify-between">
        <Button
          className="self-start"
          onClick={toggleDetails}
          variant="outline"
          size="sm"
        >
          Details
        </Button>
        <div className="flex items-start gap-1">
          <Button onClick={toggleEdit} variant="outline" size="icon">
            <PencilIcon />
          </Button>
          <DeleteModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            onOk={deleteQuote}
            isDeleting={isPending}
          />
        </div>
      </div>
      {isDetailsOpen && (
        <div className="flex flex-col gap-2">
          <div>
            <p className="wrap-break-word whitespace-pre-wrap">
              {quote.context}
            </p>
            <span>Sender: {quote.user.name}</span>
          </div>
          <div>
            <span className="block sm:hidden">
              Created: {formatDatetime(quote.createdAt)}
            </span>
            <span>Updated: {formatDatetime(quote.updatedAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
});
