import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, Image } from "@/components/tw";
import { Animated, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLearningStore } from "@/store/learningStore";
import { lessons } from "@/data/lessons";
import { images } from "@/constants/images";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

// Mock vocabulary items for shopping or fallback
const MOCK_VOCAB_FALLBACKS: Record<string, any[]> = {
  es: [
    { id: "v-1", word: "La camisa", translation: "The shirt", pronunciation: "lah kah-MEE-sah", partOfSpeech: "noun", exampleSentence: "Me gusta esta camisa azul.", exampleTranslation: "I like this blue shirt." },
    { id: "v-2", word: "El precio", translation: "The price", pronunciation: "el PREH-syoh", partOfSpeech: "noun", exampleSentence: "¿Cuál es el precio de esto?", exampleTranslation: "What is the price of this?" },
    { id: "v-3", word: "Barato", translation: "Cheap", pronunciation: "bah-RAH-toh", partOfSpeech: "adjective", exampleSentence: "Este libro es muy barato.", exampleTranslation: "This book is very cheap." },
    { id: "v-4", word: "Caro", translation: "Expensive", pronunciation: "KAH-roh", partOfSpeech: "adjective", exampleSentence: "Ese coche es demasiado caro.", exampleTranslation: "That car is too expensive." },
    { id: "v-5", word: "Comprar", translation: "To buy", pronunciation: "kom-PRAR", partOfSpeech: "verb", exampleSentence: "Quiero comprar una manzana.", exampleTranslation: "I want to buy an apple." },
  ],
  fr: [
    { id: "v-1", word: "La chemise", translation: "The shirt", pronunciation: "lah shuh-meez", partOfSpeech: "noun", exampleSentence: "J'aime cette chemise bleue.", exampleTranslation: "I like this blue shirt." },
    { id: "v-2", word: "Le prix", translation: "The price", pronunciation: "luh pree", partOfSpeech: "noun", exampleSentence: "Quel est le prix?", exampleTranslation: "What is the price?" },
  ],
  ja: [
    { id: "v-1", word: "Shirt (シャツ)", translation: "Shirt", pronunciation: "shatsu", partOfSpeech: "noun", exampleSentence: "Kono shatsu wa yasui desu.", exampleTranslation: "This shirt is cheap." },
  ],
  ko: [
    { id: "v-1", word: "Jeogori (저고리)", translation: "Traditional jacket", pronunciation: "jeo-go-ri", partOfSpeech: "noun", exampleSentence: "Jeogori-ga yeppeuda.", exampleTranslation: "The jacket is pretty." },
  ],
  zh: [
    { id: "v-1", word: "Chènshān (衬衫)", translation: "Shirt", pronunciation: "chen-shan", partOfSpeech: "noun", exampleSentence: "Wǒ xǐhuān zhè jiàn chènshān.", exampleTranslation: "I like this shirt." },
  ],
};

export default function VocabularyReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { selectedLanguageId, completeLesson } = useLearningStore();



  // Find target lesson
  const currentLesson =
    lessons.find((l) => l.id === id) ||
    lessons.find((l) => l.type === "vocabulary-review") ||
    lessons[4]; // Default es-lesson-5 (Shopping)

  // Retrieve vocabulary items or fallback to language-specific list
  const langCode = selectedLanguageId || "es";
  const vocabItems =
    currentLesson.vocabulary && currentLesson.vocabulary.length > 0
      ? currentLesson.vocabulary
      : MOCK_VOCAB_FALLBACKS[langCode] || MOCK_VOCAB_FALLBACKS.es;

  // Track active card index
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Animated values for card flipping
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Interpolations for 3D card flipping
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const handleFlipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleAdvance = () => {
    // Reset flip
    if (isFlipped) {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
      setIsFlipped(false);
    }

    if (index < vocabItems.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setSessionComplete(true);
    }
  };

  const handleFinish = () => {
    completeLesson(currentLesson.id, currentLesson.xpReward || 15);
    router.back();
  };

  const progressPct = vocabItems.length > 0 ? `${((index + 1) / vocabItems.length) * 100}%` : "0%";

  if (sessionComplete) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center p-6 gap-6">
          <Image
            source={images.treasure}
            className="w-48 h-48 mb-2"
            contentFit="contain"
          />
          <Text className="font-poppins-bold text-[28px] text-[#001328] text-center">
            Review Complete!
          </Text>
          <Text className="font-poppins-medium text-[15px] text-text-secondary text-center px-4 leading-6">
            Fantastic job! You&apos;ve mastered {vocabItems.length} vocabulary words in this lesson topic.
          </Text>

          <View className="bg-[#FAF9FF] border border-[#ECE8FF] rounded-[24px] p-5 w-full flex-row items-center justify-around mt-4">
            <View className="items-center">
              <Text className="font-poppins-bold text-[24px] text-[#6C4EF5]">+{currentLesson.xpReward || 15}</Text>
              <Text className="font-poppins-medium text-[12px] text-text-secondary">XP Reward</Text>
            </View>
            <View className="w-[1px] h-10 bg-gray-200" />
            <View className="items-center">
              <Text className="font-poppins-bold text-[24px] text-[#22C55E]">100%</Text>
              <Text className="font-poppins-medium text-[12px] text-text-secondary">Accuracy</Text>
            </View>
          </View>

          <Pressable
            onPress={handleFinish}
            className="w-full bg-[#6C4EF5] py-4 rounded-[24px] items-center justify-center active:bg-[#583cc7] shadow-sm mt-6 border-b-4 border-[#4c35b5]"
          >
            <Text className="font-poppins-bold text-white text-[16px]">Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const activeWord = vocabItems[index] || vocabItems[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top", "bottom"]}>
      {/* Top Header */}
      <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center active:bg-gray-50"
        >
          <Feather name="x" size={22} color="#001328" />
        </Pressable>

        {/* Progress Bar */}
        <View className="flex-1 mx-4 h-3 bg-surface rounded-full overflow-hidden border border-border/20">
          <View style={{ width: progressPct as any }} className="h-full bg-[#6C4EF5] rounded-full" />
        </View>

        <View className="flex-row items-center gap-1.5 bg-surface px-3 py-1.5 rounded-full border border-border/40">
          <Ionicons name="flash" size={16} color="#6C4EF5" />
          <Text className="font-poppins-bold text-[12px] text-[#001328]">
            {index + 1}/{vocabItems.length}
          </Text>
        </View>
      </View>

      {/* Main Flashcard Container */}
      <View className="flex-1 justify-center px-6 my-6">
        <Pressable onPress={handleFlipCard} className="w-full aspect-[4/5] relative">
          {/* Card Front */}
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              { transform: [{ rotateY: frontInterpolate }] },
            ]}
          >
            <View className="flex-1 w-full justify-between items-center p-6">
              <View className="bg-[#FAF0FF] px-3.5 py-1 rounded-md self-start border border-[#F0D5FF]">
                <Text className="font-poppins-bold text-[11px] text-[#6C4EF5] uppercase tracking-wide">
                  {activeWord.partOfSpeech || "Vocabulary"}
                </Text>
              </View>

              <View className="items-center">
                <Text className="font-poppins-bold text-[36px] text-center text-[#001328] mb-4">
                  {activeWord.word}
                </Text>
                
                {/* Pronunciation guide */}
                {activeWord.pronunciation && (
                  <Text className="font-poppins-semibold text-[16px] text-[#6C4EF5] text-center bg-[#F3F0FF] px-4 py-1.5 rounded-full">
                    {activeWord.pronunciation}
                  </Text>
                )}
              </View>

              {/* Tap to Flip prompt */}
              <View className="flex-row items-center gap-2 bg-surface px-5 py-2.5 rounded-full border border-border/50">
                <Feather name="rotate-cw" size={14} color="#6B7280" />
                <Text className="font-poppins-semibold text-[13px] text-text-secondary">
                  Tap card to flip
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Card Back */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { transform: [{ rotateY: backInterpolate }] },
            ]}
          >
            <View className="flex-1 w-full justify-between p-6">
              <View className="flex-row justify-between items-center border-b border-gray-100 pb-3">
                <View className="bg-[#FAF0FF] px-3 py-1 rounded-md border border-[#F0D5FF]">
                  <Text className="font-poppins-bold text-[10px] text-[#6C4EF5] uppercase tracking-wide">
                    {activeWord.partOfSpeech || "Vocabulary"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="volume-medium" size={16} color="#6C4EF5" />
                  <Text className="font-poppins-semibold text-[12px] text-[#6C4EF5]">Audio ready</Text>
                </View>
              </View>

              {/* Translations details */}
              <View className="py-2">
                <Text className="font-poppins-medium text-[13px] text-text-secondary">Translation</Text>
                <Text className="font-poppins-bold text-[28px] text-[#001328] mt-0.5">
                  {activeWord.translation}
                </Text>
              </View>

              {/* Example sentences */}
              {activeWord.exampleSentence && (
                <View className="bg-surface p-4 rounded-2xl border border-border/50 gap-2">
                  <Text className="font-poppins-bold text-[11px] text-text-secondary uppercase tracking-wider">
                    Context Example:
                  </Text>
                  <Text className="font-poppins-semibold text-[15px] text-[#001328]">
                    {activeWord.exampleSentence}
                  </Text>
                  <Text className="font-poppins-medium text-[13px] text-text-secondary">
                    {activeWord.exampleTranslation}
                  </Text>
                </View>
              )}

              {/* Flip back link */}
              <View className="items-center mt-2">
                <Text className="font-poppins-semibold text-[12px] text-[#6C4EF5]">
                  Tap to flip back
                </Text>
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </View>

      {/* Action Footer */}
      <View className="border-t border-gray-100 p-6 bg-white flex-row items-center gap-4">
        <Pressable
          onPress={handleFlipCard}
          className="flex-1 bg-[#F9FAFB] py-4 rounded-[22px] border border-gray-200 items-center justify-center active:bg-gray-100"
        >
          <Text className="font-poppins-semibold text-text-secondary text-[15px]">
            {isFlipped ? "Show Word" : "Show Translation"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleAdvance}
          className="flex-1 bg-[#6C4EF5] py-4 rounded-[22px] items-center justify-center active:bg-[#583cc7] border-b-4 border-[#4c35b5] shadow-sm"
        >
          <Text className="font-poppins-bold text-white text-[15px]">Got It!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    backfaceVisibility: "hidden",
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    transform: [{ rotateY: "180deg" }],
    zIndex: 1,
  },
});
