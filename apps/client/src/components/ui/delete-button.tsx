import type { JSX } from 'react';
import DeleteModal from '@/components/ui/delete-modal';
import { Button } from '@/components/ui/button';
import { TrashcanIcon } from '@/components/ui/icons';

type DeleteButtonProps = {
  isModalOpen: boolean;
  onOk: () => void;
  onModalOpen: () => void;
  onModalClose: () => void;
  message?: string;
};

// TODO: wait for successful deletion before closing the modal
// and show spinner while the the delete operation is pending
// and show a toast on success and on error
export function DeleteButton(props: DeleteButtonProps): JSX.Element {
  const { onOk, onModalClose, onModalOpen, isModalOpen, message } = props;

  return (
    <>
      <Button onClick={onModalOpen}>
        <TrashcanIcon className="size-6 text-red-500" />
      </Button>

      <DeleteModal
        onClose={onModalClose}
        onOk={onOk}
        isOpen={isModalOpen}
        message={message}
      />
    </>
  );
}
