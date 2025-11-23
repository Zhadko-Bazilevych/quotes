import { useState } from 'react';

export type UseDisclosureReturn = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useDisclosure(
  initialState: boolean = false,
): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = (): void => setIsOpen(true);
  const onClose = (): void => setIsOpen(false);

  return {
    isOpen,
    onOpen,
    onClose,
    setIsOpen,
  };
}
