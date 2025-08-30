import React, { useState, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import type { Quote } from '@/types';
import { useDeleteQuoteMutation } from '@/hooks/use-delete-quote';
import { formatDatetime } from '@/utils/formatters';
import { useDisclosure } from '@/hooks/use-disclosure';
import { PencilIcon } from 'lucide-react';
import DeleteModal from '@/components/quote/delete-quote-modal';

export type QuoteCardProps = {
  quote: Quote;
  onEdit: (id: number) => void;
  setIsQuoteListVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const QuoteCard = React.memo(function QuoteCard(
  props: QuoteCardProps,
): JSX.Element {
  const { quote, onEdit, setIsQuoteListVisible } = props;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { isPending, mutate } = useDeleteQuoteMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toggleDetails = (): void => setIsDetailsOpen((prev) => !prev);

  const deleteQuote = (): void => {
    mutate(
      { id: quote.id },
      {
        onSuccess() {
          onModalClose();
        },
      },
    );
  };

  const onModalOpen = (): void => {
    setIsQuoteListVisible(false);
    onOpen();
  };

  const onModalClose = (): void => {
    onClose();
    setIsQuoteListVisible(true);
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
      <p className="wrap-break-word">{quote.content}</p>
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
            onOpen={onModalOpen}
            onClose={onModalClose}
            onOk={deleteQuote}
            isDeleting={isPending}
          />
        </div>
      </div>
      {isDetailsOpen && (
        <div className="flex flex-col gap-2">
          <div>
            <p className="wrap-break-word">{quote.context}</p>
            <span>Sender: {quote.user}</span>
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
