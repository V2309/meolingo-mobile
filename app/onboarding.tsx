import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, Pressable } from "@/components/tw";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { posthog } from "@/constants/posthog";

export default function Onboarding() {
  const router = useRouter();

  const handleGetStarted = () => {
    posthog?.capture("onboarding_started");
    router.push("/sign-up");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 px-6 justify-between pb-8 pt-4">
        {/* Header Branding */}
        <View className="flex-row items-center justify-center gap-2 mt-2">
          <Image
            source={images.mascotLogo}
            className="w-10 h-10"
            contentFit="contain"
          />
          <Text className="text-2xl font-poppins-bold text-text-primary">
            Meolingo
          </Text>
        </View>

        {/* Text/Hero Section */}
        <View className="mt-8">
          <Text className="h1 text-left leading-[38px] tracking-tight">
            Your AI language{"\n"}
            <Text className="text-lingua-purple">teacher</Text>
            <Text className="text-text-primary">.</Text>
          </Text>
          <Text className="body-lg text-text-secondary mt-3">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot & Custom Speech Bubbles Container */}
        <View className="flex-1 justify-center items-center my-6">
          <View className="relative w-full aspect-square max-w-[340px] items-center justify-center">
            {/* Mascot Image */}
            <Image
              source={images.mascotWelcome}
              className="w-[250px] h-[250px]"
              contentFit="contain"
            />

            {/* Speech Bubble: Hello! */}
            <View className="absolute top-[35px] left-0 bg-[#e6f2ff] px-4 py-2 rounded-2xl shadow-sm">
              <Text className="font-poppins-semibold text-text-primary text-[15px]">
                Hello!
              </Text>
              <View className="absolute bottom-[-4px] right-[24px] w-3 h-3 bg-[#e6f2ff] rotate-45" />
            </View>

            {/* Speech Bubble: ¡Hola! */}
            <View className="absolute top-[10px] right-[10px] bg-[#f0edff] px-4 py-2 rounded-2xl shadow-sm">
              <Text className="font-poppins-semibold text-lingua-purple text-[15px]">
                ¡Hola!
              </Text>
              <View className="absolute bottom-[-4px] left-[24px] w-3 h-3 bg-[#f0edff] rotate-45" />
            </View>

            {/* Speech Bubble: 你好! */}
            <View className="absolute top-[125px] right-[5px] bg-[#fff2eb] px-4 py-2 rounded-2xl shadow-sm">
              <Text className="font-poppins-semibold text-error text-[15px]">
                你好!
              </Text>
              <View className="absolute bottom-[-4px] left-[20px] w-3 h-3 bg-[#fff2eb] rotate-45" />
            </View>
          </View>
        </View>

        {/* Bottom CTA Button */}
        <View className="w-full pb-4">
          <Pressable
            onPress={handleGetStarted}
            className="bg-lingua-purple py-4 rounded-2xl items-center justify-center flex-row relative active:bg-lingua-deep-purple"
          >
            <Text className="text-white font-poppins-semibold text-lg">
              Get Started
            </Text>
            <View className="absolute right-6">
              <Feather name="chevron-right" size={24} color="#FFFFFF" />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
