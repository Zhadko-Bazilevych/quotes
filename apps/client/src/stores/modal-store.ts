import { create } from 'zustand';

export type ModalStore = {
  openedModals: Set<string>;
  isAnyModalOpen: boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  openedModals: new Set<string>(),
  isAnyModalOpen: false,
  add: (id): void =>
    set(({ openedModals }) => {
      openedModals.add(id);
      return {
        openedModals: new Set(openedModals),
        isAnyModalOpen: openedModals.size > 0,
      };
    }),
  remove: (id): void =>
    set(({ openedModals }) => {
      openedModals.delete(id);
      return {
        openedModals: new Set(openedModals),
        isAnyModalOpen: openedModals.size > 0,
      };
    }),
}));
