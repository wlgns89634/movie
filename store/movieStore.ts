import { create } from "zustand";

interface MovieStore {
  selectedMovieId: number | null;
  selectedType: "movie" | "tv";
  isModalOpen: boolean;
  openModal: (id: number, type: "movie" | "tv") => void;
  closeModal: () => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  selectedMovieId: null,
  selectedType: "movie",
  isModalOpen: false,
  openModal: (id, type) =>
    set({ selectedMovieId: id, selectedType: type, isModalOpen: true }),
  closeModal: () => set({ selectedMovieId: null, isModalOpen: false }),
}));
