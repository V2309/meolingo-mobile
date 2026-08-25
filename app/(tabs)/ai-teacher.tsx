import React, { useState, useEffect } from "react";
import { SafeAreaView, Modal } from "react-native";
import { View, Text, ScrollView, Image, Pressable } from "@/components/tw";
import { useLearningStore } from "@/store/learningStore";
import { languages } from "@/data/languages";
import { images } from "@/constants/images";
import Feather from "@expo/vector-icons/Feather";

interface TeacherPersona {
  id: string;
  name: string;
  avatar: string;
  accent: string;
  personality: string;
  specialties: string[];
  tagline: string;
  introText: string;
}

const TEACHERS_BY_LANG: Record<string, TeacherPersona> = {
  es: {
    id: "lucia",
    name: "Lucía",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    accent: "Madrid, Spain",
    personality: "Warm & Enthusiastic",
    specialties: ["Conversational", "Pronunciation", "Daily Habits"],
    tagline: "¡Hola! Let's chat and build your Spanish speaking confidence together.",
    introText: "¡Hola! ¿Cómo estás? Me llamo Lucía. Let's practice introducing ourselves. Can you tell me your name?",
  },
  fr: {
    id: "thomas",
    name: "Thomas",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    accent: "Paris, France",
    personality: "Patient & Articulate",
    specialties: ["Grammar", "At the Restaurant", "Travel Guide"],
    tagline: "Bonjour! I will help you master French flow, step by step.",
    introText: "Bonjour! Comment ça va? Je m'appelle Thomas. Let's start with a simple greeting. Comment tu t'appelles?",
  },
  ja: {
    id: "yuki",
    name: "Yuki",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    accent: "Tokyo, Japan",
    personality: "Kind & Encouraging",
    specialties: ["Polite Speech (Keigo)", "Katakana", "Cafe Roleplay"],
    tagline: "Konnichiwa! Let's practice speaking Japanese in a relaxed environment.",
    introText: "Konnichiwa! O-genki desu ka? Yuki desu. Let's practice self-introduction. O-namae wa nan desu ka?",
  },
  ko: {
    id: "ji_yeon",
    name: "Ji-Yeon",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    accent: "Seoul, South Korea",
    personality: "Cheerful & Energetic",
    specialties: ["K-Drama Slang", "Everyday Expressions", "Pronunciation"],
    tagline: "Annyeonghaseyo! Ready to sound like a native Korean speaker?",
    introText: "Annyeonghaseyo! Ban-gap-seub-ni-da! Ji-Yeon im-ni-da. Let's learn basic greetings. O-ireum-i mu-eot-im-ni-da-ka?",
  },
  zh: {
    id: "wei",
    name: "Wei",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    accent: "Beijing, China",
    personality: "Calm & Structured",
    specialties: ["Tones Correction", "Market Shopping", "Pinyin Bascis"],
    tagline: "Nǐ hǎo! Let's conquer the four Chinese tones with confidence.",
    introText: "Nǐ hǎo! Nǐ jǐntiān hǎo ma? Wǒ shì Wei. Let's practice introducing ourselves. Nǐ jiào shénme míngzì?",
  },
};

export default function AITeacherScreen() {
  const { selectedLanguageId, completeLesson } = useLearningStore();
  const [isCalling, setIsCalling] = useState(false);
  const [callState, setCallState] = useState<"connecting" | "talking" | "listening" | "finished">("connecting");
  const [caption, setCaption] = useState("");
  const [userInputText, setUserInputText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [soundwaveScale, setSoundwaveScale] = useState(1);

  const currentLanguage =
    languages.find((l) => l.id === selectedLanguageId) || languages[0];

  const teacher = TEACHERS_BY_LANG[currentLanguage.id] || TEACHERS_BY_LANG.es;

  // Soundwave mock animation during call
  useEffect(() => {
    let interval: any;
    if (isCalling && callState === "talking") {
      interval = setInterval(() => {
        setSoundwaveScale(0.7 + Math.random() * 0.8);
      }, 150);
    } else {
      setSoundwaveScale(0.2);
    }
    return () => clearInterval(interval);
  }, [isCalling, callState]);

  // Handle fake call lifecycle
  const handleStartCall = () => {
    setIsCalling(true);
    setCallState("connecting");
    setCaption("");
    setUserInputText("");
    
    // Simulate connection
    setTimeout(() => {
      setCallState("talking");
      setCaption(teacher.introText);
    }, 2000);
  };

  const handleUserReplySim = () => {
    if (callState !== "listening") return;
    setCallState("connecting");
    setUserInputText("My name is Alex. ¡Mucho gusto!");
    
    setTimeout(() => {
      setCallState("talking");
      setCaption(`¡Mucho gusto, Alex! That was excellent pronunciation. Now, let's practice ordering a drink. How do you say 'A coffee, please'?`);
    }, 2000);
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setCallState("connecting");
  };

  const handleFinishSession = () => {
    completeLesson(`${currentLanguage.id}-ai-teacher-practice`, 20); // Award 20 XP
    setIsCalling(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View className="bg-white pt-2 px-5 pb-3 flex-row items-center justify-between border-b border-gray-100">
        <Text className="font-poppins-bold text-[22px] text-[#001328]">AI Teacher</Text>
        <View className="flex-row items-center gap-1 bg-surface px-3 py-1 rounded-full border border-border/50">
          <Image
            source={{ uri: currentLanguage.flagEmoji }}
            className="w-4 h-4 rounded-full mr-1"
            contentFit="cover"
          />
          <Text className="font-poppins-bold text-[13px] text-[#001328]">{currentLanguage.name}</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Card */}
        <View className="px-5 pt-5 mb-5">
          <View className="bg-[#FAF9FF] border border-[#ECE8FF] rounded-[28px] p-5 flex-row items-center justify-between shadow-sm overflow-hidden relative">
            <View className="flex-1 pr-4 z-10">
              <Text className="font-poppins-bold text-[18px] text-[#001328] mb-1">
                Real-Time Video Call
              </Text>
              <Text className="font-poppins-medium text-[13px] text-text-secondary leading-5 mb-4">
                Have a voice-and-video practice session with a patient native AI speaker.
              </Text>
              <Pressable
                onPress={handleStartCall}
                className="bg-[#6C4EF5] px-5 py-3 rounded-2xl active:bg-[#583cc7] self-start"
              >
                <Text className="font-poppins-semibold text-white text-[13px]">
                  Start Live Session
                </Text>
              </Pressable>
            </View>
            <Image
              source={images.mascotWelcome}
              className="w-24 h-24"
              contentFit="contain"
            />
          </View>
        </View>

        {/* Teacher Persona details */}
        <View className="px-5">
          <Text className="font-poppins-bold text-[18px] text-[#001328] mb-3">Your Native Teacher</Text>
          <View className="bg-white border border-border/60 rounded-[28px] p-5 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Image
                source={{ uri: teacher.avatar }}
                className="w-16 h-16 rounded-2xl mr-4"
                contentFit="cover"
              />
              <View className="flex-1">
                <Text className="font-poppins-bold text-[18px] text-[#001328]">{teacher.name}</Text>
                <Text className="font-poppins-medium text-[13px] text-text-secondary mt-0.5">
                  Accent: {teacher.accent}
                </Text>
                <View className="flex-row mt-1 bg-[#EEF2FF] px-2 py-0.5 rounded-md self-start border border-[#D5E1FF]">
                  <Text className="font-poppins-semibold text-[10px] text-[#6C4EF5]">
                    {teacher.personality}
                  </Text>
                </View>
              </View>
            </View>

            <Text className="font-poppins-italic text-[13px] text-text-secondary leading-5 mb-4 bg-surface p-3.5 rounded-2xl">
              &quot;{teacher.tagline}&quot;
            </Text>

            <View className="gap-2.5">
              <Text className="font-poppins-semibold text-[13px] text-[#001328]">Specialties:</Text>
              <View className="flex-row flex-wrap gap-2">
                {teacher.specialties.map((spec, i) => (
                  <View key={i} className="bg-surface px-3.5 py-1.5 rounded-full border border-border/50">
                    <Text className="font-poppins-medium text-[12px] text-text-secondary">{spec}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CALLING INTERFACE MODAL */}
      <Modal visible={isCalling} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0C0A15" }}>
          <View className="flex-1 px-5 pt-3 pb-8 justify-between">
            {/* Top Bar */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 bg-[#ffffff15] px-3.5 py-1.5 rounded-full border border-[#ffffff10]">
                <View className="w-2.5 h-2.5 rounded-full bg-success mr-1 animate-pulse" />
                <Text className="font-poppins-semibold text-[12px] text-white">
                  {callState === "connecting" ? "Connecting..." : "Live Call"}
                </Text>
              </View>
              <Pressable
                onPress={handleEndCall}
                className="w-10 h-10 rounded-full bg-[#ffffff15] items-center justify-center border border-[#ffffff10]"
              >
                <Feather name="x" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Video Preview Panel */}
            <View className="flex-1 my-6 rounded-[36px] overflow-hidden bg-[#151324] border border-[#ffffff08] justify-center items-center relative shadow-2xl">
              {isCameraOff ? (
                <View className="absolute inset-0 bg-[#0F0E1C] items-center justify-center">
                  <View className="w-20 h-20 rounded-full bg-[#6C4EF5]/10 items-center justify-center border border-[#6C4EF5]/20">
                    <Feather name="video-off" size={32} color="#6C4EF5" />
                  </View>
                  <Text className="font-poppins-medium text-[13px] text-white/50 mt-3">Camera Disabled</Text>
                </View>
              ) : (
                <View className="w-full h-full relative justify-center items-center">
                  {/* Teacher Portrait */}
                  <Image
                    source={{ uri: teacher.avatar }}
                    className="w-36 h-36 rounded-full border-4 border-[#6C4EF5] mb-4"
                    contentFit="cover"
                  />
                  <Text className="font-poppins-bold text-[24px] text-white">{teacher.name}</Text>
                  <Text className="font-poppins-semibold text-[13px] text-white/60 mt-1">{teacher.accent}</Text>

                  {/* Soundwave animation */}
                  {callState === "talking" && (
                    <View className="flex-row items-center gap-1.5 h-8 mt-5">
                      <View style={{ transform: [{ scaleY: soundwaveScale }] }} className="w-1 h-6 bg-[#6C4EF5] rounded-full" />
                      <View style={{ transform: [{ scaleY: soundwaveScale * 1.3 }] }} className="w-1 h-6 bg-[#6C4EF5] rounded-full" />
                      <View style={{ transform: [{ scaleY: soundwaveScale * 0.8 }] }} className="w-1 h-6 bg-[#6C4EF5] rounded-full" />
                      <View style={{ transform: [{ scaleY: soundwaveScale * 1.5 }] }} className="w-1 h-6 bg-[#6C4EF5] rounded-full" />
                      <View style={{ transform: [{ scaleY: soundwaveScale * 1.1 }] }} className="w-1 h-6 bg-[#6C4EF5] rounded-full" />
                    </View>
                  )}
                </View>
              )}

              {/* Subtitles Overlay */}
              {caption !== "" && (
                <View className="absolute bottom-5 left-5 right-5 bg-black/75 p-5 rounded-[24px] border border-white/10 shadow-lg">
                  <Text className="font-poppins-bold text-[11px] text-[#6C4EF5] tracking-wider uppercase mb-1">
                    {teacher.name}
                  </Text>
                  <Text className="font-poppins-bold text-[15px] text-white leading-5">
                    {caption}
                  </Text>
                </View>
              )}
            </View>

            {/* Bottom Interaction Area */}
            <View className="gap-5">
              {/* User transcript when speaking */}
              {userInputText !== "" && (
                <View className="bg-[#ffffff08] p-4 rounded-2xl border border-white/5 mx-2 flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-[#10B981]/20 items-center justify-center">
                    <Feather name="check" size={16} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-poppins-semibold text-[10px] text-white/50">YOU SPOKE</Text>
                    <Text className="font-poppins-semibold text-[14px] text-white mt-0.5">{userInputText}</Text>
                  </View>
                </View>
              )}

              {/* Simulated speak button for user */}
              {callState === "listening" ? (
                <Pressable
                  onPress={handleUserReplySim}
                  className="bg-[#10B981] mx-2 py-4 rounded-[24px] items-center justify-center active:bg-[#0ea271] shadow-md border-b-4 border-[#0a7854]"
                >
                  <View className="flex-row items-center gap-2">
                    <Feather name="mic" size={18} color="#FFFFFF" />
                    <Text className="font-poppins-bold text-white text-[15px]">Tap to speak: &quot;Alex im-ni-da&quot;</Text>
                  </View>
                </Pressable>
              ) : callState === "connecting" ? (
                <View className="mx-2 py-4 items-center justify-center bg-[#ffffff05] rounded-[24px] border border-white/5">
                  <Text className="font-poppins-medium text-white/40 text-[14px]">Teacher is thinking...</Text>
                </View>
              ) : (
                <Pressable
                  onPress={() => setCallState("listening")}
                  className="bg-[#6C4EF5] mx-2 py-4 rounded-[24px] items-center justify-center active:bg-[#583cc7] shadow-md border-b-4 border-[#4c35b5]"
                >
                  <Text className="font-poppins-bold text-white text-[15px]">Continue to Speaking Exercise</Text>
                </Pressable>
              )}

              {/* Call Controls Tool Bar */}
              <View className="flex-row items-center justify-center gap-6 mt-2">
                <Pressable
                  onPress={() => setIsMuted(!isMuted)}
                  className={`w-14 h-14 rounded-full items-center justify-center border ${
                    isMuted
                      ? "bg-error/20 border-error/30"
                      : "bg-[#ffffff0c] border-[#ffffff10] active:bg-[#ffffff15]"
                  }`}
                >
                  <Feather name={isMuted ? "mic-off" : "mic"} size={22} color={isMuted ? "#FF4D4F" : "#FFFFFF"} />
                </Pressable>

                <Pressable
                  onPress={handleFinishSession}
                  className="w-16 h-16 rounded-full bg-error items-center justify-center active:bg-[#e04345] shadow-lg"
                >
                  <Feather name="phone-off" size={24} color="#FFFFFF" />
                </Pressable>

                <Pressable
                  onPress={() => setIsCameraOff(!isCameraOff)}
                  className={`w-14 h-14 rounded-full items-center justify-center border ${
                    isCameraOff
                      ? "bg-error/20 border-error/30"
                      : "bg-[#ffffff0c] border-[#ffffff10] active:bg-[#ffffff15]"
                  }`}
                >
                  <Feather name={isCameraOff ? "video-off" : "video"} size={22} color={isCameraOff ? "#FF4D4F" : "#FFFFFF"} />
                </Pressable>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
