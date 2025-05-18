
export interface FeedbackData {
  id: string;
  timestamp: string;
  demographic: {
    ageGroup: string;
    occupation: string;
    incomeRange: string;
    usesMpesa: boolean;
  };
  financialHabits: {
    followsBudget: string;
    mostSpendingAreas: string[];
    runsOutOfMoney: string;
    savesMoney: string;
  };
  reactionToTengaPesa: {
    wouldUseFeature: string;
    findWithdrawalRulesHelpful: string;
    feelingAboutPenalty: string;
    wantsSpendingInsights: string;
  };
  finalThoughts: {
    thinksTengaPesaHelps: string;
    desiredFeatures: string;
    concerns: string;
  };
}
