import React, { createContext, ReactNode, useContext, useState } from "react";
import quizData from "../assets/data/quizData";
import { translations } from "../assets/translations";

// Define types
type QuizResult = {
  type: string;
  title: string;
  description: string;
  advice: string;
  titleEn: string;
  descriptionEn: string;
  adviceEn: string;
};

type AppContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  quizAnswers: string[];
  setQuizAnswers: (answers: string[]) => void;
  quizResult: QuizResult | null;
  calculateQuizResult: () => QuizResult | null;
  resetQuiz: () => void;
  translations: any;
};

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState("ar"); // Default to Arabic
  const [quizAnswers, setQuizAnswers] = useState<string[]>(
    Array(quizData.questions.length).fill("")
  );
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Calculate quiz result based on answers
  const calculateQuizResult = () => {
    // Count the occurrences of each answer type (a, b, c, d)
    const counts: { [key: string]: number } = quizAnswers.reduce((acc, val) => {
      if (val) {
        acc[val] = (acc[val] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    // Find the most frequent answer type
    let maxCount = 0;
    let dominantType = "";

    for (const type in counts) {
      if (counts[type] > maxCount) {
        maxCount = counts[type];
        dominantType = type;
      }
    }

    // Find the corresponding result
    const result =
      quizData.results.find((res) => res.type === dominantType) || null;
    setQuizResult(result);
    return result; // Return the result so we can use it directly
  };

  // Reset quiz
  const resetQuiz = () => {
    setQuizAnswers(Array(quizData.questions.length).fill(""));
    setQuizResult(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        quizAnswers,
        setQuizAnswers,
        quizResult,
        calculateQuizResult,
        resetQuiz,
        translations: translations[language] || translations.ar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
