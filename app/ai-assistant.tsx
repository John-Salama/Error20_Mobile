import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Colors } from "../constants/Colors";
import { useAppContext } from "../context/AppContext";
import { useColorScheme } from "../hooks/useColorScheme";
import { formatHistoryForAPI, getAIResponse } from "../services/aiService";

// Define message types for the chat
type MessageType = {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

// Fallback responses in case the API is unavailable
// These will be used as a backup or when offline
const fallbackResponses = {
  greeting: {
    ar: "مرحباً! أنا المساعد الذكي من Error 20. كيف يمكنني مساعدتك اليوم في رحلتك لتخطي أزمة ربع العمر؟",
    en: "Hello! I am the AI assistant from Error 20. How can I help you today in your journey to overcome the quarter-life crisis?",
  },
  error: {
    ar: "عذراً، حدث خطأ. هل يمكنك المحاولة مرة أخرى؟",
    en: "Sorry, an error occurred. Could you try again?",
  },
  offline: {
    ar: "يبدو أنك غير متصل بالإنترنت. سأستخدم ردوداً محدودة حتى تعود للاتصال.",
    en: "It seems you're offline. I'll use limited responses until you're connected again.",
  },
};

// Generate a unique ID for messages
const generateId = () => Math.random().toString(36).substring(2, 15);

export default function AIAssistantScreen() {
  const { language, quizResult } = useAppContext();
  const router = useRouter();
  const isRtl = language === "ar";
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // To track online status

  const flatListRef = useRef<FlatList>(null);

  // Initialize with greeting message
  useEffect(() => {
    const greetingMessage: MessageType = {
      id: generateId(),
      text: fallbackResponses.greeting[language === "ar" ? "ar" : "en"],
      sender: "assistant",
      timestamp: new Date(),
    };
    setMessages([greetingMessage]);
  }, [language]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Send a message
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Add user message to the chat
    const userMessage: MessageType = {
      id: generateId(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Format conversation history for the API
      const history = formatHistoryForAPI(messages);

      // Get stage info from quiz results if available
      const stageInfo = quizResult?.type;

      // Get response from the AI service
      const response = await getAIResponse(
        inputText,
        history,
        language === "ar" ? "ar" : "en",
        stageInfo
      );

      // If there was an error getting a response
      if (response.error) {
        console.warn("AI Response Error:", response.error);
      }

      // Add AI response to the chat
      const aiMessage: MessageType = {
        id: generateId(),
        text: response.text,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Add fallback error message
      const errorMessage: MessageType = {
        id: generateId(),
        text: fallbackResponses.error[language === "ar" ? "ar" : "en"],
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      // Show alert about the error
      Alert.alert(
        language === "ar" ? "خطأ" : "Error",
        language === "ar"
          ? "حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."
          : "An error occurred while connecting to the AI assistant. Please check your internet connection and try again."
      );
    } finally {
      setIsTyping(false);
    }
  };

  // Render a single message - fixed version
  const renderMessage = ({ item }: { item: MessageType }) => {
    const isUser = item.sender === "user";

    // Improved message text handling
    let messageContent = "Error: Could not display message";
    try {
      if (item.text === null || item.text === undefined) {
        messageContent = "No message content";
      } else if (typeof item.text === "string") {
        messageContent = item.text;
      } else if (typeof item.text === "function") {
        // Handle case where text is a function (which should never happen in the UI layer)
        console.warn(
          "Message text is a function, this should be handled in the service layer"
        );
        messageContent = "Error: Message has incorrect format";
      } else {
        // Convert any other type to string as a fallback
        messageContent = String(item.text);
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
          isRtl && isUser && styles.userMessageContainerRtl,
          isRtl && !isUser && styles.aiMessageContainerRtl,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser
              ? [styles.userBubble, { backgroundColor: colors.primary }]
              : [
                  styles.aiBubble,
                  {
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.darkElevated || "#2C2C2C"
                        : "#f1f1f1",
                  },
                ],
          ]}
        >
          <ThemedText
            style={[
              styles.messageText,
              isUser
                ? styles.userMessageText
                : [
                    styles.aiMessageText,
                    { color: colorScheme === "dark" ? colors.text : "#333" },
                  ],
              isRtl && styles.rtlText,
            ]}
          >
            {messageContent}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor:
              colorScheme === "dark" ? "#332A40" : colors.primaryDark,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <ThemedText style={styles.headerTitle}>
          {language === "ar" ? "المساعد الذكي" : "AI Assistant"}
        </ThemedText>

        <View
          style={[styles.onlineIndicator, !isOnline && styles.offlineIndicator]}
        />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing indicator */}
      {isTyping && (
        <View
          style={[styles.typingContainer, isRtl && styles.typingContainerRtl]}
        >
          <View
            style={[
              styles.typingBubble,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? colors.darkElevated || "#2C2C2C"
                    : "#f1f1f1",
              },
            ]}
          >
            <ActivityIndicator size="small" color={colors.primary} />
            <ThemedText
              style={[
                styles.typingText,
                { color: colorScheme === "dark" ? "#B0B0B0" : "#666" },
              ]}
            >
              {language === "ar" ? "يكتب..." : "Typing..."}
            </ThemedText>
          </View>
        </View>
      )}

      {/* Input area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={[
          styles.inputContainer,
          {
            borderTopColor:
              colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#eee",
          },
        ]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              isRtl && styles.rtlText,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? colors.darkElevated || "#2C2C2C"
                    : "#f5f5f5",
                color: colorScheme === "dark" ? colors.text : "#333",
              },
            ]}
            placeholder={
              language === "ar"
                ? "اكتب رسالتك هنا..."
                : "Type your message here..."
            }
            placeholderTextColor={colorScheme === "dark" ? "#888" : "#999"}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={200}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: colors.primary },
              !inputText.trim() && [
                styles.disabledSendButton,
                { backgroundColor: colorScheme === "dark" ? "#444" : "#ccc" },
              ],
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ThemedText
          style={[
            styles.disclaimer,
            { color: colorScheme === "dark" ? "#999" : "#999" },
          ]}
        >
          {language === "ar"
            ? "هذا مساعد ذكي يقدم نصائح عامة. للحالات الطارئة، يرجى الاتصال بمختص."
            : "This is an AI assistant providing general advice. For emergencies, please contact a professional."}
        </ThemedText>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    marginLeft: 8,
  },
  offlineIndicator: {
    backgroundColor: "#ff5252",
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "flex-end",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
    marginLeft: 40,
  },
  aiMessageContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    marginRight: 40,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#dcf8c6",
    borderTopRightRadius: 0, // simulate WhatsApp "tail"
  },
  aiBubble: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 0, // simulate WhatsApp "tail"
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#000",
  },
  aiMessageText: {
    color: "#000",
  },
  typingContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  typingContainerRtl: {
    alignItems: "flex-end",
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  typingText: {
    fontSize: 14,
    marginLeft: 6,
  },
  inputContainer: {
    borderTopWidth: 1,
    padding: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 45,
    maxHeight: 120,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledSendButton: {
    opacity: 0.5,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});
