import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DropdownSelectionStore = {
  selectedCourse: number | null;
  selectedModule: number | null;
  selectedChapter: number | null;
  selectedLesson: number | null;
  setSelectedCourse: (id: number | null) => void;
  setSelectedModule: (id: number | null) => void;
  setSelectedChapter: (id: number | null) => void;
  setSelectedLesson: (id: number | null) => void;
};

export const useDropdownSelectionStore = create<DropdownSelectionStore>()(
  persist(
    (set) => ({
      selectedCourse: null,
      selectedModule: null,
      selectedChapter: null,
      selectedLesson: null,
      setSelectedCourse: (id: number | null) => {
        set({
          selectedCourse: id,
          selectedModule: null,
          selectedChapter: null,
          selectedLesson: null,
        });
      },
      setSelectedModule: (id: number | null) => {
        set({
          selectedModule: id,
          selectedChapter: null,
          selectedLesson: null,
        });
      },
      setSelectedChapter: (id: number | null) => {
        set({ selectedChapter: id, selectedLesson: null });
      },
      setSelectedLesson: (id: number | null) => set({ selectedLesson: id }),
    }),
    {
      name: "course-selection-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
