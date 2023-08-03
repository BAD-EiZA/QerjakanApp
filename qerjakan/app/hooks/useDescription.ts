import { create } from 'zustand';

interface DescriptionModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useDescriptionModal = create<DescriptionModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useDescriptionModal;