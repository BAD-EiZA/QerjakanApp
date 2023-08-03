import { create } from 'zustand';

interface EducationModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useEducationModal = create<EducationModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useEducationModal;