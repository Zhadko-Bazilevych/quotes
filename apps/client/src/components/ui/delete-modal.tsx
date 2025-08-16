import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import type { JSX } from 'react';

type DeleteQuoteModalProps = {
  onOk: () => void;
  onClose: () => void;
  isOpen: boolean;
  isDeleting: boolean;
  message?: string;
};

export default function DeleteModal(props: DeleteQuoteModalProps): JSX.Element {
  const {
    onClose,
    isOpen,
    isDeleting,
    onOk,
    message = 'Are you sure?',
  } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={message} />
      <Modal.Body>
        <p>This action is final and cannot be undone</p>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-2">
        <Button className="px-2" onClick={onClose}>
          No
        </Button>
        <Button className="px-2" onClick={onOk} disabled={isDeleting}>
          Yep
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
