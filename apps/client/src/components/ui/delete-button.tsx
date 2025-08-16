import DeleteModal from '@/components/ui/delete-modal';
import { Button } from '@/components/ui/button';
import { TrashcanIcon } from '@/components/ui/icons';
import { useState, type JSX } from 'react';
import { useQuoteListContext } from '../quote/quote-list-section';

type DeleteButtonProps = {
  onOk: () => void;
  message?: string;
};

// TODO: wait for successful deletion before closing the modal
// and show spinner while the the delete operation is pending
// and show a toast on success and on error
export function DeleteButton(props: DeleteButtonProps): JSX.Element {
  const { onOk: onOkFromProps, message } = props;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { setIsQuoteListVisible } = useQuoteListContext();

  const openModal = (): void => {
    setIsQuoteListVisible(false);
    setIsModalOpen(true);
  };
  const closeModal = (): void => {
    setIsModalOpen(false);
    setIsQuoteListVisible(true);
  };
  const onOk = (): void => {
    onOkFromProps();
    closeModal();
  };

  return (
    <>
      <Button onClick={openModal}>
        <TrashcanIcon className="size-6 text-red-500" />
      </Button>

      <DeleteModal
        onClose={closeModal}
        onOk={onOk}
        isOpen={isModalOpen}
        message={message}
      />
    </>
  );
}
