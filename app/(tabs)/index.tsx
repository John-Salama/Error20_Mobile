import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useAppContext } from "../../context/AppContext";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function HomeScreen() {
  const { language, quizResult } = useAppContext();
  const isRtl = language === "ar";
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const startQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/quiz");
  };

  const viewResources = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/resources");
  };

  const viewWorkshops = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/workshops");
  };

  const talkToAssistant = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/ai-assistant");
  };

  // Choose gradient colors based on theme
  const headerGradient = isDark
    ? [colors.primaryDark, '#2A1F37'] 
    : [colors.primaryLight, colors.primary];

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={headerGradient}
        style={styles.header}
      >
        {/* Logo */}
        <ExpoImage
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          contentFit="contain"
        />

        {/* Slogan */}
        <ThemedText style={[styles.slogan, isRtl && styles.rtlText]}>
          {language === "ar"
            ? "تخطي أزمة ربع العمر بوعي"
            : "Navigate your quarter-life crisis with awareness"}
        </ThemedText>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quiz Card */}
        <View 
          style={[
            styles.card, 
            { 
              backgroundColor: colors.background,
              shadowColor: isDark ? "rgba(0,0,0,0.5)" : "#000",
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderWidth: isDark ? 1 : 0,
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <ThemedText
              style={[
                styles.cardTitle,
                isRtl && styles.rtlText,
                { color: colors.primary },
              ]}
            >
              {language === "ar"
                ? "اختبار الوعي الذاتي"
                : "Self-Awareness Test"}
            </ThemedText>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={colors.primary}
            />
          </View>

          <ThemedText 
            style={[
              styles.cardDescription, 
              isRtl && styles.rtlText,
              isDark && { color: colors.text }
            ]}
          >
            {language === "ar"
              ? "اكتشف أين تقف في رحلتك الشخصية من خلال اختبار قصير."
              : "Discover where you stand in your personal journey through a quick test."}
          </ThemedText>

          {quizResult ? (
            <View>
              <View style={styles.resultSummary}>
                <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
                <ThemedText
                  style={[styles.resultText, isRtl && styles.rtlText]}
                >
                  {language === "ar"
                    ? "لقد أكملت الاختبار!"
                    : "You've completed the test!"}
                </ThemedText>
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => router.push("/quiz-result")}
              >
                <ThemedText style={styles.buttonText}>
                  {language === "ar" ? "عرض النتائج" : "View Results"}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.outlineButton,
                  { borderColor: colors.primary },
                ]}
                onPress={startQuiz}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    styles.outlineButtonText,
                    { color: colors.primary },
                  ]}
                >
                  {language === "ar" ? "إعادة الاختبار" : "Retake Test"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={startQuiz}
            >
              <ThemedText style={styles.buttonText}>
                {language === "ar" ? "ابدأ الاختبار" : "Start Test"}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Cards */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionCard, 
              { 
                backgroundColor: isDark 
                  ? colors.indigoBackground || "#2D3452" 
                  : colors.indigo 
              }
            ]}
            onPress={viewResources}
          >
            <Ionicons name="book-outline" size={32} color="#fff" />
            <ThemedText style={[styles.actionTitle, isRtl && styles.rtlText]}>
              {language === "ar" ? "موارد ودعم" : "Resources & Support"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard, 
              { 
                backgroundColor: isDark 
                  ? colors.pinkBackground || "#3D2A3A" 
                  : colors.pink 
              }
            ]}
            onPress={viewWorkshops}
          >
            <Ionicons name="calendar-outline" size={32} color="#fff" />
            <ThemedText style={[styles.actionTitle, isRtl && styles.rtlText]}>
              {language === "ar" ? "ورش عمل" : "Workshops"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* AI Assistant */}
        <TouchableOpacity
          style={[
            styles.aiAssistantCard,
            { backgroundColor: isDark ? '#332A40' : colors.primaryDark },
          ]}
          onPress={talkToAssistant}
        >
          <View style={styles.aiAssistantHeader}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={28}
              color="#ffffff"
            />
            <ThemedText
              style={[styles.aiAssistantTitle, isRtl && styles.rtlText]}
            >
              {language === "ar" ? "المساعد الذكي" : "AI Assistant"}
            </ThemedText>
          </View>

          <ThemedText
            style={[styles.aiAssistantDescription, isRtl && styles.rtlText]}
          >
            {language === "ar"
              ? "لديك سؤال؟ تحدث مع مساعدنا الذكي للحصول على نصائح ودعم."
              : "Have a question? Chat with our AI assistant for guidance and support."}
          </ThemedText>

          <View style={styles.aiAssistantButton}>
            <ThemedText style={styles.aiAssistantButtonText}>
              {language === "ar" ? "بدء المحادثة" : "Start Chatting"}
            </ThemedText>
            <Ionicons
              name={isRtl ? "arrow-back" : "arrow-forward"}
              size={16}
              color="#ffffff"
            />
          </View>
        </TouchableOpacity>

        {/* Attribution */}
        <View style={styles.attribution}>
          <ThemedText 
            style={[
              styles.attributionText,
              { color: isDark ? '#777777' : '#999999' }
            ]}
          >
            Error 20 © 2025
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 80,
    marginBottom: 10,
  },
  slogan: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0a7ea4",
  },
  cardDescription: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 20,
    lineHeight: 22,
  },
  resultSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  resultText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  outlineButtonText: {
    color: "#0a7ea4",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionCard: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  resourcesCard: {
    backgroundColor: "#2a9d8f",
  },
  workshopsCard: {
    backgroundColor: "#e76f51",
  },
  actionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    textAlign: "center",
  },
  aiAssistantCard: {
    backgroundColor: "#38A3A5",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  aiAssistantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  aiAssistantTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },
  aiAssistantDescription: {
    color: "#e0f2fe",
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  aiAssistantButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  aiAssistantButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginRight: 5,
  },
  attribution: {
    marginTop: 20,
    alignItems: "center",
  },
  attributionText: {
    fontSize: 14,
    color: "#999999",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});
