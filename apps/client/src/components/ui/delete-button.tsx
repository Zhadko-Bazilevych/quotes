import DeleteModal from '@/components/ui/delete-modal';
import { Button } from '@/components/ui/button';
import { TrashcanIcon } from '@/components/ui/icons/trashcan';
import { useState, type JSX } from 'react';

type DeleteButtonProps = {
  onOk: () => void;
  message?: string;
};

export function DeleteButton(props: DeleteButtonProps): JSX.Element {
  const { onOk, message } = props;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const closeModal = (): void => setIsModalOpen(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
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
