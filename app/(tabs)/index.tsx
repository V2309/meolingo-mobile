import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image, Pressable } from "@/components/tw";
import { images } from "@/constants/images";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "@clerk/expo";
import { useLearningStore } from "@/store/learningStore";
import { languages } from "@/data/languages";
import { useRouter } from "expo-router";
import { posthog } from "@/constants/posthog";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { selectedLanguageId } = useLearningStore();

  const currentLanguage = languages.find((l) => l.id === selectedLanguageId) || languages[0];
  const userName = user?.firstName || user?.username || "Alex";

  const handleContinueLearning = (entry_point: "continue_banner" | "todays_plan") => {
    posthog?.capture("learning_continued", {
      entry_point,
      language_id: currentLanguage.id,
    });
    router.push("/(tabs)/learn");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerClassName="px-5 pt-3 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header: Flag + Greeting & Streak + Notification */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-2.5">
            <Image
              source={{ uri: currentLanguage.flagEmoji }}
              className="w-10 h-10 rounded-full border border-border bg-surface"
              contentFit="cover"
            />
            <Text className="font-poppins-bold text-[20px] text-text-primary">
              Hola, {userName}! 👋
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            {/* Streak */}
            <View className="flex-row items-center gap-1 bg-surface px-2.5 py-1.5 rounded-full border border-border/50">
              <Image
                source={images.streakFire}
                className="w-5 h-5"
                contentFit="contain"
              />
              <Text className="font-poppins-bold text-[15px] text-text-primary">
                12
              </Text>
            </View>

            {/* Notification Bell */}
            <Pressable className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-border/50 active:bg-border/20">
              <Feather name="bell" size={20} color="#001328" />
            </Pressable>
          </View>
        </View>

        {/* Card 1: Daily Goal */}
        <View className="bg-[#FFF8F0] border border-[#FFE8D1] rounded-[24px] p-5 mb-5 flex-row items-center justify-between shadow-sm relative overflow-hidden">
          <View className="flex-1 pr-3">
            <Text className="font-poppins-medium text-[14px] text-text-secondary mb-1">
              Daily goal
            </Text>
            <View className="flex-row items-baseline mb-3">
              <Text className="font-poppins-bold text-[28px] text-text-primary">
                15
              </Text>
              <Text className="font-poppins-semibold text-[16px] text-text-secondary ml-1">
                / 20 XP
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="w-full h-3 bg-[#FFE3C7] rounded-full overflow-hidden">
              <View
                style={{ width: "75%" }}
                className="h-full bg-streak rounded-full"
              />
            </View>
          </View>

          {/* Treasure Illustration */}
          <Image
            source={images.treasure}
            className="w-24 h-24"
            contentFit="contain"
          />
        </View>

        {/* Card 2: Continue Learning Banner */}
        <View className="bg-gradient-to-r bg-[#5B3BF6] rounded-[28px] p-6 mb-6 relative overflow-hidden shadow-md">
          {/* Background Palace Graphic */}
          <Image
            source={images.palace}
            className="absolute right-0 bottom-0 w-44 h-44 opacity-90"
            contentFit="contain"
          />

          <View className="z-10 max-w-[65%]">
            <Text className="font-poppins-medium text-[13px] text-white/80 mb-1">
              Continue learning
            </Text>
            <Text className="font-poppins-bold text-[24px] text-white mb-0.5">
              {currentLanguage.name}
            </Text>
            <Text className="font-poppins-medium text-[14px] text-white/90 mb-4">
              A1 • Unit 3
            </Text>

            <Pressable
              onPress={() => handleContinueLearning("continue_banner")}
              className="bg-white px-5 py-2.5 rounded-2xl self-start active:bg-white/90 shadow-sm"
            >
              <Text className="font-poppins-semibold text-[#5B3BF6] text-[14px]">
                Continue
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Section: Today's Plan */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-poppins-bold text-[18px] text-text-primary">
            Today's plan
          </Text>
          <Pressable onPress={() => handleContinueLearning("todays_plan")}>
            <Text className="font-poppins-semibold text-[14px] text-lingua-purple">
              View all
            </Text>
          </Pressable>
        </View>

        {/* Today's Plan Items */}
        <View className="gap-3.5 mb-6">
          {/* Plan Item 1: Lesson (Completed) */}
          <View className="flex-row items-center justify-between p-3.5 bg-surface rounded-2xl border border-border/40">
            <View className="flex-row items-center gap-3.5">
              <View className="w-12 h-12 bg-[#6C4EF5] rounded-2xl items-center justify-center">
                <Feather name="book-open" size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text className="font-poppins-semibold text-[15px] text-text-primary">
                  Lesson
                </Text>
                <Text className="font-poppins-regular text-[13px] text-text-secondary mt-0.5">
                  At the café
                </Text>
              </View>
            </View>

            <Ionicons name="checkmark-circle" size={24} color="#6C4EF5" />
          </View>

          {/* Plan Item 2: AI Conversation */}
          <View className="flex-row items-center justify-between p-3.5 bg-surface rounded-2xl border border-border/40">
            <View className="flex-row items-center gap-3.5">
              <View className="w-12 h-12 bg-[#6C4EF5] rounded-2xl items-center justify-center">
                <Feather name="headphones" size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text className="font-poppins-semibold text-[15px] text-text-primary">
                  AI Conversation
                </Text>
                <Text className="font-poppins-regular text-[13px] text-text-secondary mt-0.5">
                  Talk about your day
                </Text>
              </View>
            </View>

            <View className="w-6 h-6 rounded-full border-2 border-text-secondary/30" />
          </View>

          {/* Plan Item 3: New words */}
          <View className="flex-row items-center justify-between p-3.5 bg-surface rounded-2xl border border-border/40">
            <View className="flex-row items-center gap-3.5">
              <View className="w-12 h-12 bg-[#FF6B6B] rounded-2xl items-center justify-center">
                <Feather name="smile" size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text className="font-poppins-semibold text-[15px] text-text-primary">
                  New words
                </Text>
                <Text className="font-poppins-regular text-[13px] text-text-secondary mt-0.5">
                  10 words
                </Text>
              </View>
            </View>

            <View className="w-6 h-6 rounded-full border-2 border-text-secondary/30" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
