import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/components/tw";
import { useAuth, useUser } from "@clerk/expo";
import { posthog } from "@/constants/posthog";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    posthog?.capture("user_signed_out");
    posthog?.reset();
    await signOut();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center p-6 bg-white gap-4">
        <Text className="h2 text-text-primary text-center">Profile Screen</Text>
        {user && (
          <Text className="body-md text-text-secondary text-center">
            {user.primaryEmailAddress?.emailAddress}
          </Text>
        )}
        <Pressable
          onPress={handleSignOut}
          className="bg-error/10 border border-error/20 px-4 py-2 rounded-xl active:bg-error/20"
        >
          <Text className="font-poppins-semibold text-error text-sm">
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
