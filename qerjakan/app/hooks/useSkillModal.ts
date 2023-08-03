import { create } from "zustand";

interface SkillModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useSkillModal = create<SkillModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))

export default useSkillModal;