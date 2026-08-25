import React, { useState, useRef } from "react";
import { SafeAreaView, Modal, FlatList, TextInput } from "react-native";
import { View, Text, Pressable, Image, ScrollView } from "@/components/tw";
import { useLearningStore } from "@/store/learningStore";
import { languages } from "@/data/languages";
import { images } from "@/constants/images";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ChatTopic {
  id: string;
  title: string;
  description: string;
  difficulty: "A1" | "A2" | "B1" | "Open";
  tutorName: string;
  tutorAvatar: string;
  goals: string[];
  initialMessage: string;
  initialMessageTranslation: string;
  initialMessagePronunciation: string;
}

const TOPICS_BY_LANG: Record<string, ChatTopic[]> = {
  es: [
    {
      id: "es-cafe",
      title: "Ordering at the Café",
      description: "Practice ordering coffee and pastries in Madrid.",
      difficulty: "A1",
      tutorName: "Sofía",
      tutorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      goals: ["Order a drink ('Quiero un café...')", "Ask for the check ('La cuenta, por favor')"],
      initialMessage: "¡Hola! Bienvenidos al Café Central. ¿Qué te gustaría tomar hoy?",
      initialMessageTranslation: "Hello! Welcome to Cafe Central. What would you like to drink today?",
      initialMessagePronunciation: "OH-lah! bee-en-veh-NEE-dos al kah-FEH sen-TRAL. ¿keh teh goo-stah-REE-ah toh-MAR oy?",
    },
    {
      id: "es-directions",
      title: "Asking for Directions",
      description: "Find your way to the Plaza Mayor.",
      difficulty: "A1",
      tutorName: "Mateo",
      tutorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      goals: ["Ask where the plaza is", "Thank the tutor for help"],
      initialMessage: "Hola. Disculpe, ¿busca algún lugar en la ciudad?",
      initialMessageTranslation: "Hello. Excuse me, are you looking for some place in the city?",
      initialMessagePronunciation: "OH-lah. dees-KOOL-peh, ¿BOOS-kah al-GOON loo-GAR en lah syoo-DAD?",
    },
  ],
  fr: [
    {
      id: "fr-cafe",
      title: "Ordering croissants",
      description: "Order a classic French breakfast.",
      difficulty: "A1",
      tutorName: "Chloé",
      tutorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      goals: ["Order a croissant", "Ask for the price"],
      initialMessage: "Bonjour! Qu'est-ce que je vous sers aujourd'hui?",
      initialMessageTranslation: "Hello! What can I serve you today?",
      initialMessagePronunciation: "bohn-zhoor! kes-kuh zhuh voo sair oh-zhoor-dwee?",
    },
  ],
  ja: [
    {
      id: "ja-cafe",
      title: "At the Sushi Bar",
      description: "Practice ordering sushi and drinks.",
      difficulty: "A1",
      tutorName: "Hana",
      tutorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      goals: ["Order tea", "Ask for the check"],
      initialMessage: "Irasshaimase! Go-chuumon wa o-kimari desu ka?",
      initialMessageTranslation: "Welcome! Have you decided on your order?",
      initialMessagePronunciation: "ee-rah-shai-mah-seh! go-choo-mon wah oh-kee-mah-ree des kah?",
    },
  ],
  ko: [
    {
      id: "ko-bbq",
      title: "At the BBQ Restaurant",
      description: "Order grilled meat and side dishes.",
      difficulty: "A1",
      tutorName: "Min-Jun",
      tutorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
      goals: ["Order Samgyeopsal", "Ask for water"],
      initialMessage: "Eoseo-oseyo! Myeot bun-i-sin-ga-yo? Mu-eot-eul deur-il-kka-yo?",
      initialMessageTranslation: "Welcome! How many people? What can I get you?",
      initialMessagePronunciation: "uh-suh-oh-seh-yo! myut boon-ee-shin-gah-yo? moo-ut-eul deul-eel-kah-yo?",
    },
  ],
  zh: [
    {
      id: "zh-tea",
      title: "At the Tea House",
      description: "Order local green tea and snacks.",
      difficulty: "A1",
      tutorName: "Mei",
      tutorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      goals: ["Order tea ('Wǒ yào chá')", "Pay check"],
      initialMessage: "Nǐ hǎo! Nǐ xiǎng hē shénme chá?",
      initialMessageTranslation: "Hello! What kind of tea would you like to drink?",
      initialMessagePronunciation: "nee hao! nee xiang he shen-me cha?",
    },
  ],
};

interface Message {
  id: string;
  text: string;
  sender: "tutor" | "user";
  timestamp: Date;
  translation?: string;
  pronunciation?: string;
  showTranslation?: boolean;
}

export default function ChatScreen() {
  const { selectedLanguageId, completeLesson } = useLearningStore();
  const [selectedTopic, setSelectedTopic] = useState<ChatTopic | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [goalsCompleted, setGoalsCompleted] = useState<boolean[]>([false, false]);
  const [showGoalCheck, setShowGoalCheck] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  const currentLanguage =
    languages.find((l) => l.id === selectedLanguageId) || languages[0];

  const topics = TOPICS_BY_LANG[currentLanguage.id] || TOPICS_BY_LANG.es;

  // Load chat simulation when topic selected
  const handleSelectTopic = (topic: ChatTopic) => {
    setSelectedTopic(topic);
    setGoalsCompleted(topic.goals.map(() => false));
    setMessages([
      {
        id: "1",
        text: topic.initialMessage,
        sender: "tutor",
        timestamp: new Date(),
        translation: topic.initialMessageTranslation,
        pronunciation: topic.initialMessagePronunciation,
        showTranslation: false,
      },
    ]);
  };

  // Close chat session
  const handleExitChat = () => {
    setSelectedTopic(null);
    setMessages([]);
  };

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

  // Send user message and simulate tutor response
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || !selectedTopic) return;

    const newMsg: Message = {
      id: Math.random().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal("");

    // Simulate goal matching
    const lowerText = textToSend.toLowerCase();
    const updatedGoals = [...goalsCompleted];
    
    // Simple mock keyword check for goals
    if (selectedTopic.id.includes("cafe")) {
      if (lowerText.includes("café") || lowerText.includes("cafe") || lowerText.includes("quiero") || lowerText.includes("croissant") || lowerText.includes("coffee")) {
        updatedGoals[0] = true;
      }
      if (lowerText.includes("cuenta") || lowerText.includes("pagar") || lowerText.includes("pay") || lowerText.includes("bill") || lowerText.includes("check")) {
        updatedGoals[1] = true;
      }
    } else {
      // Default auto-complete first goal then second
      if (!updatedGoals[0]) {
        updatedGoals[0] = true;
      } else if (!updatedGoals[1]) {
        updatedGoals[1] = true;
      }
    }
    setGoalsCompleted(updatedGoals);

    // Auto scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Tutor reply simulation
    setTimeout(() => {
      let replyText = "Entendido. ¿Algo más para ti?";
      let replyTrans = "Got it. Anything else for you?";
      let replyPron = "en-ten-DEE-do. ¿AL-go mas pah-rah tee?";

      if (updatedGoals[0] && !updatedGoals[1]) {
        replyText = "Excelente. Aquí tienes. ¿Quieres la cuenta ahora?";
        replyTrans = "Excellent. Here you go. Do you want the bill now?";
        replyPron = "ek-seh-LEN-teh. ah-KEE tyeh-nes. ¿KYEH-res lah KWEN-tah ah-OH-rah?";
      } else if (updatedGoals[0] && updatedGoals[1]) {
        replyText = "¡Perfecto! Son 5 euros. Muchas gracias por tu visita.";
        replyTrans = "Perfect! That is 5 euros. Thank you very much for your visit.";
        replyPron = "¡pehr-FEK-to! son SINK-o eoo-ros. MOO-chas grah-syas por too bee-SEE-tah.";
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

  const handleFinishChat = () => {
    completeLesson(`${currentLanguage.id}-chat-tutor-practice`, 25); // Reward 25 XP
    setSelectedTopic(null);
  };

  // Mock suggested replies based on current state
  const getSuggestions = () => {
    if (!selectedTopic) return [];
    if (selectedTopic.id.includes("cafe")) {
      if (!goalsCompleted[0]) {
        return ["Quiero un café, por favor", "Un té verde, por favor", "¿Qué me recomiendas?"];
      }
      if (!goalsCompleted[1]) {
        return ["La cuenta, por favor", "¿Cuánto cuesta?", "Quiero pagar con tarjeta"];
      }
      return ["Muchas gracias, adiós", "Hasta luego"];
    }
    return ["Hola", "Sí, por favor", "Gracias"];
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View className="bg-white pt-2 px-5 pb-3 flex-row items-center justify-between border-b border-gray-100">
        <Text className="font-poppins-bold text-[22px] text-[#001328]">AI Chat Tutor</Text>
        <View className="flex-row items-center gap-1 bg-surface px-3 py-1 rounded-full border border-border/50">
          <Image
            source={{ uri: currentLanguage.flagEmoji }}
            className="w-4 h-4 rounded-full mr-1"
            contentFit="cover"
          />
          <Text className="font-poppins-bold text-[13px] text-[#001328]">{currentLanguage.name}</Text>
        </View>
      </View>

      {/* Topics list dashboard */}
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectTopic(item)}
            className="bg-white border border-[#E5E7EB] rounded-[24px] p-5 flex-row items-center justify-between shadow-sm active:bg-gray-50"
          >
            <View className="flex-1 pr-4">
              <View className="flex-row items-center gap-2 mb-1.5">
                <View className="bg-[#FAF0FF] border border-[#F0D5FF] px-2.5 py-0.5 rounded-md">
                  <Text className="font-poppins-semibold text-[10px] text-[#6C4EF5]">
                    {item.difficulty}
                  </Text>
                </View>
                <Text className="font-poppins-semibold text-[12px] text-text-secondary">
                  Tutor: {item.tutorName}
                </Text>
              </View>
              <Text className="font-poppins-bold text-[18px] text-[#001328]">
                {item.title}
              </Text>
              <Text className="font-poppins-medium text-[13px] text-text-secondary leading-5 mt-1">
                {item.description}
              </Text>
            </View>

            <View className="relative">
              <Image
                source={{ uri: item.tutorAvatar }}
                className="w-14 h-14 rounded-full border-2 border-[#6C4EF5]"
                contentFit="cover"
              />
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-white" />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 px-6">
            <Image source={images.mascotWelcome} className="w-36 h-36 mb-4" contentFit="contain" />
            <Text className="font-poppins-bold text-[18px] text-text-primary text-center">
              No Chat Lessons Found
            </Text>
            <Text className="font-poppins-medium text-[14px] text-text-secondary text-center mt-2 leading-5">
              We are working on adding chat sessions for this language soon!
            </Text>
          </View>
        }
      />

      {/* CHAT MESSENGER MODAL */}
      {selectedTopic && (
        <Modal visible={true} animationType="slide">
          <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            {/* Chat Header */}
            <View className="bg-white pt-2 px-5 pb-3 flex-row items-center justify-between border-b border-gray-100 shadow-sm">
              <Pressable
                onPress={handleExitChat}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white items-center justify-center active:bg-gray-50"
              >
                <Feather name="chevron-left" size={24} color="#001328" />
              </Pressable>

              <View className="items-center flex-1">
                <Text className="font-poppins-bold text-[16px] text-[#001328]">
                  {selectedTopic.title}
                </Text>
                <Text className="font-poppins-semibold text-[11px] text-success">
                  Active Tutor: {selectedTopic.tutorName}
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

            {/* Goals Checklist Banner */}
            {showGoalCheck && (
              <View className="bg-[#FAF9FF] border-b border-[#ECE8FF] px-5 py-3 gap-1">
                <Text className="font-poppins-bold text-[12px] text-[#6C4EF5] uppercase tracking-wide">
                  Goal checklist:
                </Text>
                {selectedTopic.goals.map((goal, i) => (
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

            {/* Messages Stream */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 20, gap: 14 }}
              renderItem={({ item }) => {
                const isTutor = item.sender === "tutor";
                return (
                  <View className={`flex-row ${isTutor ? "justify-start" : "justify-end"}`}>
                    {isTutor && (
                      <Image
                        source={{ uri: selectedTopic.tutorAvatar }}
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
                              Tap to Translate
                            </Text>
                          </View>
                        )}
                      </Pressable>

                      {/* Expandable Translation Sub-card */}
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

            {/* Quick replies & Inputs */}
            <View className="border-t border-gray-100 pt-3 pb-6 px-4 bg-white">
              {/* Reply Chips */}
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

              {/* Chat Text Input bar */}
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

                {goalsCompleted.every(Boolean) ? (
                  <Pressable
                    onPress={handleFinishChat}
                    className="w-12 h-12 bg-success rounded-full items-center justify-center shadow-sm active:bg-emerald-600"
                  >
                    <Feather name="check" size={22} color="#FFFFFF" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => handleSendMessage(inputVal)}
                    className="w-12 h-12 bg-[#6C4EF5] rounded-full items-center justify-center shadow-sm active:bg-[#583cc7]"
                  >
                    <Feather name="send" size={20} color="#FFFFFF" />
                  </Pressable>
                )}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}
