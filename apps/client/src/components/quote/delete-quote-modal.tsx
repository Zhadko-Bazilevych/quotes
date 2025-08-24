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
  onOpenChange: (state: boolean) => void;
  isDeleting: boolean;
};

export default function DeleteModal(props: DeleteQuoteModalProps): JSX.Element {
  const { isOpen, onOpenChange, isDeleting, onOk: onOkFromProps } = props;

  const onOk = (): void => {
    if (!isDeleting) {
      onOkFromProps();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2Icon className="text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          onOpenChange(false);
          event.stopPropagation();
        }}
      >
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
