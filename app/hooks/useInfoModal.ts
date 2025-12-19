import { create } from 'zustand';

interface InfoModalStore {
  movieId?: number;
  isOpen: boolean;
  openModal: (movieId: number) => void;
  closeModal: () => void;
}

const useInfoModal = create<InfoModalStore>((set) => ({
  movieId: undefined,
  isOpen: false,
  openModal: (movieId: number) => set({ isOpen: true, movieId }),
  closeModal: () => set({ isOpen: false, movieId: undefined }),
}));

export default useInfoModal;