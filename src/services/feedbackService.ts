
import { supabase } from "@/integrations/supabase/client";
import { FeedbackData } from "@/types/feedback";

export const submitFeedback = async (feedback: Omit<FeedbackData, "id" | "timestamp">): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Submitting feedback to Supabase:', feedback);
    
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
      console.error('Supabase error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    console.log('Feedback submitted successfully:', data);
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
