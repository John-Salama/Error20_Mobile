import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image as ExpoImage } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import workshops from "../../assets/data/workshops";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useAppContext } from "../../context/AppContext";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function WorkshopsScreen() {
  const { language } = useAppContext();
  const isRtl = language === "ar";
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const handleWorkshopPress = async (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Check if the URL can be opened
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.error("Cannot open URL:", url);
    }
  };

  // Format workshop data based on language
  const getWorkshopData = (workshop: any) => {
    return {
      title: language === "ar" ? workshop.title : workshop.titleEn,
      description:
        language === "ar" ? workshop.description : workshop.descriptionEn,
      duration: language === "ar" ? workshop.duration : workshop.durationEn,
      instructor:
        language === "ar" ? workshop.instructor : workshop.instructorEn,
      location: language === "ar" ? workshop.location : workshop.locationEn,
      freeText: language === "ar" ? workshop.freeTextAr : workshop.freeTextEn,
    };
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.headerTitle}>
          {language === "ar" ? "ورش العمل والفعاليات" : "Workshops & Events"}
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {language === "ar"
            ? "انضم إلى ورش العمل التفاعلية لتطوير مهاراتك في بيئة عملية"
            : "Join interactive workshops to develop your skills in a practical environment"}
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Workshop */}
        <View style={styles.featuredContainer}>
          <ThemedText style={[styles.sectionTitle, isRtl && styles.rtlText]}>
            {language === "ar" ? "ورشة العمل المميزة" : "Featured Workshop"}
          </ThemedText>

          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => handleWorkshopPress(workshops[0].link)}
          >
            <ExpoImage
              source={require("../../assets/images/partial-react-logo.png")}
              style={styles.featuredImage}
              contentFit="cover"
            />
            <View
              style={[
                styles.featuredOverlay,
                { backgroundColor: "rgba(114, 40, 200, 0.7)" },
              ]}
            >
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: colors.pink }]}>
                  <ThemedText style={styles.badgeText}>
                    {getWorkshopData(workshops[0]).freeText}
                  </ThemedText>
                </View>
              </View>
              <ThemedText
                style={[styles.featuredTitle, isRtl && styles.rtlText]}
              >
                {getWorkshopData(workshops[0]).title}
              </ThemedText>
              <ThemedText
                style={[styles.featuredDescription, isRtl && styles.rtlText]}
                numberOfLines={2}
              >
                {getWorkshopData(workshops[0]).description}
              </ThemedText>

              <View style={styles.featuredDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color="#ffffff" />
                  <ThemedText style={styles.detailText}>
                    {getWorkshopData(workshops[0]).duration}
                  </ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={16} color="#ffffff" />
                  <ThemedText style={styles.detailText}>
                    {getWorkshopData(workshops[0]).location}
                  </ThemedText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Workshops */}
        <View style={styles.upcomingContainer}>
          <ThemedText style={[styles.sectionTitle, isRtl && styles.rtlText]}>
            {language === "ar" ? "الورش القادمة" : "Upcoming Workshops"}
          </ThemedText>

          {workshops.slice(1).map((workshop, index) => {
            const workshopData = getWorkshopData(workshop);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.workshopCard,
                  { backgroundColor: colors.primaryBackground },
                ]}
                onPress={() => handleWorkshopPress(workshop.link)}
              >
                <View style={styles.workshopContent}>
                  <View style={styles.workshopHeader}>
                    <ThemedText
                      style={[styles.workshopTitle, isRtl && styles.rtlText]}
                    >
                      {workshopData.title}
                    </ThemedText>
                    {workshop.price === 0 && (
                      <View
                        style={[
                          styles.miniTag,
                          { backgroundColor: colors.pink },
                        ]}
                      >
                        <ThemedText style={styles.miniTagText}>
                          {workshopData.freeText}
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  <ThemedText
                    style={[
                      styles.workshopDescription,
                      isRtl && styles.rtlText,
                    ]}
                    numberOfLines={2}
                  >
                    {workshopData.description}
                  </ThemedText>

                  <View style={styles.workshopDetails}>
                    <View style={styles.workshopDetailItem}>
                      <Ionicons name="person-outline" size={16} color="#666" />
                      <ThemedText style={styles.workshopDetailText}>
                        {workshopData.instructor}
                      </ThemedText>
                    </View>
                    <View style={styles.workshopDetailItem}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <ThemedText style={styles.workshopDetailText}>
                        {workshopData.duration}
                      </ThemedText>
                    </View>
                    <View style={styles.workshopDetailItem}>
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color="#666"
                      />
                      <ThemedText style={styles.workshopDetailText}>
                        {workshopData.location}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => handleWorkshopPress(workshop.link)}
                >
                  <ThemedText style={styles.registerButtonText}>
                    {language === "ar" ? "سجّل الآن" : "Register Now"}
                  </ThemedText>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Find more section */}
        <View style={styles.findMoreContainer}>
          <View
            style={[styles.findMoreCard, { borderColor: colors.primaryLight }]}
          >
            <ThemedText style={[styles.findMoreTitle, isRtl && styles.rtlText]}>
              {language === "ar"
                ? "تبحث عن المزيد من الفعاليات؟"
                : "Looking for more events?"}
            </ThemedText>
            <ThemedText style={[styles.findMoreText, isRtl && styles.rtlText]}>
              {language === "ar"
                ? "زور موقعنا الإلكتروني لمشاهدة جميع الفعاليات القادمة ومواد إضافية"
                : "Visit our website to view all upcoming events and additional materials"}
            </ThemedText>
            <TouchableOpacity
              style={[styles.visitButton, { backgroundColor: colors.primary }]}
              onPress={() => Linking.openURL("https://error20.vercel.app/")}
            >
              <ThemedText style={styles.visitButtonText}>
                {language === "ar" ? "زيارة الموقع" : "Visit Website"}
              </ThemedText>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
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
  featuredContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  featuredCard: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    paddingBottom: 20,
  },
  badgeContainer: {
    position: "absolute",
    top: -30,
    right: 15,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
  },
  featuredTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  featuredDescription: {
    color: "#e0e0e0",
    fontSize: 14,
    marginBottom: 10,
  },
  featuredDetails: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    color: "#ffffff",
    fontSize: 12,
    marginLeft: 5,
  },
  upcomingContainer: {
    padding: 20,
    paddingTop: 10,
  },
  workshopCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  workshopContent: {
    padding: 16,
  },
  workshopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  workshopTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  miniTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniTagText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 10,
  },
  workshopDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
    lineHeight: 20,
  },
  workshopDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  workshopDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  workshopDetailText: {
    color: "#666666",
    fontSize: 12,
    marginLeft: 5,
  },
  registerButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  findMoreContainer: {
    padding: 20,
    paddingTop: 0,
  },
  findMoreCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    alignItems: "center",
  },
  findMoreTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  findMoreText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
  },
  visitButton: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  visitButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginRight: 5,
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});
