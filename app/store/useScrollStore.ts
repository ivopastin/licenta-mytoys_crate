import { create } from "zustand";

interface ScrollStore {
  scrollLocked: boolean;
  setScrollLocked: (locked: boolean) => void;
  aboutZoomed: boolean;
  setAboutZoomed: (zoomed: boolean) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  scrollLocked: true,
  setScrollLocked: (locked) => set({ scrollLocked: locked }),
  aboutZoomed: false,
  setAboutZoomed: (zoomed) => set({ aboutZoomed: zoomed }),
}));