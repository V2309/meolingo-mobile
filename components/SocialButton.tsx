import React from "react";
import { Pressable, Text, View } from "@/components/tw";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

interface SocialButtonProps {
  provider: "google" | "facebook" | "apple";
  onPress?: () => void;
}

export function SocialButton({ provider, onPress }: SocialButtonProps) {
  const getProviderDetails = () => {
    switch (provider) {
      case "google":
        return {
          icon: <AntDesign name="google" size={20} color="#EA4335" />,
          label: "Continue with Google",
        };
      case "facebook":
        return {
          icon: <FontAwesome name="facebook" size={20} color="#1877F2" />,
          label: "Continue with Facebook",
        };
      case "apple":
        return {
          icon: <FontAwesome name="apple" size={20} color="#000000" />,
          label: "Continue with Apple",
        };
    }
  };

  const { icon, label } = getProviderDetails();

  return (
    <Pressable
      onPress={onPress}
      className="relative flex-row items-center justify-center border border-border rounded-[16px] py-4 bg-white active:bg-surface shadow-sm"
    >
      <View className="absolute left-5">
        {icon}
      </View>
      <Text className="font-poppins-semibold text-text-primary text-[15px]">
        {label}
      </Text>
    </Pressable>
  );
}
