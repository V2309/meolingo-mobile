import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, Pressable } from "@/components/tw";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { images } from "@/constants/images";
import { lessons } from "@/data/lessons";
import { languages } from "@/data/languages";
import { useLearningStore } from "@/store/learningStore";
import { DIALOG_SCRIPTS } from "@/data/audioDialogs";

export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { selectedLanguageId } = useLearningStore();

  // Find target lesson or default to first audio lesson
  const currentLesson =
    lessons.find((l) => l.id === id) ||
    lessons.find((l) => l.type === "audio-lesson") ||
    lessons[1];

  // Current language details
  const currentLanguage =
    languages.find((l) => l.id === selectedLanguageId) || languages[0];

  const langCode = (selectedLanguageId || "es") as keyof typeof DIALOG_SCRIPTS;
  const dialogTurns = DIALOG_SCRIPTS[langCode] || DIALOG_SCRIPTS.es;

  // Audio interaction states
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);

  const turn = dialogTurns[currentTurnIndex % dialogTurns.length];

  const handleNextTurn = () => {
    setCurrentTurnIndex((prev) => (prev + 1) % dialogTurns.length);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3 bg-white">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
        >
          <Feather name="chevron-left" size={28} color="#001328" />
        </Pressable>

        <View className="items-start flex-1 ml-2">
          <Text className="font-poppins-bold text-[18px] text-[#001328]">
            AI Teacher
          </Text>
          <View className="flex-row items-center mt-0.5">
            <View className="w-2.5 h-2.5 rounded-full bg-[#22C55E] mr-1.5" />
            <Text className="font-poppins-medium text-[13px] text-[#6B7280]">
              Online
            </Text>
          </View>
        </View>

        {/* Right Header Status Badges */}
        <View className="flex-row items-center gap-2">
          <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
            <Feather name="video" size={17} color="#374151" />
          </View>
          <View className="h-9 px-3 rounded-full bg-gray-100 items-center justify-center">
            <Text className="font-poppins-semibold text-[13px] text-[#374151]">
              12
            </Text>
          </View>
          <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
            <Feather name="user" size={17} color="#374151" />
          </View>
        </View>
      </View>

      {/* Main Full-Height Container */}
      <View className="flex-1 px-4 pb-4">
        {/* Main Stage Card Container (Fills Available Height) */}
        <View className="flex-1 w-full rounded-[36px] bg-[#E8DCC4] overflow-hidden relative border border-gray-100 shadow-md">
          {/* Background Scene / Ambiance */}
          <Image
            source={images.mascotCafe}
            className="w-full h-full opacity-40 absolute inset-0"
            contentFit="cover"
          />

          {/* Student PIP Box (Top Right Overlay) */}
          {isCameraOn && (
            <View className="absolute top-4 right-4 w-[96px] h-[120px] rounded-[22px] overflow-hidden border-2 border-white/90 bg-[#D4E8DC] shadow-lg z-20 items-center justify-center">
              <Image
                source={images.mascotWelcome}
                className="w-full h-full"
                contentFit="contain"
              />
            </View>
          )}

          {/* Main Mascot Teacher (Center Screen) */}
          <View className="absolute top-8 left-0 right-0 items-center justify-center z-10">
            <Image
              source={images.mascotWelcome}
              className="w-[280px] h-[280px]"
              contentFit="contain"
            />
          </View>

          {/* Speech Bubble & Action Controls Container positioned at bottom */}
          <View className="absolute bottom-5 left-4 right-4 z-20 gap-4">
            {/* Teacher Speech / Response Bubble */}
            <Pressable
              onPress={handleNextTurn}
              className="bg-white rounded-[24px] p-5 shadow-lg border border-gray-100 relative active:opacity-95"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  {showSubtitles && (
                    <Text className="font-poppins-bold text-[17px] text-[#1F2937] mb-1">
                      {turn.teacherOriginal}
                    </Text>
                  )}
                  <Text className="font-poppins-semibold text-[15px] text-[#4B5563]">
                    {turn.teacherTranslation} 👏
                  </Text>
                </View>

                {/* Speaker Audio Icon */}
                <View className="w-9 h-9 rounded-full bg-[#F3F0FF] items-center justify-center">
                  <Ionicons name="volume-high" size={20} color="#6C4EF5" />
                </View>
              </View>

              {/* Speech Bubble Pointer (Tail) */}
              <View className="absolute -bottom-2 right-12 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-100" />
            </Pressable>

            {/* Action Control Buttons */}
            <View className="flex-row items-center justify-evenly pt-1">
              {/* Camera Toggle */}
              <View className="items-center">
                <Pressable
                  onPress={() => setIsCameraOn(!isCameraOn)}
                  className={`w-14 h-14 rounded-full items-center justify-center shadow-md ${
                    isCameraOn ? "bg-white" : "bg-gray-200"
                  }`}
                >
                  <Feather
                    name={isCameraOn ? "video" : "video-off"}
                    size={24}
                    color={isCameraOn ? "#1F2937" : "#9CA3AF"}
                  />
                </Pressable>
                <Text className="font-poppins-medium text-[12px] text-white mt-1 shadow-sm">
                  Camera
                </Text>
              </View>

              {/* Mic Toggle */}
              <View className="items-center">
                <Pressable
                  onPress={() => setIsMicOn(!isMicOn)}
                  className={`w-14 h-14 rounded-full items-center justify-center shadow-md ${
                    isMicOn ? "bg-white" : "bg-gray-200"
                  }`}
                >
                  <Feather
                    name={isMicOn ? "mic" : "mic-off"}
                    size={24}
                    color={isMicOn ? "#1F2937" : "#EF4444"}
                  />
                </Pressable>
                <Text className="font-poppins-medium text-[12px] text-white mt-1 shadow-sm">
                  Mic
                </Text>
              </View>

              {/* Subtitles Toggle */}
              <View className="items-center">
                <Pressable
                  onPress={() => setShowSubtitles(!showSubtitles)}
                  className={`w-14 h-14 rounded-full items-center justify-center shadow-md ${
                    showSubtitles ? "bg-white" : "bg-gray-200"
                  }`}
                >
                  <MaterialIcons
                    name="subtitles"
                    size={24}
                    color={showSubtitles ? "#1F2937" : "#9CA3AF"}
                  />
                </Pressable>
                <Text className="font-poppins-medium text-[12px] text-white mt-1 shadow-sm">
                  Subtitles
                </Text>
              </View>

              {/* End Call Button */}
              <View className="items-center">
                <Pressable
                  onPress={() => router.back()}
                  className="w-14 h-14 rounded-full bg-[#EF4444] items-center justify-center shadow-md active:bg-red-600"
                >
                  <MaterialIcons name="call-end" size={26} color="#FFFFFF" />
                </Pressable>
                <Text className="font-poppins-medium text-[12px] text-white mt-1 shadow-sm">
                  End Call
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Live Feedback Score Card */}
        <View className="mt-4 p-4 bg-white rounded-[28px] border border-gray-100 shadow-sm flex-row items-center justify-between">
          <View className="flex-1 items-center border-r border-gray-100">
            <Text className="font-poppins-semibold text-[13px] text-[#374151] mb-0.5">
              Speaking
            </Text>
            <Text className="font-poppins-bold text-[15px] text-[#22C55E]">
              {turn.feedback.speaking}
            </Text>
          </View>

          <View className="flex-1 items-center border-r border-gray-100">
            <Text className="font-poppins-semibold text-[13px] text-[#374151] mb-0.5">
              Pronunciation
            </Text>
            <Text className="font-poppins-bold text-[15px] text-[#3B82F6]">
              {turn.feedback.pronunciation}
            </Text>
          </View>

          <View className="flex-1 items-center">
            <Text className="font-poppins-semibold text-[13px] text-[#374151] mb-0.5">
              Grammar
            </Text>
            <Text className="font-poppins-bold text-[15px] text-[#8B5CF6]">
              {turn.feedback.grammar}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
