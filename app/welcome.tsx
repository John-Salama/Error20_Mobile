import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { translations } from "../assets/translations";
import { ThemedText } from "../components/ThemedText";
import { Colors } from "../constants/Colors";
import { useAppContext } from "../context/AppContext";
import { useColorScheme } from "../hooks/useColorScheme";
import { useThemeColor } from "../hooks/useThemeColor";

export default function WelcomeScreen() {
  const { language, setLanguage } = useAppContext();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const tintColor = useThemeColor({}, "primary");

  const startQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/quiz");
  };

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const t = translations[language];

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      style={styles.gradient}
    >
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentContainer}>
          <ThemedText
            style={[styles.title, language === "ar" ? styles.rtlText : {}]}
          >
            {t.hero.title}
          </ThemedText>

          <ThemedText
            style={[styles.subtitle, language === "ar" ? styles.rtlText : {}]}
          >
            {t.hero.subtitle}
          </ThemedText>

          <TouchableOpacity
            style={[styles.quizButton, { backgroundColor: "#ffffff" }]}
            onPress={startQuiz}
          >
            <ThemedText style={[styles.buttonText, { color: colors.primary }]}>
              {t.hero.selfAwarenessTest}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourcesButton}
            onPress={() => router.push("/")}
          >
            <ThemedText style={styles.buttonTextAlt}>
              {language === "ar" ? "الصفحة الرئيسية" : "Return Home"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.languageToggle}
          onPress={toggleLanguage}
        >
          <ThemedText style={styles.languageText}>
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
