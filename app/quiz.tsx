import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import quizData from "../assets/data/quizData";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Colors } from "../constants/Colors";
import { useAppContext } from "../context/AppContext";
import { useColorScheme } from "../hooks/useColorScheme";
import { useThemeColor } from "../hooks/useThemeColor";

export default function QuizScreen() {
  const { language, setQuizAnswers, quizAnswers, calculateQuizResult } =
    useAppContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([...quizAnswers]);
  const [progressAnim] = useState(new Animated.Value(0));

  const isRtl = language === "ar";
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const tintColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#151718" },
    "background"
  );

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = currentQuestionIndex / (quizData.questions.length - 1);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const handleOptionSelect = (optionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionId;
    setAnswers(newAnswers);
  };

  // This function will handle the final submission of the quiz
  const handleQuizSubmission = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Store the answers in context
    setQuizAnswers(answers);

    // Instead of trying to navigate immediately after state updates,
    // we'll navigate first, and let the result page handle the calculation
    router.replace({
      pathname: "/quiz-result",
      // Pass a parameter to indicate this is a fresh submission
      params: { freshSubmission: "true" },
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleQuizSubmission();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const questionText =
    language === "ar" ? currentQuestion.text : currentQuestion.textEn;

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>

      <ThemedText style={styles.progressText}>
        {language === "ar"
          ? `السؤال ${currentQuestionIndex + 1} من ${quizData.questions.length}`
          : `Question ${currentQuestionIndex + 1} of ${
              quizData.questions.length
            }`}
      </ThemedText>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={[styles.question, isRtl && styles.rtlText]}>
          {questionText}
        </ThemedText>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                answers[currentQuestionIndex] === option.id && [
                  styles.selectedOption,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ],
              ]}
              onPress={() => handleOptionSelect(option.id)}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  isRtl && styles.rtlText,
                  answers[currentQuestionIndex] === option.id &&
                    styles.selectedOptionText,
                ]}
              >
                {language === "ar" ? option.text : option.textEn}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        {currentQuestionIndex > 0 ? (
          <TouchableOpacity
            style={[
              styles.button,
              styles.backButton,
              { borderColor: colors.primary },
            ]}
            onPress={goToPreviousQuestion}
          >
            <ThemedText
              style={[styles.backButtonText, { color: colors.primary }]}
            >
              {language === "ar" ? "السابق" : "Previous"}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonPlaceholder} />
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.nextButton,
            { backgroundColor: colors.primary },
            !answers[currentQuestionIndex] && styles.disabledButton,
          ]}
          onPress={goToNextQuestion}
          disabled={!answers[currentQuestionIndex]}
        >
          <ThemedText style={styles.nextButtonText}>
            {currentQuestionIndex === quizData.questions.length - 1
              ? language === "ar"
                ? "النتيجة"
                : "Results"
              : language === "ar"
              ? "التالي"
              : "Next"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginTop: 50,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0a7ea4",
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  question: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 30,
    lineHeight: 32,
  },
  optionsContainer: {
    width: "100%",
  },
  option: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedOption: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  optionText: {
    fontSize: 16,
    color: "#333333",
  },
  selectedOptionText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 120,
    alignItems: "center",
  },
  buttonPlaceholder: {
    minWidth: 120,
  },
  backButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  backButtonText: {
    fontSize: 16,
    color: "#666666",
  },
  nextButton: {
    backgroundColor: "#0a7ea4",
  },
  nextButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
});
