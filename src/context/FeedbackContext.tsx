
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FeedbackData } from '@/types/feedback';
import { submitFeedback, getFeedbacks } from '@/services/feedbackService';

interface FeedbackContextType {
  feedbacks: FeedbackData[];
  addFeedback: (feedback: Omit<FeedbackData, "id" | "timestamp">) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  refetchFeedbacks: () => Promise<void>;
}

const FeedbackContext = createContext<FeedbackContextType>({
  feedbacks: [],
  addFeedback: async () => false,
  isLoading: false,
  error: null,
  refetchFeedbacks: async () => {},
});

export const useFeedback = () => useContext(FeedbackContext);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedback data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const addFeedback = async (feedback: Omit<FeedbackData, "id" | "timestamp">) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await submitFeedback(feedback);
      if (result.success) {
        await fetchFeedbacks();
        return true;
      } else {
        setError(result.error || 'Failed to submit feedback');
        return false;
      }
    } catch (err) {
      console.error('Error adding feedback:', err);
      setError('Failed to submit feedback');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeedbackContext.Provider value={{ 
      feedbacks, 
      addFeedback, 
      isLoading, 
      error,
      refetchFeedbacks: fetchFeedbacks 
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};
