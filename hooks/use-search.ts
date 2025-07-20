import { create } from "zustand";

interface SeachStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export const useSearch = create<SeachStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onToggle: () => set({ isOpen: !get().isOpen }),
}));
