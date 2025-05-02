import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { translations } from "../assets/translations";
import { ThemedText } from "../components/ThemedText";
import { Colors } from "../constants/Colors";
import { useAppContext } from "../context/AppContext";
import { useColorScheme } from "../hooks/useColorScheme";

export default function WelcomeScreen() {
  const { language, setLanguage } = useAppContext();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  useEffect(() => {
    // Start animations when component mounts
    const animationDuration = 800;

    // Logo animation
    logoOpacity.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.ease),
    });

    logoScale.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.elastic(1.2),
    });

    // Content animation with delay
    contentOpacity.value = withDelay(
      200,
      withTiming(1, { duration: animationDuration })
    );

    contentTranslateY.value = withDelay(
      200,
      withTiming(0, { duration: animationDuration })
    );
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  const startQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/quiz");
  };

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const t = translations[language];

  // Choose gradient colors based on theme
  const gradientColors =
    colorScheme === "light"
      ? [colors.primaryLight, colors.primaryDark]
      : [colors.primaryDark, "#2A1F37"];

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <StatusBar style={colorScheme === "light" ? "light" : "light"} />
      <View style={styles.container}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
          <ThemedText
            style={[styles.title, language === "ar" ? styles.rtlText : {}]}
            lightColor="#ffffff"
            darkColor="#ffffff"
          >
            {t.hero.title}
          </ThemedText>

          <ThemedText
            style={[styles.subtitle, language === "ar" ? styles.rtlText : {}]}
            lightColor="#f0f0f0"
            darkColor="#e0e0e0"
          >
            {t.hero.subtitle}
          </ThemedText>

          <TouchableOpacity
            style={[
              styles.quizButton,
              {
                backgroundColor:
                  colorScheme === "light" ? "#ffffff" : "#ffffff",
              },
            ]}
            onPress={startQuiz}
          >
            <ThemedText
              style={[
                styles.buttonText,
                {
                  color:
                    colorScheme === "light"
                      ? colors.primary
                      : colors.primaryDark,
                },
              ]}
            >
              {t.hero.selfAwarenessTest}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.resourcesButton,
              colorScheme === "dark" ? { borderColor: colors.primary } : {},
            ]}
            onPress={() => router.push("/")}
          >
            <ThemedText
              style={styles.buttonTextAlt}
              lightColor="#ffffff"
              darkColor={colors.primary}
            >
              {language === "ar" ? "الصفحة الرئيسية" : "Home Page"}
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[
            styles.languageToggle,
            colorScheme === "dark"
              ? { backgroundColor: "rgba(198, 125, 255, 0.25)" }
              : {},
          ]}
          onPress={toggleLanguage}
        >
          <ThemedText
            style={styles.languageText}
            lightColor="#ffffff"
            darkColor="#ffffff"
          >
            {language === "ar" ? "English" : "العربية"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 100,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "#f0f0f0",
    lineHeight: 24,
  },
  quizButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    marginBottom: 15,
  },
  resourcesButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderColor: "#ffffff",
    borderWidth: 1,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0a7ea4",
  },
  buttonTextAlt: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  languageToggle: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  languageText: {
    color: "#ffffff",
    fontWeight: "500",
  },
});
