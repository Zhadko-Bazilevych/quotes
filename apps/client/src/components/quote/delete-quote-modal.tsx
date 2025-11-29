import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2Icon } from 'lucide-react';
import type { JSX } from 'react';

type DeleteQuoteModalProps = {
  isOpen: boolean;
  onOk: () => void;
  onOpen: () => void;
  onClose: () => void;
  isDeleting: boolean;
};

// TODO: and show spinner while the the delete operation is pending
// and show a toast on success and on error
export default function DeleteModal(props: DeleteQuoteModalProps): JSX.Element {
  const {
    isOpen,
    onOpen,
    onClose: onCloseFromProps,
    isDeleting,
    onOk: onOkFromProps,
  } = props;

  const onClose = (): void => {
    if (!isDeleting) {
      onCloseFromProps();
    }
  };

  const onOpenChange = (open: boolean): void => {
    if (open) {
      onOpen();
    } else {
      onClose();
    }
  };

  const onOk = (): void => {
    if (!isDeleting) {
      onOkFromProps();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2Icon className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent className="xs:w-fit">
        <DialogHeader>
          <DialogTitle>Delete quote?</DialogTitle>
          <DialogDescription>
            This action is final and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="px-2"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            No
          </Button>
          <Button className="px-2" onClick={onOk} disabled={isDeleting}>
            Yep
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
