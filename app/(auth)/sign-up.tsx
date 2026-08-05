import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, Modal, StyleSheet, TextInput as RNTextInput, Alert } from "react-native";
import { View, Text, Image, Pressable, ScrollView, TextInput } from "@/components/tw";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SocialButton } from "@/components/SocialButton";
import { useSignUp, useSSO } from "@clerk/expo";
import { posthog } from "@/constants/posthog";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [code, setCode] = useState("");

  const { signUp, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const inputRef = useRef<RNTextInput>(null);

  // Focus the input when the modal is shown
  useEffect(() => {
    if (showVerificationModal) {
      // Small timeout to ensure modal is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCode("");
    }
  }, [showVerificationModal]);

  const handleSignUp = async () => {
    if (!email || !password) return;
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) {
      Alert.alert("Sign Up Error", error.message);
      return;
    }
    const { error: codeError } = await signUp.verifications.sendEmailCode();
    if (codeError) {
      Alert.alert("Sign Up Error", codeError.message);
      return;
    }
    posthog?.capture("sign_up_verification_requested", {
      auth_method: "email_password",
    });
    setShowVerificationModal(true);
  };

  const handleCodeChange = async (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setCode(numericText);
    if (numericText.length === 6) {
      const { error } = await signUp.verifications.verifyEmailCode({ code: numericText });
      if (error) {
        Alert.alert("Verification Error", error.message);
        setCode("");
        return;
      }
      if (signUp.status === "complete") {
        setShowVerificationModal(false);
        await signUp.finalize();
        posthog?.capture("sign_up_completed", {
          auth_method: "email_password",
        });
      }
    }
  };

  const handleResendCode = async () => {
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      Alert.alert("Resend Error", error.message);
    } else {
      Alert.alert("Success", "Verification code has been resent to your email.");
    }
  };

  const handleSocialAuth = async (provider: "google" | "facebook" | "apple") => {
    try {
      const { createdSessionId, setActive, signUp } = await startSSOFlow({
        strategy: `oauth_${provider}`,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        posthog?.capture("sign_up_sso_completed", {
          auth_method: "sso",
          provider,
        });
      } else if (signUp?.status === "missing_requirements") {
        Alert.alert("Missing Requirements", "Additional fields are required to sign up.");
      }
    } catch (err: any) {
      console.error(`${provider} auth error:`, err);
      if (err?.code !== "session_verification_cancelled" && err?.message !== "canceled") {
        Alert.alert("Authentication Error", err.message || "Something went wrong.");
      }
    }
  };

  const isSubmitting = fetchStatus === "fetching";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-grow bg-white"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Bar */}
          <View className="flex-row items-center mt-2 mb-4">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full active:bg-surface"
            >
              <Feather name="arrow-left" size={24} color="#001328" />
            </Pressable>
          </View>

          {/* Titles */}
          <View className="mb-2">
            <Text className="h1 text-text-primary text-left">Create your account</Text>
            <Text className="body-lg text-text-secondary text-left mt-2">
              Start your language journey today ✨
            </Text>
          </View>

          {/* Fox Mascot */}
          <View className="items-center my-4">
            <Image
              source={images.mascotAuth}
              className="w-[180px] h-[150px]"
              contentFit="contain"
            />
          </View>

          {/* Inputs Section */}
          <View className="mb-4">
            {/* Email Field */}
            <View className="border border-border rounded-[20px] px-5 py-3 mb-4 bg-white shadow-sm">
              <Text className="caption text-text-secondary mb-1">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                className="font-poppins-semibold text-text-primary text-[15px] p-0 m-0 h-6"
                placeholder="alex@gmail.com"
                placeholderTextColor="#A3A3A3"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>

            {/* Password Field */}
            <View className="border border-border rounded-[20px] px-5 py-3 mb-4 bg-white shadow-sm flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="caption text-text-secondary mb-1">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  className="font-poppins-semibold text-text-primary text-[15px] p-0 m-0 h-6"
                  placeholder="•••••••••"
                  placeholderTextColor="#A3A3A3"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
              </View>
              <Pressable onPress={() => setShowPassword(!showPassword)} className="p-1">
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6b7280" />
              </Pressable>
            </View>
          </View>

          {/* Captcha mount point for bot protection */}
          <View nativeID="clerk-captcha" />

          {/* Sign Up Primary Button */}
          <Pressable
            onPress={handleSignUp}
            className={`py-4 rounded-[16px] items-center justify-center shadow-sm ${
              email && password && !isSubmitting ? "bg-lingua-purple active:bg-lingua-deep-purple" : "bg-lingua-purple/65"
            }`}
            disabled={!email || !password || isSubmitting}
          >
            <Text className="text-white font-poppins-semibold text-[17px]">
              {isSubmitting ? "Please wait..." : "Sign Up"}
            </Text>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="mx-4 text-xs font-poppins text-text-secondary">
              or continue with
            </Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          {/* Social Logins */}
          <View className="gap-3">
            <SocialButton provider="google" onPress={() => handleSocialAuth("google")} />
            <SocialButton provider="facebook" onPress={() => handleSocialAuth("facebook")} />
            <SocialButton provider="apple" onPress={() => handleSocialAuth("apple")} />
          </View>

          {/* Footer Navigation */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="body-md text-text-secondary font-poppins">
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/sign-in")}>
              <Text className="body-md text-lingua-purple font-poppins-semibold">
                Log in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verification Modal */}
      <Modal
        visible={showVerificationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            className="bg-black/50 justify-center items-center px-6"
            onPress={() => setShowVerificationModal(false)}
          >
            <Pressable
              className="bg-white rounded-[24px] p-6 w-full max-w-[340px] items-center shadow-lg relative"
              onPress={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Pressable
                onPress={() => setShowVerificationModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full active:bg-surface"
              >
                <Feather name="x" size={20} color="#6b7280" />
              </Pressable>

              {/* Envelope Icon */}
              <View className="w-16 h-16 bg-lingua-purple/10 rounded-full justify-center items-center mb-4 mt-2">
                <Feather name="mail" size={30} color="#6c4ef5" />
              </View>

              {/* Title */}
              <Text className="h3 text-text-primary text-center">Verify your email</Text>

              {/* Subtitle */}
              <Text className="body-sm text-text-secondary text-center mt-2 mb-4">
                We sent a 6-digit code to{"\n"}
                <Text className="font-poppins-bold text-text-primary">{email || "your email"}</Text>
              </Text>

              {/* 6 Boxes Code Row */}
              <Pressable
                onPress={() => inputRef.current?.focus()}
                className="flex-row justify-between w-full gap-2 my-4"
              >
                {Array(6)
                  .fill(0)
                  .map((_, index) => {
                    const digit = code[index] || "";
                    const isFocused = index === code.length;
                    return (
                      <View
                        key={index}
                        className={`w-11 h-14 border-2 rounded-2xl justify-center items-center bg-surface ${
                          isFocused ? "border-lingua-purple bg-white animate-pulse" : "border-border"
                        }`}
                      >
                        <Text className="text-xl font-poppins-bold text-text-primary">
                          {digit}
                        </Text>
                      </View>
                    );
                  })}
              </Pressable>

              {/* Hidden Input */}
              <RNTextInput
                ref={inputRef}
                value={code}
                onChangeText={handleCodeChange}
                maxLength={6}
                keyboardType="number-pad"
                style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
              />

              {/* Help Text */}
              <Text className="caption text-text-secondary text-center mt-2">
                {"Didn't receive the email? "}
                <Text onPress={handleResendCode} className="font-poppins-semibold text-lingua-purple">Resend code</Text>
              </Text>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
