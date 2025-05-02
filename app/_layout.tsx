import { AppProvider } from "@/context/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // We'll keep the splash screen visible a bit longer and hide it
      // when the welcome screen is ready with its animations
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100); // Small timeout for smoother transition
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

// Redirect from the root to the welcome screen
export function Index() {
  return <Redirect href="/welcome" />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="quiz"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="quiz-result"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="ai-assistant"
          options={{ headerShown: false, presentation: "card" }}
        />
      </Stack>
    </AppProvider>
  );
}
