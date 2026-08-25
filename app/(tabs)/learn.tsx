import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
} from "@/components/tw";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLearningStore } from "@/store/learningStore";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { lessons } from "@/data/lessons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";

// Centralized image mapping helper for lessons
const getLessonImage = () => {
  return images.mascotLogo;
};

export default function LearnScreen() {
  const router = useRouter();
  const { selectedLanguageId, completedLessonIds } = useLearningStore();
  const [activeTab, setActiveTab] = useState<"lessons" | "practice">("lessons");

  // Get selected language or default to Spanish
  const currentLanguage =
    languages.find((l) => l.id === selectedLanguageId) || languages[0];

  // Get current language unit
  const currentUnit =
    units.find((u) => u.languageId === currentLanguage.id) || units[0];

  // Get lessons for current unit
  const unitLessons = lessons.filter(
    (l) => l.unitId === currentUnit.id || l.id.startsWith(currentLanguage.id)
  );

  // Use pre-populated completed lessons for initial design consistency if empty
  const effectiveCompletedIds = completedLessonIds.length === 0
    ? [
        `${currentLanguage.id}-lesson-1`,
        `${currentLanguage.id}-lesson-2`,
        // Also support other languages' initial mock state
        "es-lesson-1", "es-lesson-2",
        "fr-lesson-1", "fr-lesson-2",
        "ja-lesson-1", "ja-lesson-2",
        "ko-lesson-1", "ko-lesson-2",
        "zh-lesson-1", "zh-lesson-2"
      ]
    : completedLessonIds;

  // Calculate completed count dynamically based on store state
  const completedCount = unitLessons.filter(
    (l) => effectiveCompletedIds.includes(l.id)
  ).length;

  // Determine status of each lesson dynamically
  const getLessonStatus = (lessonId: string, index: number) => {
    if (effectiveCompletedIds.includes(lessonId)) {
      return "completed";
    }
    // First uncompleted lesson is "in_progress"
    const firstUncompletedIndex = unitLessons.findIndex(
      (l) => !effectiveCompletedIds.includes(l.id)
    );
    if (index === firstUncompletedIndex || (firstUncompletedIndex === -1 && index === 0)) {
      return "in_progress";
    }
    return "locked";
  };

  const displayTitle = currentUnit
    ? currentUnit.title.split(": ").pop()
    : "At the Café";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Fixed Header Bar */}
      <View className="bg-white pt-2 px-5 pb-3 flex-row items-center justify-between border-b border-gray-100">
        <Pressable
          onPress={() => router.push("/choose-language")}
          className="w-11 h-11 rounded-full border border-gray-200 bg-white items-center justify-center active:bg-gray-50 shadow-sm"
        >
          <Feather name="chevron-left" size={26} color="#001328" />
        </Pressable>

        <View className="items-center flex-1">
          <Text className="font-poppins-bold text-[18px] text-[#001328]">
            {displayTitle}
          </Text>
          <Text className="font-poppins-semibold text-[13px] text-[#9CA3AF] mt-0.5">
            Unit {currentUnit ? currentUnit.order : 3} • {Math.min(completedCount + 1, unitLessons.length)} / {unitLessons.length} lessons
          </Text>
        </View>

        <Pressable className="w-11 h-11 rounded-full border border-gray-200 bg-white items-center justify-center active:bg-gray-50 shadow-sm">
          <Ionicons name="bookmark" size={22} color="#F59E0B" />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Café Illustration */}
        <View className="px-5 pt-4 mb-4">
          <View className="w-full h-[220px] rounded-[32px] overflow-hidden bg-[#F0F2F5] shadow-sm">
            <Image
              source={images.mascotCafe}
              className="w-full h-full"
              contentFit="cover"
            />
          </View>
        </View>

        {/* Floating Segmented Control Tabs */}
        <View className="px-5 -mt-8 mb-6 z-20">
          <View className="flex-row bg-[#F1F0FA] p-1.5 rounded-[24px] border border-border/40 shadow-sm">
            <Pressable
              onPress={() => setActiveTab("lessons")}
              className={`flex-1 py-3 rounded-[20px] items-center justify-center ${
                activeTab === "lessons"
                  ? "bg-white shadow-sm border-b-[3px] border-[#6C4EF5]"
                  : ""
              }`}
            >
              <Text
                className={`font-poppins-semibold text-[15px] ${
                  activeTab === "lessons" ? "text-[#6C4EF5]" : "text-[#7C7C8C]"
                }`}
              >
                Lessons
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("practice")}
              className={`flex-1 py-3 rounded-[20px] items-center justify-center ${
                activeTab === "practice"
                  ? "bg-white shadow-sm border-b-[3px] border-[#6C4EF5]"
                  : ""
              }`}
            >
              <Text
                className={`font-poppins-semibold text-[15px] ${
                  activeTab === "practice" ? "text-[#6C4EF5]" : "text-[#7C7C8C]"
                }`}
              >
                Practice
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Dynamic Content */}
        {activeTab === "lessons" ? (
          <View className="px-5 gap-4">
            {unitLessons.map((lesson, index) => {
              const status = getLessonStatus(lesson.id, index);
              const isCompleted = status === "completed";
              const isInProgress = status === "in_progress";
              const isLocked = status === "locked";

              return (
                <Pressable
                  key={lesson.id}
                  onPress={() => {
                    // Navigate based on type
                    if (lesson.type === "audio-lesson") {
                      router.push({
                        pathname: "/lesson/audio",
                        params: { id: lesson.id }
                      });
                    } else if (lesson.type === "video-ai-teacher") {
                      router.push({
                        pathname: "/lesson/video",
                        params: { id: lesson.id }
                      });
                    } else if (lesson.type === "chat-ai-tutor") {
                      router.push({
                        pathname: "/lesson/chat",
                        params: { id: lesson.id }
                      });
                    } else if (lesson.type === "vocabulary-review") {
                      router.push({
                        pathname: "/lesson/vocab",
                        params: { id: lesson.id }
                      });
                    } else {
                      router.push({
                        pathname: "/lesson/audio",
                        params: { id: lesson.id }
                      });
                    }
                  }}
                  className={`p-5 rounded-[24px] border ${
                    isInProgress
                      ? "bg-[#F3F0FF] border-2 border-[#6C4EF5] shadow-sm"
                      : "bg-white border-[#E5E7EB]"
                  } ${isLocked ? "opacity-90" : ""} active:opacity-95`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-4">
                      <Text
                        className={`font-poppins-semibold text-[13px] mb-1 ${
                          isInProgress ? "text-[#6C4EF5]" : "text-[#9CA3AF]"
                        }`}
                      >
                        Lesson {lesson.order || index + 1}
                      </Text>
                      <Text
                        className={`font-poppins-bold text-[18px] ${
                          isLocked ? "text-[#9CA3AF]" : "text-[#1F2937]"
                        }`}
                      >
                        {lesson.title}
                      </Text>

                      {isInProgress && (
                        <Text className="font-poppins-semibold text-[13px] text-[#6C4EF5] mt-1">
                          In progress
                        </Text>
                      )}

                      {isLocked && (
                        <Text className="font-poppins-regular text-[13px] text-[#9CA3AF] mt-1">
                          0 / {lesson.goals?.length || 5} goals
                        </Text>
                      )}
                    </View>

                    {/* Status Indicator Icon / Illustration */}
                    {isCompleted && (
                      <Ionicons
                        name="checkmark-circle"
                        size={30}
                        color="#22C55E"
                      />
                    )}

                    {isInProgress && (
                      <Image
                        source={getLessonImage()}
                        className="w-14 h-14 rounded-2xl"
                        contentFit="cover"
                      />
                    )}

                    {isLocked && (
                      <Feather
                        name="lock"
                        size={22}
                        color="#9CA3AF"
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          /* Practice Tab View */
          <View className="px-5 py-6 items-center justify-center">
            <Image
              source={images.mascotWelcome}
              className="w-40 h-40 mb-4"
              contentFit="contain"
            />
            <Text className="font-poppins-bold text-[20px] text-[#1F2937] text-center mb-2">
              Practice Session
            </Text>
            <Text className="font-poppins-regular text-[15px] text-[#7C7C8C] text-center px-6 leading-6">
              Review and reinforce your skills through interactive quizzes, speaking exercises, and word association games.
            </Text>

            <Pressable className="mt-8 bg-[#6C4EF5] px-8 py-3.5 rounded-full shadow-sm active:bg-[#583cc7]">
              <Text className="font-poppins-semibold text-white text-[16px]">
                Start Practice Run
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
