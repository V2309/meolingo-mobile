import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LearningState {
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string | null) => void;
  completedLessonIds: string[];
  xp: number;
  completeLesson: (lessonId: string, xpReward: number) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
      completedLessonIds: [
        "es-lesson-1",
        "es-lesson-2",
        "fr-lesson-1",
        "fr-lesson-2",
        "ja-lesson-1",
        "ja-lesson-2",
        "ko-lesson-1",
        "ko-lesson-2",
        "zh-lesson-1",
        "zh-lesson-2",
      ],
      xp: 0,
      completeLesson: (lessonId, xpReward) =>
        set((state) => {
          if (state.completedLessonIds.includes(lessonId)) return {};
          return {
            completedLessonIds: [...state.completedLessonIds, lessonId],
            xp: state.xp + xpReward,
          };
        }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "lingua-learning-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
