
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

// Hook moved to src/hooks/use-feedback.ts

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchFeedbacks = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getFeedbacks();
      setFeedbacks(data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load feedback data';
      console.error('Error fetching feedbacks:', errorMessage);
      setError(errorMessage);
      
      // Only show toast on first error
      if (retryCount === 0) {
        toast.error('Failed to load feedback data');
      }
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, retryCount]);

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

  // Initial fetch on mount
  useEffect(() => {
    let mounted = true;
    
    const initFetch = async () => {
      if (!mounted) return;
      await fetchFeedbacks();
    };

    initFetch();

    return () => {
      mounted = false;
    };
  }, [fetchFeedbacks]);

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
