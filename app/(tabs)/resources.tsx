import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import resources from "../../assets/data/resources";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useAppContext } from "../../context/AppContext";
import { useColorScheme } from "../../hooks/useColorScheme";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function ResourcesScreen() {
  const { language } = useAppContext();
  const isRtl = language === "ar";
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const tintColor = useThemeColor({}, "primary");

  const handleResourcePress = async (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Check if the URL can be opened
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.error("Cannot open URL:", url);
    }
  };

  // Get appropriate descriptions based on language
  const getDescription = (resource: any) => {
    return language === "ar" ? resource.description : resource.descriptionEn;
  };

  // Define categories for resources
  const categories = [
    {
      title: language === "ar" ? "منصات تعليمية" : "Educational Platforms",
      icon: "school-outline",
      color: colors.primary,
    },
    {
      title: language === "ar" ? "الدعم النفسي" : "Mental Health Support",
      icon: "heart-outline",
      color: colors.pink,
    },
    {
      title: language === "ar" ? "التطوير المهني" : "Career Development",
      icon: "briefcase-outline",
      color: colors.indigo,
    },
    {
      title: language === "ar" ? "مهارات حياتية" : "Life Skills",
      icon: "bulb-outline",
      color: colors.primaryLight,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.headerTitle}>
          {language === "ar" ? "الموارد والدعم" : "Resources & Support"}
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {language === "ar"
            ? "استكشف مجموعة من الموارد المفيدة لرحلة تخطي أزمة ربع العمر"
            : "Explore helpful resources for your quarter-life crisis journey"}
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories section */}
        <View style={styles.categoriesContainer}>
          <ThemedText style={[styles.sectionTitle, isRtl && styles.rtlText]}>
            {language === "ar" ? "التصنيفات" : "Categories"}
          </ThemedText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Category filtering would be implemented here
                }}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: category.color },
                  ]}
                >
                  <Ionicons name={category.icon} size={24} color="#fff" />
                </View>
                <ThemedText
                  style={[styles.categoryTitle, isRtl && styles.rtlText]}
                >
                  {category.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured resources */}
        <View style={styles.resourcesContainer}>
          <ThemedText style={[styles.sectionTitle, isRtl && styles.rtlText]}>
            {language === "ar" ? "منصات مميزة" : "Featured Platforms"}
          </ThemedText>

          {resources.map((resource, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resourceCard}
              onPress={() => handleResourcePress(resource.link)}
            >
              <View
                style={[
                  styles.resourceIconContainer,
                  { backgroundColor: colors.primaryBackground },
                ]}
              >
                <ThemedText style={styles.resourceIcon}>
                  {resource.icon}
                </ThemedText>
              </View>
              <View style={styles.resourceContent}>
                <ThemedText
                  style={[styles.resourceTitle, isRtl && styles.rtlText]}
                >
                  {resource.title}
                </ThemedText>
                <ThemedText
                  style={[styles.resourceDescription, isRtl && styles.rtlText]}
                >
                  {getDescription(resource)}
                </ThemedText>
              </View>
              <Ionicons
                name={isRtl ? "chevron-back" : "chevron-forward"}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional help section */}
        <View style={styles.additionalHelpContainer}>
          <ThemedText style={[styles.sectionTitle, isRtl && styles.rtlText]}>
            {language === "ar"
              ? "هل تحتاج مساعدة إضافية؟"
              : "Need Additional Help?"}
          </ThemedText>

          <TouchableOpacity
            style={[
              styles.aiAssistantCard,
              { backgroundColor: colors.primaryDark },
            ]}
            onPress={() => router.push("/ai-assistant")}
          >
            <View style={styles.aiAssistantContent}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#ffffff"
              />
              <View style={{ marginLeft: 16 }}>
                <ThemedText
                  style={[styles.aiAssistantTitle, isRtl && styles.rtlText]}
                >
                  {language === "ar"
                    ? "تحدث مع المساعد الذكي"
                    : "Talk to AI Assistant"}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.aiAssistantDescription,
                    isRtl && styles.rtlText,
                  ]}
                >
                  {language === "ar"
                    ? "احصل على نصائح ومساعدة مخصصة لاحتياجاتك"
                    : "Get personalized advice and assistance"}
                </ThemedText>
              </View>
            </View>
            <Ionicons
              name={isRtl ? "chevron-back" : "chevron-forward"}
              size={24}
              color="#ffffff"
            />
          </TouchableOpacity>
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
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0f2fe",
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  categoriesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  categoriesScrollContent: {
    paddingRight: 20,
  },
  categoryCard: {
    marginRight: 15,
    width: 120,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  resourcesContainer: {
    padding: 20,
  },
  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  resourceIcon: {
    fontSize: 24,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: "#666",
  },
  additionalHelpContainer: {
    padding: 20,
  },
  aiAssistantCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
  },
  aiAssistantContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiAssistantTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  aiAssistantDescription: {
    fontSize: 14,
    color: "#e0f2fe",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});
