
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { FeedbackData } from '@/types/feedback';

interface FeedbackContextType {
  feedbacks: FeedbackData[];
  addFeedback: (feedback: FeedbackData) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);

  const addFeedback = (feedback: FeedbackData) => {
    setFeedbacks((prev) => [...prev, feedback]);
  };

  return (
    <FeedbackContext.Provider value={{ feedbacks, addFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};
