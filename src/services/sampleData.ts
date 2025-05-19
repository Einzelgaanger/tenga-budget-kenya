import { FeedbackData } from "@/types/feedback";

export const sampleFeedbacks: FeedbackData[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    demographic: {
      ageGroup: "25-34",
      occupation: "Employed",
      incomeRange: "50,000 - 100,000",
      usesMpesa: true
    },
    financialHabits: {
      followsBudget: "Sometimes",
      mostSpendingAreas: ["Food", "Transport", "Entertainment"],
      runsOutOfMoney: "Occasionally",
      savesMoney: "Monthly"
    },
    reactionToTengaPesa: {
      wouldUseFeature: "Definitely",
      findWithdrawalRulesHelpful: "Very Helpful",
      feelingAboutPenalty: "Fair",
      wantsSpendingInsights: "Yes"
    },
    finalThoughts: {
      thinksTengaPesaHelps: "Yes",
      desiredFeatures: "Automatic savings goals",
      concerns: "None"
    }
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    demographic: {
      ageGroup: "18-24",
      occupation: "Student",
      incomeRange: "Below 50,000",
      usesMpesa: true
    },
    financialHabits: {
      followsBudget: "Rarely",
      mostSpendingAreas: ["Education", "Food", "Entertainment"],
      runsOutOfMoney: "Frequently",
      savesMoney: "Rarely"
    },
    reactionToTengaPesa: {
      wouldUseFeature: "Maybe",
      findWithdrawalRulesHelpful: "Somewhat Helpful",
      feelingAboutPenalty: "Concerned",
      wantsSpendingInsights: "Maybe"
    },
    finalThoughts: {
      thinksTengaPesaHelps: "Maybe",
      desiredFeatures: "Lower penalties",
      concerns: "Penalty fees too high"
    }
  }
];
