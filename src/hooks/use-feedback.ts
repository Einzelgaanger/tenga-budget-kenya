
import { useContext } from 'react';
import { FeedbackContext } from '@/context/FeedbackContext';

export const useFeedback = () => useContext(FeedbackContext);
