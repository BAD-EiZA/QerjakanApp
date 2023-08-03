import { create } from 'zustand';

interface CountryModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCountryModal = create<CountryModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useCountryModal;