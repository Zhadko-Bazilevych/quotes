import DeleteQuoteModal from '@/components/quote/delete-quote-modal';
import { Button } from '@/components/ui/button';
import { TrashcanIcon } from '@/components/ui/icons/trashcan';
import { useState, type JSX } from 'react';

type deleteButtonProps = {
  onOk: () => void;
};

export function DeleteButton(props: deleteButtonProps): JSX.Element {
  const { onOk } = props;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const closeModal = (): void => setIsModalOpen(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <TrashcanIcon className="w-6 h-6 text-red-500" />
      </Button>

      <DeleteQuoteModal onClose={closeModal} onOk={onOk} isOpen={isModalOpen} />
    </>
  );
}
