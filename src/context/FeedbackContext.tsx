
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FeedbackData } from '@/types/feedback';
import { submitFeedback, getFeedbacks } from '@/services/feedbackService';
import { toast } from '@/components/ui/sonner';

interface FeedbackContextType {
  feedbacks: FeedbackData[];
  addFeedback: (feedback: Omit<FeedbackData, "id" | "timestamp">) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  refetchFeedbacks: () => Promise<void>;
}

export const FeedbackContext = createContext<FeedbackContextType>({
  feedbacks: [],
  addFeedback: async () => false,
  isLoading: false,
  error: null,
  refetchFeedbacks: async () => {},
});

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching feedbacks from Supabase...');
      const data = await getFeedbacks();
      console.log('Feedbacks fetched successfully:', data);
      setFeedbacks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load feedback data';
      console.error('Error fetching feedbacks:', errorMessage);
      setError(errorMessage);
      toast.error('Failed to load feedback data');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const addFeedback = async (feedback: Omit<FeedbackData, "id" | "timestamp">) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await submitFeedback(feedback);
      if (result.success) {
        await fetchFeedbacks();
        toast.success('Feedback submitted successfully');
        return true;
      } else {
        const errorMessage = result.error || 'Failed to submit feedback';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit feedback';
      console.error('Error adding feedback:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount - no dependencies to avoid loops
  useEffect(() => {
    fetchFeedbacks();
  }, []);

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
