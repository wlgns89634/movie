import { create } from "zustand";
import Lenis from "lenis";

interface LenisStore {
  lenis: Lenis | null;
  setLenis: (lenis: Lenis) => void;
  destroy: () => void;
}

export const useLenisStore = create<LenisStore>((set, get) => ({
  lenis: null,
  setLenis: (lenis) => set({ lenis }),
  destroy: () => {
    get().lenis?.destroy();
    set({ lenis: null });
  },
}));
