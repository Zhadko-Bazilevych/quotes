import { Portal } from '@/components/ui/portal';
import { useEffect, type JSX } from 'react';

type ModalProps = {
  children: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
};

export function Modal(props: ModalProps): JSX.Element | null {
  const { children, isOpen, onClose } = props;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeydown);

    return (): void => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [onClose, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <div
        className="absolute inset-0 flex items-center justify-center bg-black/40 z-50"
        onClick={onClose}
      >
        {children}
      </div>
    </Portal>
  );
}
