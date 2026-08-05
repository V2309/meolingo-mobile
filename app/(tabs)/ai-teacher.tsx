import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "@/components/tw";

export default function AITeacherScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center p-6 bg-white">
        <Text className="h2 text-text-primary text-center">AI Teacher Screen</Text>
        <Text className="body-md text-text-secondary text-center mt-2">
          Practice video calls with your AI teacher.
        </Text>
      </View>
    </SafeAreaView>
  );
}
