import { Portal } from '@/components/ui/portal';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react';
import { Button } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';
import { addEventListenerWithCleaup } from '@/utils/add-event-listener';
import { XIcon } from 'lucide-react';

type ModalContext = Pick<ModalProps, 'onClose'>;

const ModalContext = createContext<ModalContext | null>(null);

function useModalContext(): ModalContext {
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error('Modal context should only be called in a modal');
  }

  return modalContext;
}

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export function Modal(props: ModalProps): JSX.Element | null {
  const { children, isOpen, onClose } = props;
  const contextValue = useMemo(() => ({ onClose }), [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    return addEventListenerWithCleaup(
      'keydown',
      (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
          onClose();
        }
      },
    );
  }, [onClose, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        onClick={onClose}
      >
        <div
          className="rounded border mx-2 bg-background"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalContext.Provider value={contextValue}>
            {children}
          </ModalContext.Provider>
        </div>
      </div>
    </Portal>
  );
}

type ModalHeaderProps = {
  title: string;
  showCloseButton?: boolean;
};

function ModalHeader({
  title,
  showCloseButton = true,
}: ModalHeaderProps): JSX.Element {
  const { onClose } = useModalContext();

  return (
    <div className="flex justify-between gap-2 border-b p-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      {showCloseButton && (
        <Button
          className="self-start"
          onClick={onClose}
          variant="outline"
          size="icon"
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
}

type ModalBodyProps = HTMLAttributes<HTMLDivElement>;

function ModalBody({
  children,
  className,
  ...rest
}: ModalBodyProps): JSX.Element {
  return (
    <div className={twMerge('p-2', className)} {...rest}>
      {children}
    </div>
  );
}

type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;

function ModalFooter({
  children,
  className,
  ...rest
}: ModalFooterProps): JSX.Element {
  return (
    <div className={twMerge('border-t p-2', className)} {...rest}>
      {children}
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
