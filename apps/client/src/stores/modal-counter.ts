import { create } from 'zustand';

type ModalCounterStore = {
  count: number;
  isAnyModalOpen: boolean;
  increment: () => void;
  decrement: () => void;
};

export const useModalCounterStore = create<ModalCounterStore>((set) => ({
  count: 0,
  isAnyModalOpen: false,
  increment: (): void =>
    set((store) => {
      const newCount = store.count + 1;
      return {
        count: newCount,
        isAnyModalOpen: newCount > 0,
      };
    }),
  decrement: (): void =>
    set((store) => {
      const newCount = store.count - 1;
      return {
        count: newCount,
        isAnyModalOpen: newCount > 0,
      };
    }),
}));
