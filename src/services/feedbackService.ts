import { FeedbackData } from "@/types/feedback";

const STORAGE_KEY = 'tenga_feedback_data';

// Helper to generate UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper to get stored feedbacks
const getStoredFeedbacks = (): FeedbackData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Import sample data only when needed
      import('./sampleData').then(({ sampleFeedbacks }) => {
        saveFeedbacks(sampleFeedbacks);
      });
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Helper to save feedbacks
const saveFeedbacks = (feedbacks: FeedbackData[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const submitFeedback = async (feedback: Omit<FeedbackData, "id" | "timestamp">): Promise<{ success: boolean; error?: string }> => {
  try {
    const feedbacks = getStoredFeedbacks();
    const newFeedback: FeedbackData = {
      ...feedback,
      id: generateId(),
      timestamp: new Date().toISOString()
    };
    
    feedbacks.push(newFeedback);
    saveFeedbacks(feedbacks);
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit feedback'
    };
  }
};

export const getFeedbacks = async (): Promise<FeedbackData[]> => {
  try {
    const feedbacks = getStoredFeedbacks();
    return feedbacks.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    return [];
  }
};
