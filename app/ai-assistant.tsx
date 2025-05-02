import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

// Define message types for the chat
type MessageType = {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

// Sample AI responses based on different stages
const aiResponses = {
  greeting: {
    ar: "مرحباً! أنا المساعد الذكي من Error 20. كيف يمكنني مساعدتك اليوم في رحلتك لتخطي أزمة ربع العمر؟",
    en: "Hello! I am the AI assistant from Error 20. How can I help you today in your journey to overcome the quarter-life crisis?",
  },
  stages: {
    a: {
      // التيه (Lost) stage
      ar: "أفهم أنك تشعر بالضياع في هذه المرحلة. هذا طبيعي تماماً. يمكنني مساعدتك في إيجاد مساحة آمنة والبدء بخطوات صغيرة.",
      en: "I understand that you feel lost at this stage. This is completely normal. I can help you find a safe space and start with small steps.",
    },
    b: {
      // الإدراك (Awareness) stage
      ar: "أنت في مرحلة الإدراك، بدأت تلاحظ ما يحدث حولك وبداخلك. دعنا نعمل على تفكيك أفكارك ومخاوفك.",
      en: "You are in the awareness stage, you have started noticing what is happening around and within you. Let's work on breaking down your thoughts and fears.",
    },
    c: {
      // النمو (Growth) stage
      ar: "أنت في رحلة نمو مستمرة! هذا رائع. دعنا نركز على توسيع وعيك وتعميق نيتك لتحقيق أهدافك.",
      en: "You are on a continuous growth journey! That's great. Let's focus on expanding your awareness and deepening your intention to achieve your goals.",
    },
    d: {
      // الاتساق (Consistency) stage
      ar: "تعيش بوعي واتصال حقيقي مع ذاتك - هذا إنجاز رائع! كيف يمكنني مساعدتك في مشاركة تجربتك ودعم الآخرين؟",
      en: "You live with awareness and a genuine connection to yourself - that's an amazing achievement! How can I help you share your experience and support others?",
    },
  },
  common: {
    motivation: {
      ar: [
        "تذكر أن كل رحلة تبدأ بخطوة واحدة. أنت لست وحدك في هذه المرحلة.",
        "الوعي الذاتي هو أول خطوة نحو التغيير الحقيقي. استمر في الاستماع لذاتك.",
        "من المهم أن تحتفل بالإنجازات الصغيرة. كل خطوة صغيرة هي انتصار.",
      ],
      en: [
        "Remember that every journey begins with a single step. You are not alone in this stage.",
        "Self-awareness is the first step towards real change. Keep listening to yourself.",
        "It's important to celebrate small achievements. Every small step is a victory.",
      ],
    },
    resources: {
      ar: [
        "هل جربت منصة إدراك؟ هناك دورات مجانية قد تساعدك في هذه المرحلة.",
        "أنصحك بالتواصل مع مستشار مهني من Career180 للمساعدة في تحديد مسارك.",
        "التحدث مع معالج نفسي قد يكون مفيداً جداً. يمكنك تجربة تطبيق Shezlong للجلسات عبر الإنترنت.",
      ],
      en: [
        "Have you tried the Edraak platform? There are free courses that might help you at this stage.",
        "I recommend connecting with a career counselor from Career180 to help determine your path.",
        "Talking with a therapist can be very helpful. You can try the Shezlong app for online sessions.",
      ],
    },
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

  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: generateId(),
      text: aiResponses.greeting[language === "ar" ? "ar" : "en"],
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Send a message
  const sendMessage = () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: MessageType = {
      id: generateId(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiReply = generateAIResponse(inputText);
      const aiMessage: MessageType = {
        id: generateId(),
        text: aiReply,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500); // 1.5s delay to simulate processing
  };

  // Generate appropriate AI response based on user input
  const generateAIResponse = (userText: string) => {
    const lowerText = userText.toLowerCase();

    // Check if text contains keywords related to feeling lost/confused
    if (
      lowerText.includes("lost") ||
      lowerText.includes("confused") ||
      lowerText.includes("ضائع") ||
      lowerText.includes("حائر")
    ) {
      return language === "ar"
        ? aiResponses.stages["a"].ar
        : aiResponses.stages["a"].en;
    }

    // Check if text is asking about resources
    if (
      lowerText.includes("resource") ||
      lowerText.includes("help") ||
      lowerText.includes("book") ||
      lowerText.includes("موارد") ||
      lowerText.includes("مساعدة") ||
      lowerText.includes("كتب")
    ) {
      const resourceResponses =
        aiResponses.common.resources[language === "ar" ? "ar" : "en"];
      return resourceResponses[
        Math.floor(Math.random() * resourceResponses.length)
      ];
    }

    // If user mentions motivation or feeling down
    if (
      lowerText.includes("motivat") ||
      lowerText.includes("down") ||
      lowerText.includes("sad") ||
      lowerText.includes("تحفيز") ||
      lowerText.includes("حزين")
    ) {
      const motivationResponses =
        aiResponses.common.motivation[language === "ar" ? "ar" : "en"];
      return motivationResponses[
        Math.floor(Math.random() * motivationResponses.length)
      ];
    }

    // If quiz result exists, reference it
    if (quizResult) {
      return language === "ar"
        ? aiResponses.stages[quizResult.type as keyof typeof aiResponses.stages]
            .ar
        : aiResponses.stages[quizResult.type as keyof typeof aiResponses.stages]
            .en;
    }

    // Default responses
    const defaultResponses = {
      ar: [
        "هذا سؤال مهم. دعنا نفكر فيه معاً.",
        "أفهم ما تشعر به. ما الخطوة التي تفكر بها الآن؟",
        "شكراً لمشاركة أفكارك. هل جربت أن تدون مشاعرك في مذكرة يومية؟",
      ],
      en: [
        "That's an important question. Let's think about it together.",
        "I understand what you're feeling. What step are you considering now?",
        "Thank you for sharing your thoughts. Have you tried writing your feelings in a daily journal?",
      ],
    };

    const responses = defaultResponses[language === "ar" ? "ar" : "en"];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Render a single message
  const renderMessage = ({ item }: { item: MessageType }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
          isRtl && isUser && styles.userMessageContainerRtl,
          isRtl && !isUser && styles.aiMessageContainerRtl,
        ]}
      >
        {!isUser && (
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <ThemedText style={styles.avatarText}>E20</ThemedText>
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser
              ? [styles.userBubble, { backgroundColor: colors.primary }]
              : styles.aiBubble,
          ]}
        >
          <ThemedText
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.aiMessageText,
              isRtl && styles.rtlText,
            ]}
          >
            {item.text}
          </ThemedText>
        </View>

        {isUser && (
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="person" size={16} color="#ffffff" />
          </View>
        )}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primaryDark }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <ThemedText style={styles.headerTitle}>
          {language === "ar" ? "المساعد الذكي" : "AI Assistant"}
        </ThemedText>

        <View style={styles.onlineIndicator} />
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
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color={colors.primary} />
            <ThemedText style={styles.typingText}>
              {language === "ar" ? "يكتب..." : "Typing..."}
            </ThemedText>
          </View>
        </View>
      )}

      {/* Input area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isRtl && styles.rtlText]}
            placeholder={
              language === "ar"
                ? "اكتب رسالتك هنا..."
                : "Type your message here..."
            }
            placeholderTextColor="#999"
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
              !inputText.trim() && styles.disabledSendButton,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.disclaimer}>
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
  messagesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 20,
  },
  messageContainer: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: "85%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  aiMessageContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  userMessageContainerRtl: {
    flexDirection: "row-reverse",
  },
  aiMessageContainerRtl: {
    flexDirection: "row-reverse",
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  avatarText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  messageBubble: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 15,
    maxWidth: "90%",
  },
  userBubble: {
    borderTopRightRadius: 0,
  },
  aiBubble: {
    backgroundColor: "#f1f1f1",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  aiMessageText: {
    color: "#333",
  },
  typingContainer: {
    paddingLeft: 15,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  typingContainerRtl: {
    paddingRight: 15,
    alignItems: "flex-end",
  },
  typingBubble: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: "center",
  },
  typingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 16,
    marginRight: 10,
    minHeight: 45,
    maxHeight: 100,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledSendButton: {
    backgroundColor: "#ccc",
  },
  disclaimer: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});
