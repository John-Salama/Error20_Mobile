import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual API key when you get it
// For security, consider using environment variables or a secure storage method
const API_KEY = "AIzaSyDT-Rh_bD3IVvbJi_NwyU3KXHc8FEU8xKI";

// Create a client instance with the correct API version
const genAI = new GoogleGenerativeAI(API_KEY, { apiVersion: "v1" });

// Define the AI model to use - Gemini Pro is a good balance of capability and speed
const modelName = "gemini-1.5-pro"; // Updated to current model name

// Create context for the AI to understand the quarter-life crisis topic
const QUARTER_LIFE_CRISIS_CONTEXT = `
You are an empathetic AI assistant specialized in helping young adults navigate quarter-life crises.
Your purpose is to provide thoughtful, supportive responses about career uncertainty, identity questions, 
relationship challenges, and life transitions that people typically face in their 20s and early 30s.
Be compassionate, non-judgmental, and offer practical advice when appropriate.
Avoid generic platitudes and focus on helping the person feel understood and providing actionable insights.
If someone appears to be in distress or mentions harmful thoughts, always encourage them to seek 
professional help and provide appropriate disclaimers.
`;

// Create a history object to track conversation for context
type Part = {
  text: string;
};

type MessageHistory = {
  role: "user" | "model";
  parts: Part[];
};

// Interface for the service
interface AIServiceResponse {
  text: string;
  error?: string;
}

/**
 * Helper function to safely extract text from Gemini API response
 * Handles both function and property formats of response.text
 */
function safelyExtractResponseText(response: any): string {
  try {
    // Case 1: text is a function that returns a string
    if (typeof response.text === "function") {
      const textResult = response.text();
      if (typeof textResult === "string") {
        return textResult;
      }
    }

    // Case 2: text is directly a string property
    if (typeof response.text === "string") {
      return response.text;
    }

    // Case 3: text is something else - try to convert to string
    if (response.text !== undefined && response.text !== null) {
      return String(response.text);
    }

    // Case 4: Try to use the entire response as string as last resort
    if (typeof response === "string") {
      return response;
    }

    // Fallback if nothing worked
    console.warn("Could not extract text from AI response:", response);
    return "I'm sorry, I couldn't generate a proper response. Please try again.";
  } catch (error) {
    console.error("Error extracting text from AI response:", error);
    return "An error occurred while processing the AI response.";
  }
}

/**
 * Sends a message to the Gemini API and gets a response
 * @param message User's message
 * @param history Previous conversation history (optional)
 * @param language Language code (en or ar)
 * @param stage Optional stage information from quiz results
 * @returns AI response text or error message
 */
export async function getAIResponse(
  message: string,
  history: MessageHistory[] = [],
  language: "en" | "ar" = "en",
  stage?: string
): Promise<AIServiceResponse> {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: modelName });

    // Build context-specific prompt
    let contextPrompt = QUARTER_LIFE_CRISIS_CONTEXT;

    // Add language preference
    if (language === "ar") {
      contextPrompt +=
        "\nRespond in Arabic language. Make sure your responses are culturally appropriate.";
    }

    // Add stage information if available
    if (stage) {
      contextPrompt += `\nThe user is currently in the "${stage}" stage of their quarter-life crisis journey.`;
    }

    // Handle history correctly
    let chatHistory = [...history];

    // Start a chat with the properly formatted history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    });

    // If this is a new conversation, send the context first
    if (history.length === 0) {
      // Send the context as a system message (treated as user message in Gemini)
      await chat.sendMessage([{ text: contextPrompt }]);
    }

    // Send the user's message and get response
    const result = await chat.sendMessage([{ text: message }]);

    // Safely extract text from the response using our helper function
    const responseText = safelyExtractResponseText(result.response);

    return { text: responseText };
  } catch (error) {
    console.error("AI API Error:", error);
    // Return appropriate error message based on language
    const errorMessage =
      language === "ar"
        ? "عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى."
        : "Sorry, an error occurred while connecting to the AI assistant. Please try again.";

    return {
      text: errorMessage,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Format conversation history for the Gemini API
 * @param messages The app's message history
 * @returns Formatted history for the Gemini API
 */
export function formatHistoryForAPI(messages: any[]): MessageHistory[] {
  // Skip the initial greeting message from the assistant if it exists
  const messagesToFormat =
    messages.length > 0 && messages[0].sender === "assistant"
      ? messages.slice(1)
      : messages;

  // Return formatted messages with guaranteed string text values
  return messagesToFormat.map((message) => ({
    role: message.sender === "user" ? "user" : "model",
    parts: [
      {
        text:
          typeof message.text === "string"
            ? message.text
            : String(message.text || ""),
      },
    ],
  }));
}
