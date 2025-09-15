
import { supabase } from "@/integrations/supabase/client";
import { FeedbackData } from "@/types/feedback";

// Check if we're online
const isOnline = () => navigator.onLine;

// Store feedback locally when offline
const storeFeedbackLocally = (feedback: Omit<FeedbackData, "id" | "timestamp">) => {
  try {
    const localFeedbacks = JSON.parse(localStorage.getItem('pendingFeedbacks') || '[]');
    const feedbackWithId = {
      ...feedback,
      id: `local_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    localFeedbacks.push(feedbackWithId);
    localStorage.setItem('pendingFeedbacks', JSON.stringify(localFeedbacks));
    console.log('Feedback stored locally for later submission');
    return true;
  } catch (error) {
    console.error('Error storing feedback locally:', error);
    return false;
  }
};

// Queue feedback for background sync
const queueFeedbackForSync = (feedback: Omit<FeedbackData, "id" | "timestamp">) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.active) {
        registration.active.postMessage({
          type: 'QUEUE_SUBMISSION',
          data: feedback
        });
      }
    });
  }
};

// Retry mechanism for failed submissions
const retrySubmission = async (feedback: Omit<FeedbackData, "id" | "timestamp">, maxRetries = 3): Promise<{ success: boolean; error?: string }> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to submit feedback:`, feedback);
      
      const { data, error } = await supabase
        .from('feedbacks')
        .insert({
          demographic: feedback.demographic,
          financial_habits: feedback.financialHabits,
          reaction_to_tenga_pesa: feedback.reactionToTengaPesa,
          final_thoughts: feedback.finalThoughts
        })
        .select()
        .single();

      if (error) {
        console.error(`Supabase error (attempt ${attempt}):`, error);
        if (attempt === maxRetries) {
          return { 
            success: false, 
            error: error.message 
          };
        }
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        continue;
      }

      console.log('Feedback submitted successfully:', data);
      return { success: true };
    } catch (error) {
      console.error(`Error submitting feedback (attempt ${attempt}):`, error);
      if (attempt === maxRetries) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to submit feedback'
        };
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  return { success: false, error: 'Max retries exceeded' };
};

export const submitFeedback = async (feedback: Omit<FeedbackData, "id" | "timestamp">): Promise<{ success: boolean; error?: string }> => {
  // If offline, store locally and queue for sync
  if (!isOnline()) {
    console.log('Offline detected, storing feedback locally');
    const stored = storeFeedbackLocally(feedback);
    queueFeedbackForSync(feedback);
    
    return { 
      success: stored, 
      error: stored ? undefined : 'Failed to store feedback locally'
    };
  }

  // Try to submit immediately with retry logic
  const result = await retrySubmission(feedback);
  
  // If submission failed, store locally as backup
  if (!result.success) {
    console.log('Submission failed, storing feedback locally as backup');
    storeFeedbackLocally(feedback);
    queueFeedbackForSync(feedback);
  }
  
  return result;
};

// Process pending feedbacks from local storage
export const processPendingFeedbacks = async (): Promise<void> => {
  if (!isOnline()) {
    console.log('Offline - skipping pending feedbacks processing');
    return;
  }

  try {
    const pendingFeedbacks = JSON.parse(localStorage.getItem('pendingFeedbacks') || '[]');
    
    if (pendingFeedbacks.length === 0) {
      console.log('No pending feedbacks to process');
      return;
    }

    console.log(`Processing ${pendingFeedbacks.length} pending feedbacks...`);
    
    const successfulSubmissions: string[] = [];
    
    for (const feedback of pendingFeedbacks) {
      const result = await retrySubmission(feedback);
      if (result.success) {
        successfulSubmissions.push(feedback.id);
        console.log('Successfully submitted pending feedback:', feedback.id);
      } else {
        console.error('Failed to submit pending feedback:', feedback.id, result.error);
      }
    }
    
    // Remove successfully submitted feedbacks from local storage
    if (successfulSubmissions.length > 0) {
      const remainingFeedbacks = pendingFeedbacks.filter(
        (fb: any) => !successfulSubmissions.includes(fb.id)
      );
      localStorage.setItem('pendingFeedbacks', JSON.stringify(remainingFeedbacks));
      console.log(`Removed ${successfulSubmissions.length} successfully submitted feedbacks from local storage`);
    }
  } catch (error) {
    console.error('Error processing pending feedbacks:', error);
  }
};

// Get pending feedbacks count
export const getPendingFeedbacksCount = (): number => {
  try {
    const pendingFeedbacks = JSON.parse(localStorage.getItem('pendingFeedbacks') || '[]');
    return pendingFeedbacks.length;
  } catch (error) {
    console.error('Error getting pending feedbacks count:', error);
    return 0;
  }
};

export const getFeedbacks = async (): Promise<FeedbackData[]> => {
  try {
    console.log('Fetching feedbacks from Supabase...');
    
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    console.log('Feedbacks fetched successfully:', data);
    
    // Transform the data to match the FeedbackData interface
    const transformedData: FeedbackData[] = data.map(item => ({
      id: item.id,
      timestamp: item.timestamp || new Date().toISOString(),
      demographic: item.demographic as FeedbackData['demographic'],
      financialHabits: item.financial_habits as FeedbackData['financialHabits'],
      reactionToTengaPesa: item.reaction_to_tenga_pesa as FeedbackData['reactionToTengaPesa'],
      finalThoughts: item.final_thoughts as FeedbackData['finalThoughts']
    }));

    return transformedData;
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    return [];
  }
};
