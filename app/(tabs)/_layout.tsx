import { router, Tabs, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { BackHandler, Platform, StyleSheet } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useAppContext } from "@/context/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { translations } = useAppContext();
  const colors = Colors[colorScheme ?? "light"];

  // Use useSegments to track navigation - this is more stable than accessing navigation state directly
  const segments = useSegments();

  // Handle hardware back button for tabs
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (router.canGoBack()) {
          router.push("/");
          return true;
        } else if (segments[segments.length - 1] === "(tabs)") {
          // We're at the tabs root, exit the app
          BackHandler.exitApp();
          return true;
        } else {
          // Navigate to welcome screen
          router.push("/");
          return true;
        }
      }
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [segments]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colorScheme === 'dark' ? colors.grayMedium : undefined,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            // Enhanced shadow for dark mode
            ...styles.tabBar,
            shadowColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : undefined,
          },
          default: {
            backgroundColor: colorScheme === 'dark' ? colors.darkElevated || '#2C2C2C' : undefined,
            borderTopColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : undefined,
          },
        }),
        tabBarLabelStyle: {
          fontWeight: '500',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: translations.nav.home,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="resources"
        options={{
          title: translations.nav.resources,
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: translations.nav.videos,
          tabBarIcon: ({ color }) => (
            <Ionicons name="videocam-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workshops"
        options={{
          title: translations.nav.workshops,
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 10,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
});
