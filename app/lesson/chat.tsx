import React, { useState, useRef, useEffect, useMemo } from "react";
import { FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, Image, ScrollView } from "@/components/tw";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLearningStore } from "@/store/learningStore";
import { lessons } from "@/data/lessons";
import { images } from "@/constants/images";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Message {
  id: string;
  text: string;
  sender: "tutor" | "user";
  timestamp: Date;
  translation?: string;
  pronunciation?: string;
  showTranslation?: boolean;
}

export default function ChatLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { selectedLanguageId, completeLesson } = useLearningStore();

  // Find target lesson
  const currentLesson =
    lessons.find((l) => l.id === id) ||
    lessons.find((l) => l.type === "chat-ai-tutor") ||
    lessons[2]; // Default es-lesson-3 (At the Café)

  const goals = useMemo(() => {
    return currentLesson.goals && currentLesson.goals.length > 0
      ? currentLesson.goals
      : ["Order a drink", "Pay the check"];
  }, [currentLesson.goals]);

  // Chat simulation states
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [goalsCompleted, setGoalsCompleted] = useState<boolean[]>([false, false]);
  const [showGoalCheck, setShowGoalCheck] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  // Initialize conversation
  useEffect(() => {
    setGoalsCompleted(goals.map(() => false));
    
    // Initial welcome message
    let welcomeText = "¡Hola! Bienvenidos al café. ¿Qué te gustaría tomar hoy?";
    let welcomeTrans = "Hello! Welcome to the cafe. What would you like to drink today?";
    let welcomePron = "OH-lah! bee-en-veh-NEE-dos al kah-FEH. ¿keh teh goo-stah-REE-ah toh-MAR oy?";

    if (selectedLanguageId === "fr") {
      welcomeText = "Bonjour! Bienvenue au café. Qu'est-ce que vous désirez?";
      welcomeTrans = "Hello! Welcome to the cafe. What would you like?";
      welcomePron = "bohn-zhoor! bee-en-vuh-nee oh kah-feh. kes-kuh voo day-zee-ray?";
    } else if (selectedLanguageId === "ja") {
      welcomeText = "Konnichiwa! Kissaten e yōkoso. Go-chūmon wa?";
      welcomeTrans = "Hello! Welcome to the cafe. Your order?";
      welcomePron = "kon-nee-chee-wah! kees-sah-ten eh yoh-ko-so. go-choo-mon wah?";
    } else if (selectedLanguageId === "ko") {
      welcomeText = "Annyeonghaseyo! Cafe-e oshin geol hwanyeonghamnida. Mu-eot-eul deur-il-kka-yo?";
      welcomeTrans = "Hello! Welcome to the cafe. What can I get you?";
      welcomePron = "an-nyung-ha-seh-yo! kah-peh-eh oh-shin gul hwan-young-ham-nee-dah. moo-ut-eul deul-eel-kah-yo?";
    } else if (selectedLanguageId === "zh") {
      welcomeText = "Nǐ hǎo! Huānyíng guānglín kǎfēiguǎn. Nǐ xiǎng hē diǎn shénme?";
      welcomeTrans = "Hello! Welcome to the coffee shop. What would you like to drink?";
      welcomePron = "nee hao! huan-ying guang-lin ka-fei-guan. nee xiang he dian shen-me?";
    }

    setMessages([
      {
        id: "1",
        text: welcomeText,
        sender: "tutor",
        timestamp: new Date(),
        translation: welcomeTrans,
        pronunciation: welcomePron,
        showTranslation: false,
      },
    ]);
  }, [selectedLanguageId, goals]);

  // Toggle Translation
  const toggleTranslation = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, showTranslation: !msg.showTranslation }
          : msg
      )
    );
  };

  // Send message simulation
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newMsg: Message = {
      id: Math.random().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal("");

    // Simulate goal checks
    const lowerText = textToSend.toLowerCase();
    const updatedGoals = [...goalsCompleted];

    // Order drink goal check
    if (lowerText.includes("café") || lowerText.includes("cafe") || lowerText.includes("quiero") || lowerText.includes("tomar") || lowerText.includes("coffee") || lowerText.includes("croissant") || lowerText.includes("té") || lowerText.includes("tea")) {
      updatedGoals[0] = true;
    }

    // Pay bill goal check
    if (lowerText.includes("cuenta") || lowerText.includes("pagar") || lowerText.includes("pay") || lowerText.includes("bill") || lowerText.includes("check") || lowerText.includes("cuesta")) {
      updatedGoals[1] = true;
    }

    // Secondary auto progress fallback
    if (!updatedGoals[0] && !updatedGoals[1]) {
      updatedGoals[0] = true;
    } else if (updatedGoals[0] && !updatedGoals[1] && messages.length > 2) {
      updatedGoals[1] = true;
    }

    setGoalsCompleted(updatedGoals);

    // Scroll down
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Tutor reply simulation
    setTimeout(() => {
      let replyText = "Excelente elección. ¿Quieres pedir algo más?";
      let replyTrans = "Excellent choice. Do you want to order anything else?";
      let replyPron = "ek-seh-LEN-teh eh-lek-SYON. ¿kyeh-res peh-DEER al-go mas?";

      if (updatedGoals[0] && !updatedGoals[1]) {
        replyText = "Muy bien. Aquí tienes tu café caliente. ¿Deseas la cuenta?";
        replyTrans = "Very well. Here is your hot coffee. Do you want the check?";
        replyPron = "mwee byen. ah-KEE tyeh-nes too kah-FEH kah-LYEN-teh. ¿deh-SEH-as lah KWEN-tah?";
      } else if (updatedGoals[0] && updatedGoals[1]) {
        replyText = "¡Perfecto! Son 4 euros en total. ¡Muchas gracias por venir!";
        replyTrans = "Perfect! That is 4 euros in total. Thank you very much for coming!";
        replyPron = "¡pehr-FEK-to! son KWAH-troh eoo-ros en toh-TAL. ¡MOO-chas grah-syas por beh-NEER!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          text: replyText,
          sender: "tutor",
          timestamp: new Date(),
          translation: replyTrans,
          pronunciation: replyPron,
          showTranslation: false,
        },
      ]);

      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
  };

  const handleFinishSession = () => {
    completeLesson(currentLesson.id, currentLesson.xpReward || 25);
    router.back();
  };

  // Replies helpers
  const getSuggestions = () => {
    if (selectedLanguageId === "es") {
      if (!goalsCompleted[0]) {
        return ["Quiero un café, por favor", "Un té de limón, por favor", "¿Qué pasteles tienes?"];
      }
      if (!goalsCompleted[1]) {
        return ["La cuenta, por favor", "Quiero pagar", "¿Cuánto cuesta el café?"];
      }
      return ["Muchas gracias", "Adiós, buenas tardes"];
    }
    return ["Hello", "Yes, please", "Thank you"];
  };

  if (goalsCompleted.every(Boolean)) {
    // Show Done state
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center p-6 gap-6">
          <Image
            source={images.mascotCafe}
            className="w-48 h-48 mb-2"
            contentFit="cover"
            style={{ borderRadius: 32 }}
          />
          <Text className="font-poppins-bold text-[28px] text-[#001328] text-center">
            Roleplay Completed!
          </Text>
          <Text className="font-poppins-medium text-[15px] text-text-secondary text-center px-4 leading-6">
            Awesome! You successfully roleplayed ordering coffee and completed all conversation goals.
          </Text>

          <View className="bg-[#FAF9FF] border border-[#ECE8FF] rounded-[24px] p-5 w-full flex-row items-center justify-around mt-4">
            <View className="items-center">
              <Text className="font-poppins-bold text-[24px] text-[#6C4EF5]">+{currentLesson.xpReward || 25}</Text>
              <Text className="font-poppins-medium text-[12px] text-text-secondary">XP Gained</Text>
            </View>
            <View className="w-[1px] h-10 bg-gray-200" />
            <View className="items-center">
              <Text className="font-poppins-bold text-[24px] text-[#22C55E]">2 / 2</Text>
              <Text className="font-poppins-medium text-[12px] text-text-secondary">Goals Completed</Text>
            </View>
          </View>

          <Pressable
            onPress={handleFinishSession}
            className="w-full bg-[#6C4EF5] py-4 rounded-[24px] items-center justify-center active:bg-[#583cc7] shadow-sm mt-6 border-b-4 border-[#4c35b5]"
          >
            <Text className="font-poppins-bold text-white text-[16px]">Finish Lesson</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top", "bottom"]}>
      {/* Header */}
      <View className="bg-white pt-2 px-5 pb-3 flex-row items-center justify-between border-b border-gray-100 shadow-sm">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-gray-200 bg-white items-center justify-center active:bg-gray-50"
        >
          <Feather name="chevron-left" size={24} color="#001328" />
        </Pressable>

        <View className="items-center flex-1">
          <Text className="font-poppins-bold text-[16px] text-[#001328]">
            {currentLesson.title}
          </Text>
          <Text className="font-poppins-semibold text-[11px] text-[#6C4EF5] uppercase tracking-wide">
            AI Chat Tutor Lesson
          </Text>
        </View>

        <Pressable
          onPress={() => setShowGoalCheck(!showGoalCheck)}
          className={`w-10 h-10 rounded-full border items-center justify-center ${
            showGoalCheck ? "bg-[#EEF2FF] border-[#6C4EF5]" : "border-gray-200"
          }`}
        >
          <Feather name="list" size={20} color={showGoalCheck ? "#6C4EF5" : "#001328"} />
        </Pressable>
      </View>

      {/* Goals checklist banner */}
      {showGoalCheck && (
        <View className="bg-[#FAF9FF] border-b border-[#ECE8FF] px-5 py-3 gap-1">
          <Text className="font-poppins-bold text-[12px] text-[#6C4EF5] uppercase tracking-wide">
            Roleplay Checklist:
          </Text>
          {goals.map((goal, i) => (
            <View key={i} className="flex-row items-center gap-2 mt-0.5">
              <Ionicons
                name={goalsCompleted[i] ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={goalsCompleted[i] ? "#10B981" : "#9CA3AF"}
              />
              <Text
                className={`font-poppins-medium text-[13px] ${
                  goalsCompleted[i] ? "text-text-secondary line-through" : "text-text-primary"
                }`}
              >
                {goal}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Messages area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 14 }}
        renderItem={({ item }) => {
          const isTutor = item.sender === "tutor";
          const tutorAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100";
          return (
            <View className={`flex-row ${isTutor ? "justify-start" : "justify-end"}`}>
              {isTutor && (
                <Image
                  source={{ uri: tutorAvatar }}
                  className="w-9 h-9 rounded-full border border-border mr-2.5 self-end mb-1"
                  contentFit="cover"
                />
              )}
              <View className="max-w-[75%]">
                <Pressable
                  onPress={() => isTutor && toggleTranslation(item.id)}
                  className={`px-4 py-3.5 rounded-[22px] ${
                    isTutor
                      ? "bg-surface rounded-bl-none border border-border/40"
                      : "bg-[#6C4EF5] rounded-br-none border-b-4 border-[#523abf]"
                  }`}
                >
                  <Text
                    className={`font-poppins-medium text-[15px] ${
                      isTutor ? "text-text-primary" : "text-white"
                    }`}
                  >
                    {item.text}
                  </Text>

                  {isTutor && (
                    <View className="flex-row items-center mt-1 bg-white/70 px-2 py-0.5 rounded-md self-start border border-[#E5E7EB]">
                      <Feather name="globe" size={10} color="#6C4EF5" />
                      <Text className="font-poppins-semibold text-[9px] text-[#6C4EF5] ml-1">
                        Translate
                      </Text>
                    </View>
                  )}
                </Pressable>

                {/* Translation view */}
                {isTutor && item.showTranslation && (
                  <View className="mt-2 bg-[#F6F7FB] border border-[#ECEFF5] rounded-[18px] p-3.5 shadow-sm">
                    <Text className="font-poppins-medium text-[12px] text-text-secondary">
                      {item.translation}
                    </Text>
                    {item.pronunciation && (
                      <View className="flex-row items-center gap-1.5 mt-2 pt-2 border-t border-[#ECEFF5]">
                        <Ionicons name="volume-medium" size={14} color="#6C4EF5" />
                        <Text className="font-poppins-italic text-[11px] text-[#6C4EF5]">
                          {item.pronunciation}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Suggested replies & Input bar */}
      <View className="border-t border-gray-100 pt-3 pb-6 px-4 bg-white">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 4, paddingBottom: 10 }}
        >
          {getSuggestions().map((s, idx) => (
            <Pressable
              key={idx}
              onPress={() => handleSendMessage(s)}
              className="bg-[#F3F0FF] border border-[#E1D9FF] px-4 py-2.5 rounded-full active:bg-[#ECE8FF]"
            >
              <Text className="font-poppins-semibold text-[13px] text-[#6C4EF5]">
                {s}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-[#F3F4F6] rounded-[24px] border border-gray-200 px-4 py-1">
            <TextInput
              value={inputVal}
              onChangeText={setInputVal}
              placeholder="Type your reply..."
              className="flex-1 font-poppins-medium text-[14px] text-text-primary py-2.5"
            />
            <Pressable className="w-8 h-8 rounded-full items-center justify-center bg-transparent active:bg-gray-200">
              <Feather name="mic" size={18} color="#9CA3AF" />
            </Pressable>
          </View>

          <Pressable
            onPress={() => handleSendMessage(inputVal)}
            className="w-12 h-12 bg-[#6C4EF5] rounded-full items-center justify-center shadow-sm active:bg-[#583cc7]"
          >
            <Feather name="send" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
