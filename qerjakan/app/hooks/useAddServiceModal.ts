import { create } from 'zustand';

interface AddServiceModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAddServiceModal = create<AddServiceModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useAddServiceModal;