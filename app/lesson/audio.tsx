import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, Pressable } from "@/components/tw";
import { ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { images } from "@/constants/images";
import { lessons } from "@/data/lessons";
import { languages } from "@/data/languages";
import { useLearningStore } from "@/store/learningStore";
import { DIALOG_SCRIPTS } from "@/data/audioDialogs";
import { useAuth, useUser } from "@clerk/expo";
import Constants from "expo-constants";

import type { StreamVideoClient, Call } from "@stream-io/video-react-native-sdk";

// Lazy loaded imports to prevent crashing in Expo Go
let StreamVideo: any;
let StreamVideoClientClass: any;
let StreamCall: any;
let useCall: any;
let useCallStateHooks: any;
let CallingState: any;

const loadStreamSDK = () => {
  if (!StreamVideo) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const SDK = require("@stream-io/video-react-native-sdk");
    StreamVideo = SDK.StreamVideo;
    StreamVideoClientClass = SDK.StreamVideoClient;
    StreamCall = SDK.StreamCall;
    useCall = SDK.useCall;
    useCallStateHooks = SDK.useCallStateHooks;
    CallingState = SDK.CallingState;
  }
};

// Helper to resolve absolute backend URL on native devices/simulators
const getApiUrl = (path: string) => {
  if (typeof window !== "undefined" && window.location) {
    return path;
  }
  const host = Constants.expoConfig?.hostUri?.split(":")[0] || "localhost";
  return `http://${host}:8081${path}`;
};

export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { selectedLanguageId, completeLesson } = useLearningStore();
  const { getToken } = useAuth();
  const { user } = useUser();

  // Find target lesson or default to first audio lesson
  const currentLesson =
    lessons.find((l) => l.id === id) ||
    lessons.find((l) => l.type === "audio-lesson") ||
    lessons[1];

  // Current language details
  const currentLanguage =
    languages.find((l) => l.id === selectedLanguageId) || languages[0];

  const langCode = (selectedLanguageId || "es") as keyof typeof DIALOG_SCRIPTS;
  const dialogTurns = DIALOG_SCRIPTS[langCode] || DIALOG_SCRIPTS.es;

  const isExpoGo = Constants.appOwnership === "expo";

  // Stream video client and call references
  const [streamClient, setStreamClient] = useState<StreamVideoClient | null>(null);
  const [streamCall, setStreamCall] = useState<Call | null>(null);
  const [status, setStatus] = useState<"loading" | "connecting" | "joined" | "error" | "ended">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Audio interaction local states
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);

  const streamCallRef = useRef<Call | null>(null);

  // Initialize Call connection
  const initializeCall = React.useCallback(async () => {
    if (isExpoGo) return;
    setStatus("loading");
    setErrorMsg(null);
    try {
      // Lazy load SDK to prevent compilation/require time failures in Expo Go
      loadStreamSDK();

      const clerkToken = await getToken();
      if (!clerkToken) {
        throw new Error("Clerk authentication token could not be retrieved.");
      }

      // Fetch Stream connection token and session parameters from our serverless route
      const apiUrl = getApiUrl("/api/stream-call");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clerkToken}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          lessonId: currentLesson.id,
          languageId: currentLanguage.id,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to initialize call session.");
      }

      const data = await response.json();

      // Setup user details
      const clientUser = {
        id: data.streamUserId,
        name: user?.fullName || data.streamUserId,
        image: user?.imageUrl,
      };

      // Get or create Stream Video client singleton
      const client = StreamVideoClientClass.getOrCreateInstance({
        apiKey: data.apiKey,
        user: clientUser,
        tokenProvider: async () => data.token,
      });

      setStreamClient(client);

      // Create call session using the same call id
      const call = client.call(data.callType, data.callId, { reuseInstance: true });
      streamCallRef.current = call;
      setStreamCall(call);

      // Set connection timeout (seconds)
      call.setDisconnectionTimeout(120);

      // Join call session
      setStatus("connecting");
      await call.join({ create: true });

      setStatus("joined");
    } catch (err: any) {
      console.error("Failed to connect to audio lesson call:", err);
      setErrorMsg(err.message || "Unable to establish call connection.");
      setStatus("error");
    }
  }, [user?.id, user?.fullName, user?.imageUrl, currentLesson.id, currentLanguage.id, getToken, isExpoGo]);

  useEffect(() => {
    if (isExpoGo) {
      setStatus("error");
      return;
    }

    if (user?.id) {
      initializeCall();
    }

    return () => {
      // Cleanup: leave call when screen is dismissed/unmounted
      const call = streamCallRef.current;
      if (call && call.state.callingState !== CallingState?.LEFT) {
        call.leave().catch((err: any) => console.error("Error leaving call on unmount:", err));
      }
    };
  }, [user?.id, initializeCall, isExpoGo]);

  // Handle ending the call session manually
  const handleEndCall = async () => {
    try {
      if (streamCall && streamCall.state.callingState !== CallingState?.LEFT) {
        await streamCall.leave();
      }
    } catch (e) {
      console.error("Error while leaving call:", e);
    }
    setStatus("ended");
  };

  // Complete lesson, award XP and go back
  const handleFinishLesson = () => {
    completeLesson(currentLesson.id, 10); // Reward 10 XP
    router.back();
  };

  // Expo Go Fallback View (graceful prompt without app crash)
  if (isExpoGo) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center p-6 bg-[#F9FAFB]">
          <View className="w-16 h-16 rounded-full bg-[#F3F0FF] items-center justify-center mb-4">
            <Feather name="info" size={32} color="#6C4EF5" />
          </View>
          <Text className="font-poppins-bold text-[22px] text-[#001328] text-center mt-2 px-4">
            Development Build Required
          </Text>
          <Text className="font-poppins-medium text-[15px] text-[#6B7280] text-center mt-3 px-6 leading-6">
            GetStream audio calling requires WebRTC native modules which are not supported by the default Expo Go client.
          </Text>
          
          <View className="bg-white border border-gray-200 rounded-[28px] p-6 mt-8 w-full shadow-sm">
            <Text className="font-poppins-semibold text-[14px] text-[#374151] mb-3">
              To test this feature, build the app locally:
            </Text>
            <View className="gap-2.5">
              <Text className="font-poppins-medium text-[13px] text-[#6B7280]">
                1. Run <Text className="font-mono text-[#6C4EF5] bg-[#F3F0FF] px-2 py-1 rounded-md text-[12px]">npx expo prebuild</Text>
              </Text>
              <Text className="font-poppins-medium text-[13px] text-[#6B7280]">
                2. Run <Text className="font-mono text-[#6C4EF5] bg-[#F3F0FF] px-2 py-1 rounded-md text-[12px]">npm run ios</Text> or <Text className="font-mono text-[#6C4EF5] bg-[#F3F0FF] px-2 py-1 rounded-md text-[12px]">npm run android</Text>
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.back()}
            className="mt-10 bg-gray-900 w-full py-4 rounded-[20px] active:bg-black items-center justify-center shadow-sm"
          >
            <Text className="font-poppins-semibold text-white text-[15px]">
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!streamClient || !streamCall) {
    // Render outer skeleton container while loading SDK client
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center p-6">
          <ActivityIndicator size="large" color="#6C4EF5" />
          <Text className="font-poppins-semibold text-[16px] text-[#4B5563] mt-4 text-center">
            Loading AI Classroom...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <StreamVideo client={streamClient}>
      <StreamCall call={streamCall}>
        <AudioLessonInner
          status={status}
          errorMsg={errorMsg}
          onRetry={initializeCall}
          onEndCall={handleEndCall}
          onFinishLesson={handleFinishLesson}
          currentTurnIndex={currentTurnIndex}
          setCurrentTurnIndex={setCurrentTurnIndex}
          isCameraOn={isCameraOn}
          setIsCameraOn={setIsCameraOn}
          showSubtitles={showSubtitles}
          setShowSubtitles={setShowSubtitles}
          dialogTurns={dialogTurns}
          currentLesson={currentLesson}
          currentLanguage={currentLanguage}
          user={user}
        />
      </StreamCall>
    </StreamVideo>
  );
}

// Inner Component to consume Stream Call Context & Hooks
function AudioLessonInner({
  status,
  errorMsg,
  onRetry,
  onEndCall,
  onFinishLesson,
  currentTurnIndex,
  setCurrentTurnIndex,
  isCameraOn,
  setIsCameraOn,
  showSubtitles,
  setShowSubtitles,
  dialogTurns,
  currentLesson,
  currentLanguage,
  user,
}: {
  status: "loading" | "connecting" | "joined" | "error" | "ended";
  errorMsg: string | null;
  onRetry: () => void;
  onEndCall: () => void;
  onFinishLesson: () => void;
  currentTurnIndex: number;
  setCurrentTurnIndex: React.Dispatch<React.SetStateAction<number>>;
  isCameraOn: boolean;
  setIsCameraOn: (val: boolean) => void;
  showSubtitles: boolean;
  setShowSubtitles: (val: boolean) => void;
  dialogTurns: any[];
  currentLesson: any;
  currentLanguage: any;
  user: any;
}) {
  // Stream state hooks
  const call = useCall();
  const { useMicrophoneState, useCallCallingState } = useCallStateHooks();
  const micState = useMicrophoneState();
  const callingState = useCallCallingState();

  const isMicRealOn = micState.status === "enabled";

  const turn = dialogTurns[currentTurnIndex % dialogTurns.length];

  const handleNextTurn = () => {
    setCurrentTurnIndex((prev) => (prev + 1) % dialogTurns.length);
  };

  const handleMicToggle = async () => {
    if (call) {
      await call.microphone.toggle();
    }
  };

  // Map calling state to header sub-label
  const getHeaderStatusText = () => {
    if (status === "loading") return "Initializing...";
    if (status === "connecting" || callingState === CallingState.JOINING) return "Connecting...";
    if (callingState === CallingState.RECONNECTING) return "Reconnecting...";
    if (callingState === CallingState.LEFT || status === "ended") return "Disconnected";
    if (isMicRealOn) return "Joined Call";
    return "Muted";
  };

  const getHeaderStatusColor = () => {
    if (status === "loading" || status === "connecting" || callingState === CallingState.JOINING || callingState === CallingState.RECONNECTING) {
      return "bg-yellow-500";
    }
    if (callingState === CallingState.LEFT || status === "ended") {
      return "bg-red-500";
    }
    if (isMicRealOn) return "bg-[#22C55E]";
    return "bg-gray-400";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top", "bottom"]}>
      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3 bg-white">
        <Pressable
          onPress={onEndCall}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
        >
          <Feather name="chevron-left" size={28} color="#001328" />
        </Pressable>

        <View className="items-start flex-1 ml-2">
          <Text className="font-poppins-bold text-[18px] text-[#001328]">
            AI Teacher
          </Text>
          <View className="flex-row items-center mt-0.5">
            <View className={`w-2.5 h-2.5 rounded-full ${getHeaderStatusColor()} mr-1.5`} />
            <Text className="font-poppins-medium text-[13px] text-[#6B7280]">
              {getHeaderStatusText()}
            </Text>
          </View>
        </View>

        {/* Right Header Status Badges & User Avatar */}
        <View className="flex-row items-center gap-2">
          <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
            <Feather name={isCameraOn ? "video" : "video-off"} size={17} color="#374151" />
          </View>
          <View className="h-9 px-3 rounded-full bg-gray-100 items-center justify-center">
            <Text className="font-poppins-semibold text-[13px] text-[#374151]">
              Audio
            </Text>
          </View>
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="w-9 h-9 rounded-full border border-gray-200"
              contentFit="cover"
            />
          ) : (
            <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
              <Feather name="user" size={17} color="#374151" />
            </View>
          )}
        </View>
      </View>

      {/* Main Full-Height Container */}
      <View className="flex-1 px-4 pb-4">
        {/* Main Stage Card Container (Fills Available Height) */}
        <View className="flex-1 w-full rounded-[36px] bg-[#E8DCC4] overflow-hidden relative border border-gray-100 shadow-md">
          {/* Background Scene / Ambiance */}
          <Image
            source={images.mascotCafe}
            className="w-full h-full opacity-40 absolute inset-0"
            contentFit="cover"
          />

          {/* Student PIP Box (Top Right Overlay) */}
          {isCameraOn && (
            <View className="absolute top-4 right-4 w-[96px] h-[120px] rounded-[22px] overflow-hidden border-2 border-white/90 bg-[#D4E8DC] shadow-lg z-20 items-center justify-center">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-full h-full"
                  contentFit="cover"
                />
              ) : (
                <Image
                  source={images.mascotWelcome}
                  className="w-full h-full"
                  contentFit="contain"
                />
              )}
              {/* Mic Status Indicator overlay in PIP Box */}
              <View className={`absolute bottom-2 right-2 rounded-full p-1 border border-white ${isMicRealOn ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}>
                <Feather name={isMicRealOn ? "mic" : "mic-off"} size={10} color="white" />
              </View>
            </View>
          )}

          {/* Main Mascot Teacher (Center Screen) */}
          <View className="absolute top-8 left-0 right-0 items-center justify-center z-10">
            <Image
              source={images.mascotWelcome}
              className="w-[280px] h-[280px]"
              contentFit="contain"
            />
          </View>

          {/* Render States (Loading, Connecting, Error, Ended, Active Joined) */}
          {status === "loading" && (
            <View className="absolute inset-0 bg-black/45 z-30 items-center justify-center p-6">
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text className="font-poppins-bold text-[18px] text-white mt-4 text-center">
                Initializing Session...
              </Text>
              <Text className="font-poppins-medium text-[14px] text-gray-200 mt-2 text-center">
                Connecting to AI language teacher service
              </Text>
            </View>
          )}

          {status === "connecting" && (
            <View className="absolute inset-0 bg-black/45 z-30 items-center justify-center p-6">
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text className="font-poppins-bold text-[18px] text-white mt-4 text-center">
                Calling AI Teacher...
              </Text>
              <Text className="font-poppins-medium text-[14px] text-gray-200 mt-2 text-center">
                Setting up real-time audio connection
              </Text>
            </View>
          )}

          {status === "error" && (
            <View className="absolute inset-0 bg-black/60 z-30 items-center justify-center p-6">
              <Feather name="alert-triangle" size={54} color="#EF4444" />
              <Text className="font-poppins-bold text-[18px] text-white mt-4 text-center">
                Connection Failed
              </Text>
              <Text className="font-poppins-medium text-[14px] text-gray-300 mt-2 text-center px-4 leading-5">
                {errorMsg || "An error occurred while connecting to the Stream server."}
              </Text>
              <Pressable
                onPress={onRetry}
                className="mt-6 bg-[#6C4EF5] px-6 py-3 rounded-full active:bg-[#583cc7]"
              >
                <Text className="font-poppins-semibold text-white text-[14px]">
                  Retry Connection
                </Text>
              </Pressable>
            </View>
          )}

          {status === "ended" && (
            <View className="absolute inset-0 bg-[#FFFFFF] z-30 items-center justify-center p-6">
              <Image
                source={images.mascotWelcome}
                className="w-40 h-40 mb-2"
                contentFit="contain"
              />
              <Text className="font-poppins-bold text-[24px] text-[#001328] text-center mt-2">
                Lesson Completed!
              </Text>
              <Text className="font-poppins-medium text-[15px] text-[#6B7280] text-center mt-2 px-8 leading-6">
                Excellent job practicing your {currentLanguage.name} speaking today. Keep up the good work!
              </Text>

              {/* XP Reward Card */}
              <View className="mt-6 flex-row items-center bg-[#FEF3C7] px-6 py-3 rounded-2xl border border-[#FDE68A]">
                <Image
                  source={images.streakFire}
                  className="w-7 h-7 mr-2"
                  contentFit="contain"
                />
                <Text className="font-poppins-bold text-[18px] text-[#D97706]">
                  +10 XP Reward
                </Text>
              </View>

              <Pressable
                onPress={onFinishLesson}
                className="mt-8 bg-[#6C4EF5] w-full py-4 rounded-[20px] shadow-sm active:bg-[#583cc7] items-center justify-center"
              >
                <Text className="font-poppins-semibold text-white text-[16px]">
                  Claim Reward & Continue
                </Text>
              </Pressable>
            </View>
          )}

          {/* Speech Bubble & Action Controls Container positioned at bottom */}
          {status === "joined" && (
            <View className="absolute bottom-5 left-4 right-4 z-20 gap-4">
              {/* Teacher Speech / Response Bubble */}
              <Pressable
                onPress={handleNextTurn}
                className="bg-white rounded-[24px] p-5 shadow-lg border border-gray-100 relative active:opacity-95"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    {showSubtitles && (
                      <Text className="font-poppins-bold text-[17px] text-[#1F2937] mb-1">
                        {turn.teacherOriginal}
                      </Text>
                    )}
                    <Text className="font-poppins-semibold text-[15px] text-[#4B5563]">
                      {turn.teacherTranslation} 👏
                    </Text>
                  </View>

                  {/* Speaker Audio Icon */}
                  <View className="w-9 h-9 rounded-full bg-[#F3F0FF] items-center justify-center">
                    <Ionicons name="volume-high" size={20} color="#6C4EF5" />
                  </View>
                </View>

                {/* Speech Bubble Pointer (Tail) */}
                <View className="absolute -bottom-2 right-12 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-100" />
              </Pressable>

              {/* Action Control Buttons */}
              <View className="flex-row items-center justify-evenly pt-1">
                {/* Camera Toggle */}
                <View className="items-center">
                  <Pressable
                    onPress={() => setIsCameraOn(!isCameraOn)}
                    className={`w-14 h-14 rounded-full items-center justify-center shadow-md ${
                      isCameraOn ? "bg-white" : "bg-gray-200"
                    }`}
                  >
                    <Feather
                      name={isCameraOn ? "video" : "video-off"}
                      size={24}
                      color={isCameraOn ? "#1F2937" : "#9CA3AF"}
                    />
                  </Pressable>
                  <Text className="font-poppins-medium text-[12px] text-white mt-1 shadow-sm">
                    Camera
                  </Text>
                </View>

                {/* Mic Toggle */}
                <View className="items-center">
                  <Pressable
                    onPress={handleMicToggle}
                    className={`w-14 h-14 rounded-full items-center justify-center shadow-md ${
                      isMicRealOn ? "bg-white" : "bg-[#EF4444]"
                    }`}
                  >
                    <Feather
                      name={isMicRealOn ? "mic" : "mic-off"}
                      size={24}
                      color={isMicRealOn ? "#1F2937" : "#FFFFFF"}
                    />
                  </Pressable>
                  <Text className="font-poppins-medium text-[12px] text-white mt-1 shadow-sm">
                    Mic
                  </Text>
                </View>

                {/* Subtitles Toggle */}
                <View className="items-center">
                  <Pressable
                    onPress={() => setShowSubtitles(!showSubtitles)}
                    className={`w-14 h-14 rounded-full items-center justify-center shadow-md ${
                      showSubtitles ? "bg-white" : "bg-gray-200"
                    }`}
                  >
                    <MaterialIcons
                      name="subtitles"
                      size={24}
                      color={showSubtitles ? "#1F2937" : "#9CA3AF"}
                    />
                  </Pressable>
                  <Text className="font-poppins-medium text-[12px] text-white mt-1 shadow-sm">
                    Subtitles
                  </Text>
                </View>

                {/* End Call Button */}
                <View className="items-center">
                  <Pressable
                    onPress={onEndCall}
                    className="w-14 h-14 rounded-full bg-[#EF4444] items-center justify-center shadow-md active:bg-red-600"
                  >
                    <MaterialIcons name="call-end" size={26} color="#FFFFFF" />
                  </Pressable>
                  <Text className="font-poppins-medium text-[12px] text-white mt-1 shadow-sm">
                    End Call
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Live Feedback Score Card */}
        <View className="mt-4 p-4 bg-white rounded-[28px] border border-gray-100 shadow-sm flex-row items-center justify-between">
          <View className="flex-1 items-center border-r border-gray-100">
            <Text className="font-poppins-semibold text-[13px] text-[#374151] mb-0.5">
              Speaking
            </Text>
            <Text className="font-poppins-bold text-[15px] text-[#22C55E]">
              {turn.feedback.speaking}
            </Text>
          </View>

          <View className="flex-1 items-center border-r border-gray-100">
            <Text className="font-poppins-semibold text-[13px] text-[#374151] mb-0.5">
              Pronunciation
            </Text>
            <Text className="font-poppins-bold text-[15px] text-[#3B82F6]">
              {turn.feedback.pronunciation}
            </Text>
          </View>

          <View className="flex-1 items-center">
            <Text className="font-poppins-semibold text-[13px] text-[#374151] mb-0.5">
              Grammar
            </Text>
            <Text className="font-poppins-bold text-[15px] text-[#8B5CF6]">
              {turn.feedback.grammar}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
