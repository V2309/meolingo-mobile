import { useEffect, useRef } from "react";
import "../global.css";
import { View, Text } from "react-native";
import { Stack, useSegments, useRootNavigationState, Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { PostHogErrorBoundary, PostHogProvider, usePostHog } from "posthog-react-native";
import { useLearningStore } from "@/store/learningStore";
import { posthog } from "@/constants/posthog";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Ignore errors */
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env file");
}

function ErrorFallback({ error }: { error: Error | unknown }) {
  return (
    <View>
      <Text>{error instanceof Error ? error.message : "Something went wrong."}</Text>
    </View>
  );
}

function PostHogIdentity() {
  const posthog = usePostHog();
  const { user } = useUser();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      identifiedUserId.current = null;
      return;
    }

    if (identifiedUserId.current === user.id) {
      return;
    }

    identifiedUserId.current = user.id;
    posthog.identify(user.id, {
      ...(user.primaryEmailAddress?.emailAddress
        ? { email: user.primaryEmailAddress.emailAddress }
        : {}),
      ...(user.fullName ? { name: user.fullName } : {}),
    });
  }, [posthog, user]);

  return null;
}

function InitialLayout() {
  const [loaded, error] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const hasHiddenSplash = useRef(false);
  
  const { selectedLanguageId, _hasHydrated } = useLearningStore();

  // Hide the splash screen once fonts, Clerk, and store hydration are ready
  useEffect(() => {
    if ((loaded || error) && isLoaded && _hasHydrated && !hasHiddenSplash.current) {
      hasHiddenSplash.current = true;
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error, isLoaded, _hasHydrated]);

  if ((!loaded && !error) || !isLoaded || !_hasHydrated || !rootNavigationState?.key) {
    return null;
  }

  const inAuthGroup = segments[0] === "(auth)";
  const inOnboarding = segments[0] === "onboarding";
  const inChooseLanguage = segments[0] === "choose-language";

  // Declarative Route Guarding
  if (isSignedIn) {
    if (!selectedLanguageId) {
      if (!inChooseLanguage) {
        return <Redirect href="/choose-language" />;
      }
    } else {
      if (inAuthGroup || inOnboarding) {
        return <Redirect href={"/" as any} />;
      }
    }
  } else {
    if (!inAuthGroup && !inOnboarding) {
      return <Redirect href="/onboarding" />;
    }
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="lesson/audio" options={{ headerShown: false }} />
      <Stack.Screen name="lesson/video" options={{ headerShown: false }} />
      <Stack.Screen name="lesson/chat" options={{ headerShown: false }} />
      <Stack.Screen name="lesson/vocab" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="choose-language" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const layout = <InitialLayout />;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {posthog ? (
        <PostHogProvider client={posthog}>
          <PostHogIdentity />
          <PostHogErrorBoundary fallback={ErrorFallback}>
            {layout}
          </PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        layout
      )}
    </ClerkProvider>
  );
}
