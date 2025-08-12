import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import type { JSX } from 'react';

type DeleteQuoteModalProps = {
  onOk: () => void;
  onClose: () => void;
  isOpen: boolean;
};

export default function DeleteQuoteModal(
  props: DeleteQuoteModalProps,
): JSX.Element {
  const { onClose, isOpen, onOk } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-2 border border-gray-300 flex flex-col gap-2 bg-neutral-950 rounded">
        <span>Are you sure you want to delete this comment?</span>
        <div className="flex justify-around">
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
