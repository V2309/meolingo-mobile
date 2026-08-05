import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, ScrollView, TextInput, Image } from "@/components/tw";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLearningStore } from "@/store/learningStore";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Alert } from "react-native";
import { posthog } from "@/constants/posthog";

export default function ChooseLanguage() {
  const router = useRouter();
  const { selectedLanguageId, setSelectedLanguageId } = useLearningStore();
  
  // Set default selected language to Spanish (or the currently stored one if exists)
  const [selectedId, setSelectedId] = useState<string>(selectedLanguageId || "es");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter languages based on search query
  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLanguage = (id: string, isActive: boolean) => {
    if (!isActive) {
      Alert.alert("Coming Soon", `${languages.find(l => l.id === id)?.name} is under development. We'll launch it very soon! 🚀`);
      return;
    }
    setSelectedId(id);
  };

  const handleConfirm = () => {
    if (!selectedId) {
      Alert.alert("Error", "Please select a language to continue.");
      return;
    }
    setSelectedLanguageId(selectedId);
    posthog?.capture("learning_language_selected", {
      language_id: selectedId,
    });
    router.replace("/" as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-surface"
        >
          <Feather name="chevron-left" size={28} color="#001328" />
        </Pressable>
        <Text className="font-poppins-semibold text-text-primary text-[19px]">
          Choose a language
        </Text>
        <View className="w-10" />
      </View>

      {/* Search Input */}
      <View className="flex-row items-center bg-surface border border-border px-4 py-3 rounded-2xl mx-6 mt-4 gap-3 shadow-sm">
        <Feather name="search" size={20} color="#9CA3AF" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 font-poppins text-text-primary text-[15px] p-0 m-0 h-6"
          placeholder="Search languages"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Feather name="x" size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </View>

      {/* Section Heading */}
      <Text className="font-poppins-bold text-text-primary text-lg mx-6 mt-6 mb-3">
        Popular
      </Text>

      {/* Languages List (Scrollable) */}
      <ScrollView 
        className="flex-1"
        contentContainerClassName="pb-4"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-3">
          {filteredLanguages.map((lang) => {
            const isSelected = selectedId === lang.id;
            return (
              <Pressable
                key={lang.id}
                onPress={() => handleSelectLanguage(lang.id, lang.isActive)}
                className={`mx-6 p-4 rounded-2xl flex-row items-center justify-between border ${
                  isSelected 
                    ? "border-lingua-purple bg-lingua-purple/5" 
                    : "border-border bg-white"
                } ${!lang.isActive ? "opacity-60" : ""}`}
              >
                <View className="flex-row items-center gap-4">
                  {/* Round Flag */}
                  <Image
                    source={{ uri: lang.flagEmoji }}
                    className="w-12 h-12 rounded-full border border-border bg-surface"
                    contentFit="cover"
                  />
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Text className="font-poppins-semibold text-text-primary text-[15px]">
                        {lang.name}
                      </Text>
                      {!lang.isActive && (
                        <View className="bg-warning/10 border border-warning/20 px-2 py-0.5 rounded-full">
                          <Text className="font-poppins-medium text-warning text-[10px]">
                            Soon
                          </Text>
                        </View>
                      )}
                    </View>
                    {lang.learnersCount ? (
                      <Text className="caption text-text-secondary mt-0.5">
                        {lang.learnersCount}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Right Indicator */}
                {isSelected ? (
                  <View className="w-6 h-6 rounded-full bg-lingua-purple items-center justify-center">
                    <Feather name="check" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <Feather name="chevron-right" size={20} color="#9CA3AF" />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom CTA Button */}
      <View className="px-6 my-4">
        <Pressable
          onPress={handleConfirm}
          className="bg-lingua-purple py-4 rounded-2xl items-center justify-center active:bg-lingua-deep-purple shadow-sm"
        >
          <Text className="text-white font-poppins-semibold text-lg">
            Confirm Selection
          </Text>
        </Pressable>
      </View>

      {/* Bottom Earth Illustration */}
      <Image
        source={images.earth}
        className="w-full h-[130px]"
        contentFit="cover"
      />
    </SafeAreaView>
  );
}
