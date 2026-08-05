import React, { useEffect } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Feather from "@expo/vector-icons/Feather";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/components/tw";

type TabIconName = keyof typeof Feather.glyphMap;

interface TabConfig {
  name: string;
  label: string;
  iconName: TabIconName;
}

const TAB_CONFIGS: TabConfig[] = [
  { name: "index", label: "Home", iconName: "home" },
  { name: "learn", label: "Learn", iconName: "book-open" },
  { name: "ai-teacher", label: "AI Teacher", iconName: "smile" },
  { name: "chat", label: "Chat", iconName: "message-square" },
  { name: "profile", label: "Profile", iconName: "user" },
];

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeIndex = state.index;

  const activeIndexAnim = useSharedValue(activeIndex);

  useEffect(() => {
    activeIndexAnim.value = withTiming(activeIndex, {
      duration: 250,
      easing: Easing.out(Easing.quad),
    });
  }, [activeIndex, activeIndexAnim]);

  const activeCircleStyle = useAnimatedStyle(() => {
    return {
      left: `${activeIndexAnim.value * 20}%`,
    };
  });

  return (
    <View className="flex-row items-center justify-around bg-white border-t border-[#F3F4F6] relative pt-2 pb-3">
      {/* Animated active background circle container */}
      <View className="absolute top-2 left-0 right-0 h-[44px] flex-row pointer-events-none">
        <Animated.View
          style={[
            {
              width: "20%",
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            },
            activeCircleStyle,
          ]}
        >
          <View className="w-[44px] h-[44px] rounded-full bg-[#6C4EF5] shadow-sm" />
        </Animated.View>
      </View>

      {/* Tab Buttons */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const config = TAB_CONFIGS.find((c) => c.name === route.name) || {
          name: route.name,
          label: route.name,
          iconName: "circle" as TabIconName,
        };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 items-center justify-start h-[48px]"
          >
            <View className="w-[44px] h-[44px] items-center justify-center">
              <Feather
                name={config.iconName}
                size={22}
                color={isFocused ? "#FFFFFF" : "#6B7280"}
              />
            </View>

            {!isFocused && (
              <Text className="font-poppins-medium text-[10px] text-[#6B7280] -mt-1.5 text-center">
                {config.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
