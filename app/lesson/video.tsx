import React, { useState, useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, Image } from "@/components/tw";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLearningStore } from "@/store/learningStore";
import { lessons } from "@/data/lessons";
import { images } from "@/constants/images";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function VideoLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { completeLesson } = useLearningStore();



  // Find target lesson
  const currentLesson =
    lessons.find((l) => l.id === id) ||
    lessons.find((l) => l.type === "video-ai-teacher") ||
    lessons[0]; // Default es-lesson-1 (Greetings & Introductions)

  // Simulation states
  const [callState, setCallState] = useState<"connecting" | "teacher_intro" | "user_speaking" | "teacher_feedback" | "completed">("connecting");
  const [subtitles, setSubtitles] = useState("");
  const [userSpeech, setUserSpeech] = useState("");
  const [goalsChecked, setGoalsChecked] = useState<boolean[]>([false, false]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Animated scanner value for video scan effect
  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Video scan animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 3500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 3500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation loop for mic active state
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanAnim, pulseAnim]);

  // Handle call workflow simulation
  useEffect(() => {
    setCallState("connecting");
    setSubtitles("");
    
    // Step 1: Connect
    const timer1 = setTimeout(() => {
      setCallState("teacher_intro");
      setSubtitles(`Hello! Hola, me llamo Lucía. Let's practice saying hello. Please repeat after me: "Hola, me llamo..." and say your name!`);
    }, 2000);

    return () => clearTimeout(timer1);
  }, []);

  const handleMicPress = () => {
    if (callState !== "teacher_intro") return;
    setCallState("user_speaking");
    setUserSpeech("");

    // Simulate speech-to-text
    setTimeout(() => {
      setUserSpeech("Hola, me llamo Alex. ¡Mucho gusto!");
      setGoalsChecked([true, true]); // Complete goals
    }, 2500);
  };

  const handleUserConfirm = () => {
    setCallState("teacher_feedback");
    setSubtitles("¡Excelente, Alex! You introduced yourself perfectly. You are ready to start ordering food in Spanish next!");
  };

  const handleFinish = () => {
    setCallState("completed");
  };

  const handleAwardAndClose = () => {
    completeLesson(currentLesson.id, currentLesson.xpReward || 20);
    router.back();
  };

  // Video scanner y interpolation
  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240], // based on video height
  });

  const teacherAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300";

  if (callState === "completed") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center p-6 gap-6">
          <Image
            source={images.mascotWelcome}
            className="w-48 h-48 mb-2"
            contentFit="contain"
          />
          <Text className="font-poppins-bold text-[28px] text-[#001328] text-center">
            Lesson Completed!
          </Text>
          <Text className="font-poppins-medium text-[15px] text-text-secondary text-center px-4 leading-6">
            Congratulations! You&apos;ve successfully finished your interactive call with your AI teacher.
          </Text>

          <View className="bg-[#FAF9FF] border border-[#ECE8FF] rounded-[24px] p-5 w-full flex-row items-center justify-around mt-4">
            <View className="items-center">
              <Text className="font-poppins-bold text-[24px] text-[#6C4EF5]">+{currentLesson.xpReward || 20}</Text>
              <Text className="font-poppins-medium text-[12px] text-text-secondary">XP Gained</Text>
            </View>
            <View className="w-[1px] h-10 bg-gray-200" />
            <View className="items-center">
              <Text className="font-poppins-bold text-[24px] text-[#22C55E]">2 / 2</Text>
              <Text className="font-poppins-medium text-[12px] text-text-secondary">Goals Met</Text>
            </View>
          </View>

          <Pressable
            onPress={handleAwardAndClose}
            className="w-full bg-[#6C4EF5] py-4 rounded-[24px] items-center justify-center active:bg-[#583cc7] shadow-sm mt-6 border-b-4 border-[#4c35b5]"
          >
            <Text className="font-poppins-bold text-white text-[16px]">Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0C0A15" }} edges={["top", "bottom"]}>
      {/* Top bar */}
      <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#ffffff10] border border-[#ffffff08] items-center justify-center active:bg-[#ffffff20]"
        >
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </Pressable>

        <View className="items-center">
          <Text className="font-poppins-bold text-white text-[15px]">{currentLesson.title}</Text>
          <Text className="font-poppins-semibold text-[#6C4EF5] text-[12px] mt-0.5">Interactive Video call</Text>
        </View>

        <View className="w-10 h-10 rounded-full bg-transparent" />
      </View>

      {/* Main Video call simulation panel */}
      <View className="flex-1 px-5 my-3 relative justify-between">
        
        {/* Video stream simulator box */}
        <View className="w-full h-[240px] rounded-[32px] overflow-hidden bg-[#151324] border border-[#ffffff10] relative justify-center items-center">
          {isCameraOff ? (
            <View className="absolute inset-0 items-center justify-center bg-black/80 z-20">
              <Feather name="video-off" size={32} color="#9CA3AF" />
              <Text className="font-poppins-medium text-white/50 text-[13px] mt-2">Camera Off</Text>
            </View>
          ) : (
            <View className="w-full h-full relative justify-center items-center">
              {/* Fake teacher avatar speaking */}
              <Image
                source={{ uri: teacherAvatar }}
                className="w-full h-full absolute inset-0 opacity-80"
                contentFit="cover"
              />

              {/* Vertical Video scan overlay */}
              <Animated.View
                style={[
                  styles.scannerLine,
                  { transform: [{ translateY }] },
                ]}
              />

              {/* Speaker status indicator */}
              {callState === "teacher_intro" && (
                <View className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full flex-row items-center gap-1.5 border border-white/10">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#6C4EF5]" />
                  <Text className="font-poppins-semibold text-white text-[11px] uppercase tracking-wide">Speaking</Text>
                </View>
              )}
            </View>
          )}

          {/* User mini preview PIP box */}
          <View className="absolute bottom-4 right-4 w-20 h-28 bg-[#1F1D33] rounded-[18px] border-2 border-white/20 overflow-hidden shadow-md">
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100" }}
              className="w-full h-full opacity-90"
              contentFit="cover"
            />
          </View>
        </View>

        {/* Goals Checklist Overlay */}
        <View className="bg-white/5 border border-white/10 p-4 rounded-[24px] gap-2.5">
          <Text className="font-poppins-bold text-white/50 text-[11px] uppercase tracking-wider">Lesson Goals:</Text>
          {currentLesson.goals.map((goal, idx) => (
            <View key={idx} className="flex-row items-center gap-2">
              <Ionicons
                name={goalsChecked[idx] ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={goalsChecked[idx] ? "#22C55E" : "#9CA3AF"}
              />
              <Text className={`font-poppins-medium text-[13px] ${goalsChecked[idx] ? "text-white/40 line-through" : "text-white"}`}>
                {goal}
              </Text>
            </View>
          ))}
        </View>

        {/* Dynamic subtitles bubble */}
        <View className="bg-black/60 border border-white/5 p-4 rounded-[24px] justify-center">
          <Text className="font-poppins-bold text-[#6C4EF5] text-[11px] tracking-widest uppercase mb-1">
            Teacher Subtitles
          </Text>
          <Text className="font-poppins-semibold text-white text-[14px] leading-5">
            {callState === "connecting" ? "Setting up video connection..." : subtitles}
          </Text>
        </View>

        {/* User response transcript display */}
        {userSpeech !== "" && (
          <View className="bg-[#10B981]/10 border border-[#10B981]/20 p-4 rounded-[22px] flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-full bg-[#10B981]/20 items-center justify-center">
              <Feather name="check" size={16} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="font-poppins-bold text-[9px] text-[#10B981] uppercase tracking-wider">YOU SPOKE</Text>
              <Text className="font-poppins-semibold text-white text-[13px] mt-0.5">{userSpeech}</Text>
            </View>
          </View>
        )}

        {/* Interaction control bar */}
        <View className="gap-4">
          {callState === "teacher_intro" ? (
            <Pressable
              onPress={handleMicPress}
              className="bg-[#6C4EF5] py-4 rounded-[24px] items-center justify-center border-b-4 border-[#4c35b5] shadow-md active:bg-[#583cc7]"
            >
              <View className="flex-row items-center gap-2">
                <Feather name="mic" size={18} color="#FFFFFF" />
                <Text className="font-poppins-bold text-white text-[15px]">Tap to speak</Text>
              </View>
            </Pressable>
          ) : callState === "user_speaking" ? (
            userSpeech === "" ? (
              <View className="items-center py-4 bg-white/5 rounded-[24px] border border-white/10 relative overflow-hidden">
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }} className="w-10 h-10 rounded-full bg-success/20 absolute justify-center items-center" />
                <Text className="font-poppins-bold text-success text-[14px] z-10">Listening...</Text>
              </View>
            ) : (
              <Pressable
                onPress={handleUserConfirm}
                className="bg-success py-4 rounded-[24px] items-center justify-center border-b-4 border-[#0e8f52] shadow-md active:bg-emerald-600"
              >
                <Text className="font-poppins-bold text-white text-[15px]">Continue</Text>
              </Pressable>
            )
          ) : callState === "teacher_feedback" ? (
            <Pressable
              onPress={handleFinish}
              className="bg-[#6C4EF5] py-4 rounded-[24px] items-center justify-center border-b-4 border-[#4c35b5] shadow-md active:bg-[#583cc7]"
            >
              <Text className="font-poppins-bold text-white text-[15px]">Complete call</Text>
            </Pressable>
          ) : (
            <View className="items-center py-4 bg-white/5 rounded-[24px] border border-white/10">
              <Text className="font-poppins-medium text-white/30 text-[14px]">Initializing Call...</Text>
            </View>
          )}

          {/* Media control row */}
          <View className="flex-row items-center justify-center gap-6 mt-1 mb-2">
            <Pressable
              onPress={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full items-center justify-center border ${
                isMuted
                  ? "bg-error/20 border-error/30"
                  : "bg-white/5 border-white/10 active:bg-white/10"
              }`}
            >
              <Feather name={isMuted ? "mic-off" : "mic"} size={20} color={isMuted ? "#FF4D4F" : "#FFFFFF"} />
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              className="w-14 h-14 rounded-full bg-error items-center justify-center active:bg-[#e04345] shadow-lg"
            >
              <Feather name="phone-off" size={22} color="#FFFFFF" />
            </Pressable>

            <Pressable
              onPress={() => setIsCameraOff(!isCameraOff)}
              className={`w-12 h-12 rounded-full items-center justify-center border ${
                isCameraOff
                  ? "bg-error/20 border-error/30"
                  : "bg-white/5 border-white/10 active:bg-white/10"
              }`}
            >
              <Feather name={isCameraOff ? "video-off" : "video"} size={20} color={isCameraOff ? "#FF4D4F" : "#FFFFFF"} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scannerLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(108, 78, 245, 0.4)",
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    width: "100%",
  },
});
