import { create } from "zustand";

interface MovieStore {
  selectedMovieId: number | null;
  isModalOpen: boolean;
  openModal: (id: number) => void;
  closeModal: () => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  selectedMovieId: null,
  isModalOpen: false,
  openModal: (id) => set({ selectedMovieId: id, isModalOpen: true }),
  closeModal: () => set({ selectedMovieId: null, isModalOpen: false }),
}));
