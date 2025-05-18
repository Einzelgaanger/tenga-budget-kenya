
import { supabase } from "@/integrations/supabase/client";
import { FeedbackData } from "@/types/feedback";

export const submitFeedback = async (feedback: Omit<FeedbackData, "id" | "timestamp">): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert({
        demographic: feedback.demographic,
        financial_habits: feedback.financialHabits,
        reaction_to_tenga_pesa: feedback.reactionToTengaPesa,
        final_thoughts: feedback.finalThoughts
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to submit feedback'
    };
  }
};

export const getFeedbacks = async (): Promise<FeedbackData[]> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    
    // Transform from database format to app format
    return (data || []).map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      demographic: item.demographic,
      financialHabits: item.financial_habits,
      reactionToTengaPesa: item.reaction_to_tenga_pesa,
      finalThoughts: item.final_thoughts
    }));
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return [];
  }
};
