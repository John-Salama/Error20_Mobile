import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  BackHandler,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Colors } from "../constants/Colors";
import { useAppContext } from "../context/AppContext";
import { useColorScheme } from "../hooks/useColorScheme";

export default function QuizResultScreen() {
  const { language, quizResult, resetQuiz, calculateQuizResult, quizAnswers } =
    useAppContext();
  const { freshSubmission } = useLocalSearchParams();
  const isRtl = language === "ar";
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  // Handle hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Navigate back to quiz screen when hardware back button is pressed
        router.push("/");
        return true; // Prevent default behavior (exiting the app)
      }
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, []);

  // Calculate results if this is a fresh submission
  useEffect(() => {
    if (freshSubmission === "true") {
      // Calculate the quiz result
      calculateQuizResult();
    }
  }, [freshSubmission]);

  // Redirect if no answers
  useEffect(() => {
    // Check if we have answers (this means the quiz was taken)
    const hasAnswers =
      quizAnswers && quizAnswers.some((answer) => answer !== "");

    // If we don't have answers and this is not a fresh submission, redirect to quiz
    if (!hasAnswers && freshSubmission !== "true") {
      router.push("/quiz");
    }
  }, [quizAnswers]);

  // If quiz result is not available yet, show a loading screen
  if (!quizResult) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <StatusBar style="light" />
        <ThemedText>
          {language === "ar" ? "جاري تحميل النتائج..." : "Loading results..."}
        </ThemedText>
      </ThemedView>
    );
  }

  // Get result data in the correct language
  const title = language === "ar" ? quizResult.title : quizResult.titleEn;
  const description =
    language === "ar" ? quizResult.description : quizResult.descriptionEn;
  const advice = language === "ar" ? quizResult.advice : quizResult.adviceEn;

  // Determine result color based on type with our purple scheme
  const getResultColor = (type: string) => {
    switch (type) {
      case "a":
        return colors.pink; // التيه - Pink
      case "b":
        return colors.primaryLight; // الإدراك - Light Purple
      case "c":
        return colors.indigo; // النمو - Indigo
      case "d":
        return colors.primary; // الاتساق - Purple
      default:
        return colors.primary;
    }
  };

  const resultColor = getResultColor(quizResult.type);

  // Handle sharing result
  const shareResult = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const shareMessage =
        language === "ar"
          ? `نتيجة اختبار الوعي الذاتي من Error 20: ${title}\n\nحمّل تطبيق Error 20 الآن!`
          : `My Error 20 Self-Awareness Test Result: ${title}\n\nDownload the Error 20 app now!`;

      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Handle restart quiz
  const handleRestartQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetQuiz();
    router.push("/quiz");
  };

  // Navigate to home page while preserving the quiz result
  const goToHomePage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to home page without resetting quiz result
    router.push("/(tabs)");
  };

  // Handle talk to ai assistant
  const handleTalkToAi = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/ai-assistant");
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[resultColor, resultColor + "99"]}
        style={styles.header}
      >
        <View style={styles.resultTitleContainer}>
          <ThemedText style={[styles.resultTitle, isRtl && styles.rtlText]}>
            {title}
          </ThemedText>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={[styles.sectionTitle, isRtl && styles.rtlText]}>
          {language === "ar" ? "وصف المرحلة" : "Stage Description"}
        </ThemedText>

        <ThemedText style={[styles.description, isRtl && styles.rtlText]}>
          {description}
        </ThemedText>

        <ThemedText
          style={[
            styles.sectionTitle,
            isRtl && styles.rtlText,
            { marginTop: 30 },
          ]}
        >
          {language === "ar" ? "النصائح والإرشادات" : "Advice and Guidance"}
        </ThemedText>

        <ThemedText style={[styles.advice, isRtl && styles.rtlText]}>
          {advice}
        </ThemedText>

        <View style={styles.divider} />

        <ThemedText style={[styles.resourcesTitle, isRtl && styles.rtlText]}>
          {language === "ar"
            ? "استكشف المزيد من الموارد"
            : "Explore More Resources"}
        </ThemedText>

        <TouchableOpacity
          style={styles.resourceButton}
          onPress={() => router.push("/(tabs)/resources")}
        >
          <View style={styles.resourceButtonContent}>
            <Ionicons name="book-outline" size={24} color={colors.primary} />
            <ThemedText
              style={[styles.resourceButtonText, { color: colors.primary }]}
            >
              {language === "ar" ? "مكتبة الموارد" : "Resources Library"}
            </ThemedText>
          </View>
          <Ionicons
            name={isRtl ? "chevron-back" : "chevron-forward"}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resourceButton}
          onPress={() => router.push("/(tabs)/workshops")}
        >
          <View style={styles.resourceButtonContent}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={colors.primary}
            />
            <ThemedText
              style={[styles.resourceButtonText, { color: colors.primary }]}
            >
              {language === "ar"
                ? "ورش العمل والفعاليات"
                : "Workshops & Events"}
            </ThemedText>
          </View>
          <Ionicons
            name={isRtl ? "chevron-back" : "chevron-forward"}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.shareButton, { borderColor: colors.primary }]}
          onPress={shareResult}
        >
          <Ionicons
            name="share-social-outline"
            size={22}
            color={colors.primary}
          />
          <ThemedText
            style={[styles.shareButtonText, { color: colors.primary }]}
          >
            {language === "ar" ? "مشاركة" : "Share"}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.restartButton, { backgroundColor: colors.primary }]}
          onPress={goToHomePage}
        >
          <Ionicons name="home-outline" size={22} color="#ffffff" />
          <ThemedText style={styles.restartButtonText}>
            {language === "ar" ? "الصفحة الرئيسية" : "Home Page"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.aiAssistantButton,
          { backgroundColor: colors.primaryDark },
        ]}
        onPress={handleTalkToAi}
      >
        <ThemedText style={styles.aiAssistantButtonText}>
          {language === "ar"
            ? "تحدث مع مساعد Error 20 الذكي"
            : "Talk to Error 20 AI Assistant"}
        </ThemedText>
        <Ionicons name="chatbox-ellipses-outline" size={22} color="#ffffff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  resultTitleContainer: {
    paddingVertical: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  advice: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 30,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  resourceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  resourceButtonText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    justifyContent: "space-between",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.48,
  },
  shareButtonText: {
    fontWeight: "600",
    marginLeft: 8,
  },
  restartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.48,
  },
  restartButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 8,
  },
  aiAssistantButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
  },
  aiAssistantButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 10,
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
