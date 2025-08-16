import { useState, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import type { Quote } from '@/types';
import { useDeleteQuoteMutation } from '@/hooks/use-delete-quote';
import { DeleteButton } from '@/components/ui/delete-button';
import { EditIcon } from '@/components/ui/icons';
import { formatDatetime } from '@/utils/formatters';
import { useQuoteListContext } from './quote-list-context';
import { useDisclosure } from '@/hooks/use-disclosure';

export type QuoteCardProps = {
  quote: Quote;
  onEdit: (id: number) => void;
};

export function QuoteCard(props: QuoteCardProps): JSX.Element {
  const { quote, onEdit } = props;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { setIsQuoteListVisible } = useQuoteListContext();
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
    <div className="flex flex-col gap-3 border rounded border-gray-300 p-2">
      <div className="flex justify-between">
        <span className="truncate">{quote.author}</span>
        <span className="hidden sm:block">
          Created: {formatDatetime(quote.createdAt)}
        </span>
      </div>
      <p className="wrap-break-word">{quote.content}</p>
      <div className="flex justify-between">
        <Button className="self-start" onClick={toggleDetails}>
          Details
        </Button>
        <div className="flex gap-1 items-start">
          <Button onClick={toggleEdit}>
            <EditIcon className="size-6" />
          </Button>
          <DeleteButton
            isModalOpen={isOpen}
            onModalClose={onModalClose}
            onModalOpen={onModalOpen}
            onOk={deleteQuote}
            isDeleting={isPending}
            message="Are you sure you want to delete this quote?"
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
            <span className="sm:hidden block">
              Created: {formatDatetime(quote.createdAt)}
            </span>
            <span>Updated: {formatDatetime(quote.updatedAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
