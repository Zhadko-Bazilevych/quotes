import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import type { JSX } from 'react';

type DeleteQuoteModalProps = {
  onOk: () => void;
  onClose: () => void;
  isOpen: boolean;
  message?: string;
};

export default function DeleteModal(props: DeleteQuoteModalProps): JSX.Element {
  const { onClose, isOpen, onOk, message = 'Are you sure?' } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-2 border border-gray-300 flex flex-col gap-2 bg-neutral-950 rounded min-w-50">
        <span>{message}</span>
        <div className="flex justify-end gap-2">
          <Button className="px-2" onClick={onOk}>
            Yep
          </Button>
          <Button className="px-2" onClick={onClose}>
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
}
