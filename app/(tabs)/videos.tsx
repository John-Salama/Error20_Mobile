import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

import videos from "../../assets/data/videos";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useAppContext } from "../../context/AppContext";
import { useColorScheme } from "../../hooks/useColorScheme";
import { useThemeColor } from "../../hooks/useThemeColor";

const { width } = Dimensions.get("window");

export default function VideosScreen() {
  const { language, translations } = useAppContext();
  const isRtl = language === "ar";
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const tintColor = useThemeColor({}, "primary");

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Get appropriate titles and descriptions based on language
  const getTitle = (video) => {
    return language === "ar" ? video.title : video.titleEn;
  };

  const getDescription = (video) => {
    return language === "ar" ? video.description : video.descriptionEn;
  };

  // Handle video selection - different strategies based on platform
  const handleVideoPress = async (video) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (Platform.OS === "ios") {
      // iOS has better WebView SSL support, try in-app first
      setSelectedVideo(video);
      setVideoModalVisible(true);
      setIsLoading(true);
      setLoadError(false);
    } else {
      // On Android, prefer the SFSafariViewController/Chrome Custom Tabs approach
      // which has better SSL handling and Facebook compatibility
      try {
        await WebBrowser.openBrowserAsync(video.url);
      } catch (error) {
        console.log("Error opening in WebBrowser:", error);
        // Fall back to built-in WebView
        setSelectedVideo(video);
        setVideoModalVisible(true);
        setIsLoading(true);
        setLoadError(false);
      }
    }
  };

  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setSelectedVideo(null);
    setIsLoading(false);
    setLoadError(false);
  };

  // Handle WebView errors
  const handleWebViewError = (error) => {
    console.log("WebView error:", error);
    setLoadError(true);
    setIsLoading(false);
  };

  // Open video in external browser as fallback
  const openInExternalBrowser = async (url) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      // First try with WebBrowser (better user experience)
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.log("Error opening in WebBrowser:", error);
      // Fall back to default browser
      await Linking.openURL(url);
    }
    closeVideoModal();
  };

  // Convert Facebook watch URLs to embed URLs for better loading in WebView
  const getEnhancedVideoUrl = (url) => {
    // For improved security and compatibility, convert to embedded format if possible
    if (url.includes("facebook.com/watch") && url.includes("v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D${videoId}&show_text=0`;
    }

    if (url.includes("facebook.com") && url.includes("/videos/")) {
      // Extract the video ID for other facebook video URL formats
      const matches = url.match(/\/videos\/(\d+)/);
      if (matches && matches[1]) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          url
        )}&show_text=0`;
      }
    }

    return url;
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDark ? "light" : "auto"} />

      <View
        style={[
          styles.header,
          { backgroundColor: isDark ? colors.primaryDark : colors.primary },
        ]}
      >
        <ThemedText style={styles.headerTitle}>
          {translations.videos.title}
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {translations.videos.subtitle}
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videosContainer}>
          {videos.map((video, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.videoCard,
                {
                  backgroundColor: isDark
                    ? colors.darkElevated || "#2C2C2C"
                    : "#f5f5f5",
                },
              ]}
              onPress={() => handleVideoPress(video)}
            >
              <View style={styles.thumbnailContainer}>
                <Image source={video.thumbnail} style={styles.thumbnail} />
                <View style={styles.durationBadge}>
                  <ThemedText style={styles.durationText}>
                    {video.duration}
                  </ThemedText>
                </View>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
              </View>
              <View style={styles.videoContent}>
                <ThemedText
                  style={[styles.videoTitle, isRtl && styles.rtlText]}
                >
                  {getTitle(video)}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.videoDescription,
                    isRtl && styles.rtlText,
                    isDark && { color: colors.grayMedium },
                  ]}
                  numberOfLines={2}
                >
                  {getDescription(video)}
                </ThemedText>
                <TouchableOpacity
                  style={[
                    styles.watchButton,
                    { backgroundColor: colors.primaryLight },
                  ]}
                  onPress={() => handleVideoPress(video)}
                >
                  <ThemedText style={styles.watchButtonText}>
                    {translations.videos.watchNow}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Video Modal - only used on iOS or as Android fallback */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={videoModalVisible}
        onRequestClose={closeVideoModal}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: isDark ? colors.darkBackground : "#fff" },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                borderBottomColor: isDark ? "rgba(255,255,255,0.1)" : "#eee",
              },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeVideoModal}
            >
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle} numberOfLines={1}>
              {selectedVideo ? getTitle(selectedVideo) : ""}
            </ThemedText>

            {/* External browser button */}
            <TouchableOpacity
              style={styles.externalBrowserButton}
              onPress={() =>
                selectedVideo && openInExternalBrowser(selectedVideo.url)
              }
            >
              <Ionicons name="open-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {selectedVideo && (
            <>
              <WebView
                key="webViewKey"
                source={{
                  uri: getEnhancedVideoUrl(selectedVideo.url),
                }}
                style={isLoading || loadError ? { height: 0 } : styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                allowsFullscreenVideo={true}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                onError={handleWebViewError}
                onHttpError={handleWebViewError}
                onShouldStartLoadWithRequest={() => true}
                // WebView config for better compatibility
                androidHardwareAccelerationDisabled={true}
                originWhitelist={["*"]}
                mixedContentMode="compatibility"
                thirdPartyCookiesEnabled={true}
              />

              {isLoading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <ThemedText style={styles.loadingText}>
                    {language === "ar" ? "جاري التحميل..." : "Loading..."}
                  </ThemedText>
                </View>
              )}

              {loadError && (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={48}
                    color={colors.error || "#ff3b30"}
                  />
                  <ThemedText style={styles.errorText}>
                    {language === "ar"
                      ? "حدث خطأ أثناء تحميل الفيديو"
                      : "Error loading video"}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.errorDescription,
                      isDark && { color: colors.grayMedium },
                    ]}
                  >
                    {language === "ar"
                      ? "قد يكون ذلك بسبب مشكلة في شهادة الأمان أو قيود Facebook"
                      : "This may be due to an SSL certificate issue or Facebook restrictions"}
                  </ThemedText>
                  <TouchableOpacity
                    style={[
                      styles.externalLinkButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => openInExternalBrowser(selectedVideo.url)}
                  >
                    <ThemedText style={styles.externalLinkButtonText}>
                      {language === "ar" ? "فتح في المتصفح" : "Open in Browser"}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </Modal>
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
  videosContainer: {
    padding: 20,
  },
  videoCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  durationBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -22 }, { translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoContent: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  watchButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  watchButtonText: {
    fontWeight: "500",
    color: "#fff",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    flex: 1,
  },
  externalBrowserButton: {
    padding: 8,
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  errorDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  externalLinkButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  externalLinkButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
