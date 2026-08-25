import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image, Pressable } from "@/components/tw";
import { useAuth, useUser } from "@clerk/expo";
import { posthog } from "@/constants/posthog";
import { useLearningStore } from "@/store/learningStore";
import { languages } from "@/data/languages";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { xp, completedLessonIds, selectedLanguageId } = useLearningStore();

  const handleSignOut = async () => {
    posthog?.capture("user_signed_out");
    posthog?.reset();
    await signOut();
  };

  const currentLanguage =
    languages.find((l) => l.id === selectedLanguageId) || languages[0];

  const userName = user?.fullName || user?.username || "Learner";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "learner@example.com";
  const userAvatar = user?.imageUrl || null;

  // Mock weekly activity data
  const weeklyActivity = [
    { day: "Mon", xp: 15 },
    { day: "Tue", xp: 30 },
    { day: "Wed", xp: 0 },
    { day: "Thu", xp: 20 },
    { day: "Fri", xp: xp > 0 ? Math.min(xp, 40) : 10 },
    { day: "Sat", xp: 0 },
    { day: "Sun", xp: 0 },
  ];

  const maxWeeklyXp = Math.max(...weeklyActivity.map((a) => a.xp), 30);

  // Dynamic achievement state
  const achievements = [
    {
      id: "first_words",
      title: "First Words",
      description: "Complete your first language lesson",
      icon: "book",
      iconColor: "#6C4EF5",
      isUnlocked: completedLessonIds.length > 0,
      progress: Math.min(completedLessonIds.length, 1),
      max: 1,
    },
    {
      id: "xp_collector",
      title: "XP Collector",
      description: "Earn a total of 100 XP points",
      icon: "trophy",
      iconColor: "#F59E0B",
      isUnlocked: xp >= 100,
      progress: Math.min(xp, 100),
      max: 100,
    },
    {
      id: "speech_master",
      title: "Speech Master",
      description: "Complete 5 or more audio lessons",
      icon: "mic",
      iconColor: "#10B981",
      isUnlocked: completedLessonIds.length >= 5,
      progress: Math.min(completedLessonIds.length, 5),
      max: 5,
    },
    {
      id: "streak_pro",
      title: "Streak Pro",
      description: "Complete lessons on multiple days",
      icon: "flame",
      iconColor: "#EF4444",
      isUnlocked: true, // Mocked streak
      progress: 12,
      max: 30,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header Bar */}
      <View className="bg-white pt-2 px-5 pb-3 flex-row items-center justify-between border-b border-gray-100">
        <Text className="font-poppins-bold text-[22px] text-[#001328]">Profile</Text>
        <Pressable className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-border/50 active:bg-border/20">
          <Feather name="settings" size={20} color="#001328" />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View className="px-5 pt-6 items-center">
          <View className="relative">
            {userAvatar ? (
              <Image
                source={{ uri: userAvatar }}
                className="w-24 h-24 rounded-full border-4 border-[#6C4EF5]"
                contentFit="cover"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-[#EEEAFF] items-center justify-center border-4 border-[#6C4EF5]">
                <Feather name="user" size={40} color="#6C4EF5" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-[#6C4EF5] px-2 py-0.5 rounded-full border-2 border-white">
              <Text className="font-poppins-bold text-[10px] text-white">LV.3</Text>
            </View>
          </View>

          <Text className="font-poppins-bold text-[22px] text-[#001328] mt-3">
            {userName}
          </Text>
          <Text className="font-poppins-medium text-[13px] text-text-secondary">
            {userEmail}
          </Text>

          <View className="flex-row items-center mt-2.5 bg-surface px-3.5 py-1.5 rounded-full border border-border/40">
            <Image
              source={{ uri: currentLanguage.flagEmoji }}
              className="w-5 h-5 rounded-full mr-2"
              contentFit="cover"
            />
            <Text className="font-poppins-semibold text-[13px] text-[#001328]">
              Learning {currentLanguage.name}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-5 pt-6">
          <Text className="font-poppins-bold text-[18px] text-[#001328] mb-3">Statistics</Text>
          <View className="flex-row flex-wrap gap-3">
            {/* Stat 1 */}
            <View className="flex-1 min-w-[45%] bg-[#F8F7FF] border border-[#ECE9FF] rounded-[20px] p-4 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#EFE9FF] items-center justify-center">
                <Ionicons name="flash" size={20} color="#6C4EF5" />
              </View>
              <View>
                <Text className="font-poppins-bold text-[18px] text-[#001328]">{xp}</Text>
                <Text className="font-poppins-medium text-[12px] text-text-secondary">Total XP</Text>
              </View>
            </View>

            {/* Stat 2 */}
            <View className="flex-1 min-w-[45%] bg-[#FFF9F2] border border-[#FFE8CC] rounded-[20px] p-4 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#FFF0DE] items-center justify-center">
                <Ionicons name="flame" size={22} color="#FF8A00" />
              </View>
              <View>
                <Text className="font-poppins-bold text-[18px] text-[#001328]">12</Text>
                <Text className="font-poppins-medium text-[12px] text-text-secondary">Day Streak</Text>
              </View>
            </View>

            {/* Stat 3 */}
            <View className="flex-1 min-w-[45%] bg-[#F0FAF4] border border-[#D1F2DE] rounded-[20px] p-4 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#DCFCE7] items-center justify-center">
                <Ionicons name="checkmark-done-circle" size={22} color="#10B981" />
              </View>
              <View>
                <Text className="font-poppins-bold text-[18px] text-[#001328]">
                  {completedLessonIds.length}
                </Text>
                <Text className="font-poppins-medium text-[12px] text-text-secondary">Completed</Text>
              </View>
            </View>

            {/* Stat 4 */}
            <View className="flex-1 min-w-[45%] bg-[#F2F7FF] border border-[#D5E6FF] rounded-[20px] p-4 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#E0ECFF] items-center justify-center">
                <Ionicons name="globe-outline" size={20} color="#4D88FF" />
              </View>
              <View>
                <Text className="font-poppins-bold text-[18px] text-[#001328]">A1</Text>
                <Text className="font-poppins-medium text-[12px] text-text-secondary">Level</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Activity Chart */}
        <View className="px-5 pt-6">
          <View className="bg-white border border-[#E5E7EB] rounded-[24px] p-5 shadow-sm">
            <Text className="font-poppins-bold text-[16px] text-[#001328] mb-4">Weekly Progress</Text>
            
            {/* Chart Bars */}
            <View className="flex-row items-end justify-between h-[120px] px-2 mb-2">
              {weeklyActivity.map((activity, index) => {
                // Calculate height percentage
                const heightPct = `${Math.max((activity.xp / maxWeeklyXp) * 100, 5)}%`;
                const isToday = activity.day === "Fri"; // Mocking Friday as active day

                return (
                  <View key={index} className="items-center flex-1">
                    <View className="w-[12px] h-[90px] bg-[#F3F4F6] rounded-full justify-end overflow-hidden">
                      <View
                        style={{ height: heightPct as any }}
                        className={`w-full rounded-full ${isToday ? "bg-[#6C4EF5]" : "bg-[#9E8AFF]"}`}
                      />
                    </View>
                    <Text className={`font-poppins-semibold text-[11px] mt-2 ${isToday ? "text-[#6C4EF5]" : "text-text-secondary"}`}>
                      {activity.day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View className="px-5 pt-6">
          <Text className="font-poppins-bold text-[18px] text-[#001328] mb-3">Achievements</Text>
          <View className="gap-3">
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                className={`p-4 rounded-[20px] border flex-row items-center justify-between ${
                  achievement.isUnlocked
                    ? "bg-white border-border/60 shadow-sm"
                    : "bg-[#FAFAFA] border-border/40 opacity-70"
                }`}
              >
                <View className="flex-row items-center flex-1 pr-3">
                  <View
                    style={{ backgroundColor: `${achievement.iconColor}15` }}
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-3.5"
                  >
                    {achievement.icon === "flame" ? (
                      <Ionicons name="flame" size={24} color={achievement.iconColor} />
                    ) : (
                      <Feather name={achievement.icon as any} size={22} color={achievement.iconColor} />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-poppins-bold text-[15px] text-[#001328]">
                      {achievement.title}
                    </Text>
                    <Text className="font-poppins-regular text-[12px] text-text-secondary leading-4 mt-0.5">
                      {achievement.description}
                    </Text>

                    {/* Progress indicator */}
                    <View className="flex-row items-center mt-2.5">
                      <View className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden mr-2">
                        <View
                          style={{ width: `${(achievement.progress / achievement.max) * 100}%` }}
                          className="h-full bg-[#6C4EF5] rounded-full"
                        />
                      </View>
                      <Text className="font-poppins-semibold text-[10px] text-text-secondary">
                        {achievement.progress}/{achievement.max}
                      </Text>
                    </View>
                  </View>
                </View>

                {achievement.isUnlocked ? (
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                ) : (
                  <Feather name="lock" size={18} color="#9CA3AF" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Account Options */}
        <View className="px-5 pt-8">
          <Pressable
            onPress={handleSignOut}
            className="w-full bg-[#FFF1F1] border border-[#FFE3E3] py-4 rounded-[20px] items-center justify-center active:bg-[#FFE6E6]"
          >
            <View className="flex-row items-center gap-2">
              <Feather name="log-out" size={18} color="#EF4444" />
              <Text className="font-poppins-bold text-[#EF4444] text-[15px]">Sign Out</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
