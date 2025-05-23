
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '@/hooks/use-feedback';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

const Feedback = () => {
  const navigate = useNavigate();
  const { addFeedback } = useFeedback();
  
  // State for form data
  const [ageGroup, setAgeGroup] = useState('');
  const [occupation, setOccupation] = useState('');
  const [otherOccupation, setOtherOccupation] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [usesMpesa, setUsesMpesa] = useState<boolean | null>(null);
  
  const [followsBudget, setFollowsBudget] = useState('');
  const [spendingAreas, setSpendingAreas] = useState({
    rent: false,
    food: false,
    transport: false,
    entertainment: false,
    savings: false,
    other: false
  });
  const [otherSpendingArea, setOtherSpendingArea] = useState('');
  const [runsOutOfMoney, setRunsOutOfMoney] = useState('');
  const [savesMoney, setSavesMoney] = useState('');
  
  const [wouldUseFeature, setWouldUseFeature] = useState('');
  const [findWithdrawalRulesHelpful, setFindWithdrawalRulesHelpful] = useState('');
  const [feelingAboutPenalty, setFeelingAboutPenalty] = useState('');
  const [wantsSpendingInsights, setWantsSpendingInsights] = useState('');
  
  const [thinksTengaPesaHelps, setThinksTengaPesaHelps] = useState('');
  const [desiredFeatures, setDesiredFeatures] = useState('');
  const [concerns, setConcerns] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!ageGroup) {
      toast.error("Please select your age group");
      return;
    }
    if (!occupation) {
      toast.error("Please select your occupation");
      return;
    }
    if (!incomeRange) {
      toast.error("Please select your income range");
      return;
    }
    if (usesMpesa === null) {
      toast.error("Please indicate if you use M-PESA");
      return;
    }

    setIsSubmitting(true);
    
    // Gather selected spending areas
    const selectedSpendingAreas = Object.entries(spendingAreas)
      .filter(([_, isChecked]) => isChecked)
      .map(([area, _]) => area === 'other' ? otherSpendingArea : area);
    
    // Create feedback object
    const feedback = {
      demographic: {
        ageGroup,
        occupation: occupation === 'Other' ? otherOccupation : occupation,
        incomeRange,
        usesMpesa: usesMpesa === true
      },
      financialHabits: {
        followsBudget,
        mostSpendingAreas: selectedSpendingAreas,
        runsOutOfMoney,
        savesMoney
      },
      reactionToTengaPesa: {
        wouldUseFeature,
        findWithdrawalRulesHelpful,
        feelingAboutPenalty,
        wantsSpendingInsights
      },
      finalThoughts: {
        thinksTengaPesaHelps,
        desiredFeatures,
        concerns
      }
    };
    
    try {
      // Add feedback to context and database
      const success = await addFeedback(feedback);
      
      if (success) {
        // Show success message
        toast.success("Thank you for your feedback!", {
          description: "Your responses have been recorded successfully."
        });
        
        // Redirect to homepage
        navigate('/');
      } else {
        toast.error("Failed to submit your feedback", {
          description: "Please try again later."
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Something went wrong", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 sm:py-8 px-3 sm:px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center leading-tight">Tenga Pesa Feedback Questionnaire</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center px-2">
            We're collecting opinions about a proposed budgeting feature within M-PESA to help people better manage their money. 
            Your feedback is anonymous and valuable.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Section A: Demographic Information */}
            <Card className="mb-6 sm:mb-8 shadow-md border rounded-lg overflow-hidden">
              <CardHeader className="py-4 sm:py-6 px-4 sm:px-6 bg-gray-50">
                <h2 className="text-lg sm:text-xl font-bold">Section A: Demographic Information</h2>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                {/* Age Group */}
                <div>
                  <Label className="text-sm sm:text-base font-medium mb-2 block">Age Group:</Label>
                  <RadioGroup value={ageGroup} onValueChange={setAgeGroup} className="space-y-3">
                    <div className="flex items-center space-x-3 py-1">
                      <RadioGroupItem value="Under 18" id="age-1" className="h-5 w-5" />
                      <Label htmlFor="age-1" className="text-sm sm:text-base cursor-pointer">Under 18</Label>
                    </div>
                    <div className="flex items-center space-x-3 py-1">
                      <RadioGroupItem value="18-24" id="age-2" className="h-5 w-5" />
                      <Label htmlFor="age-2" className="text-sm sm:text-base cursor-pointer">18-24</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="25-34" id="age-3" />
                      <Label htmlFor="age-3">25-34</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="35-44" id="age-4" />
                      <Label htmlFor="age-4">35-44</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="45-54" id="age-5" />
                      <Label htmlFor="age-5">45-54</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="55+" id="age-6" />
                      <Label htmlFor="age-6">55+</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Occupation */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Occupation:</Label>
                  <RadioGroup value={occupation} onValueChange={setOccupation} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Student" id="occupation-1" />
                      <Label htmlFor="occupation-1">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Employed" id="occupation-2" />
                      <Label htmlFor="occupation-2">Employed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Self-employed" id="occupation-3" />
                      <Label htmlFor="occupation-3">Self-employed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Unemployed" id="occupation-4" />
                      <Label htmlFor="occupation-4">Unemployed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Retired" id="occupation-5" />
                      <Label htmlFor="occupation-5">Retired</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Other" id="occupation-6" />
                      <Label htmlFor="occupation-6">Other</Label>
                    </div>
                  </RadioGroup>
                  
                  {occupation === 'Other' && (
                    <div className="mt-2">
                      <Input
                        placeholder="Please specify"
                        value={otherOccupation}
                        onChange={(e) => setOtherOccupation(e.target.value)}
                        className="max-w-md"
                      />
                    </div>
                  )}
                </div>
                
                {/* Income Range */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Monthly Income Range (KSh):</Label>
                  <RadioGroup value={incomeRange} onValueChange={setIncomeRange} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Less than 10,000" id="income-1" />
                      <Label htmlFor="income-1">Less than 10,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10,000 - 30,000" id="income-2" />
                      <Label htmlFor="income-2">10,000 - 30,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30,001 - 50,000" id="income-3" />
                      <Label htmlFor="income-3">30,001 - 50,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50,001 - 100,000" id="income-4" />
                      <Label htmlFor="income-4">50,001 - 100,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="More than 100,000" id="income-5" />
                      <Label htmlFor="income-5">More than 100,000</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* M-PESA Usage */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Do you use the Mpesa app?</Label>
                  <RadioGroup 
                    value={usesMpesa === null ? undefined : usesMpesa ? 'yes' : 'no'} 
                    onValueChange={(v) => setUsesMpesa(v === 'yes')} 
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="mpesa-yes" />
                      <Label htmlFor="mpesa-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="mpesa-no" />
                      <Label htmlFor="mpesa-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            {/* Section B: Financial Habits */}
            <Card className="mb-8 shadow-md">
              <CardHeader>
                <h2 className="text-xl font-bold">Section B: Financial Habits</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Budget Following */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Do you follow a budget?</Label>
                  <RadioGroup value={followsBudget} onValueChange={setFollowsBudget} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes, strictly" id="budget-1" />
                      <Label htmlFor="budget-1">Yes, strictly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes, but not strictly" id="budget-2" />
                      <Label htmlFor="budget-2">Yes, but not strictly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sometimes" id="budget-3" />
                      <Label htmlFor="budget-3">Sometimes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="budget-4" />
                      <Label htmlFor="budget-4">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Areas of Spending */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Which areas do you spend most of your money on? (Check all that apply)
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spending-rent"
                        checked={spendingAreas.rent}
                        onCheckedChange={(checked) =>
                          setSpendingAreas({ ...spendingAreas, rent: !!checked })
                        }
                      />
                      <Label htmlFor="spending-rent">Rent/Housing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spending-food"
                        checked={spendingAreas.food}
                        onCheckedChange={(checked) =>
                          setSpendingAreas({ ...spendingAreas, food: !!checked })
                        }
                      />
                      <Label htmlFor="spending-food">Food</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spending-transport"
                        checked={spendingAreas.transport}
                        onCheckedChange={(checked) =>
                          setSpendingAreas({ ...spendingAreas, transport: !!checked })
                        }
                      />
                      <Label htmlFor="spending-transport">Transport</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spending-entertainment"
                        checked={spendingAreas.entertainment}
                        onCheckedChange={(checked) =>
                          setSpendingAreas({ ...spendingAreas, entertainment: !!checked })
                        }
                      />
                      <Label htmlFor="spending-entertainment">Entertainment/Leisure</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spending-savings"
                        checked={spendingAreas.savings}
                        onCheckedChange={(checked) =>
                          setSpendingAreas({ ...spendingAreas, savings: !!checked })
                        }
                      />
                      <Label htmlFor="spending-savings">Savings/Investments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spending-other"
                        checked={spendingAreas.other}
                        onCheckedChange={(checked) =>
                          setSpendingAreas({ ...spendingAreas, other: !!checked })
                        }
                      />
                      <Label htmlFor="spending-other">Other</Label>
                    </div>
                    
                    {spendingAreas.other && (
                      <div className="mt-2">
                        <Input
                          placeholder="Please specify"
                          value={otherSpendingArea}
                          onChange={(e) => setOtherSpendingArea(e.target.value)}
                          className="max-w-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Runs out of money */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    How often do you run out of money before the end of the month?
                  </Label>
                  <RadioGroup value={runsOutOfMoney} onValueChange={setRunsOutOfMoney} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Very often" id="runout-1" />
                      <Label htmlFor="runout-1">Very often</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sometimes" id="runout-2" />
                      <Label htmlFor="runout-2">Sometimes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rarely" id="runout-3" />
                      <Label htmlFor="runout-3">Rarely</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Never" id="runout-4" />
                      <Label htmlFor="runout-4">Never</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Saves Money */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Do you regularly save money?</Label>
                  <RadioGroup value={savesMoney} onValueChange={setSavesMoney} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes, consistently" id="saves-1" />
                      <Label htmlFor="saves-1">Yes, consistently</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes, but irregularly" id="saves-2" />
                      <Label htmlFor="saves-2">Yes, but irregularly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rarely" id="saves-3" />
                      <Label htmlFor="saves-3">Rarely</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Never" id="saves-4" />
                      <Label htmlFor="saves-4">Never</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            {/* Section C: Reaction to Tenga Pesa */}
            <Card className="mb-8 shadow-md">
              <CardHeader>
                <h2 className="text-xl font-bold">Section C: Reaction to Tenga Pesa</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Tenga Pesa is a proposed M-PESA feature that lets you set aside money in a special wallet 
                  with flexible withdrawal restrictions to help you stick to your budget.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Would use feature */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    How likely are you to use this feature if available?
                  </Label>
                  <RadioGroup value={wouldUseFeature} onValueChange={setWouldUseFeature} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Definitely" id="use-1" />
                      <Label htmlFor="use-1">Definitely</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Probably" id="use-2" />
                      <Label htmlFor="use-2">Probably</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Not sure" id="use-3" />
                      <Label htmlFor="use-3">Not sure</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Probably not" id="use-4" />
                      <Label htmlFor="use-4">Probably not</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Definitely not" id="use-5" />
                      <Label htmlFor="use-5">Definitely not</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Withdrawal rules */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Would you find it helpful to set withdrawal rules (like specific days or maximum amounts)?
                  </Label>
                  <RadioGroup 
                    value={findWithdrawalRulesHelpful} 
                    onValueChange={setFindWithdrawalRulesHelpful} 
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Very helpful" id="rules-1" />
                      <Label htmlFor="rules-1">Very helpful</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Somewhat helpful" id="rules-2" />
                      <Label htmlFor="rules-2">Somewhat helpful</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Neutral" id="rules-3" />
                      <Label htmlFor="rules-3">Neutral</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Not very helpful" id="rules-4" />
                      <Label htmlFor="rules-4">Not very helpful</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Not at all helpful" id="rules-5" />
                      <Label htmlFor="rules-5">Not at all helpful</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Penalty feeling */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    How would you feel about a small penalty (2-5%) for withdrawing money outside your set rules?
                  </Label>
                  <RadioGroup 
                    value={feelingAboutPenalty} 
                    onValueChange={setFeelingAboutPenalty} 
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="This would motivate me" id="penalty-1" />
                      <Label htmlFor="penalty-1">This would motivate me</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="I would accept this" id="penalty-2" />
                      <Label htmlFor="penalty-2">I would accept this</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="I'm unsure" id="penalty-3" />
                      <Label htmlFor="penalty-3">I'm unsure</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="This would discourage me" id="penalty-4" />
                      <Label htmlFor="penalty-4">This would discourage me</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="I would never use it with penalties" id="penalty-5" />
                      <Label htmlFor="penalty-5">I would never use it with penalties</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Spending insights */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Would you like to receive insights about your spending habits as part of this feature?
                  </Label>
                  <RadioGroup 
                    value={wantsSpendingInsights} 
                    onValueChange={setWantsSpendingInsights} 
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes, very interested" id="insights-1" />
                      <Label htmlFor="insights-1">Yes, very interested</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Somewhat interested" id="insights-2" />
                      <Label htmlFor="insights-2">Somewhat interested</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Neutral" id="insights-3" />
                      <Label htmlFor="insights-3">Neutral</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Not very interested" id="insights-4" />
                      <Label htmlFor="insights-4">Not very interested</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Not at all interested" id="insights-5" />
                      <Label htmlFor="insights-5">Not at all interested</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            {/* Section D: Final Thoughts */}
            <Card className="mb-8 shadow-md">
              <CardHeader>
                <h2 className="text-xl font-bold">Section D: Final Thoughts</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Feature helps */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Do you think the Tenga Pesa feature would help you manage your money better?
                  </Label>
                  <RadioGroup 
                    value={thinksTengaPesaHelps} 
                    onValueChange={setThinksTengaPesaHelps} 
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Definitely" id="helps-1" />
                      <Label htmlFor="helps-1">Definitely</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Probably" id="helps-2" />
                      <Label htmlFor="helps-2">Probably</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Not sure" id="helps-3" />
                      <Label htmlFor="helps-3">Not sure</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Probably not" id="helps-4" />
                      <Label htmlFor="helps-4">Probably not</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Definitely not" id="helps-5" />
                      <Label htmlFor="helps-5">Definitely not</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Desired features */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    What additional features would make Tenga Pesa more useful to you?
                  </Label>
                  <Textarea
                    placeholder="Your answer"
                    value={desiredFeatures}
                    onChange={(e) => setDesiredFeatures(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                
                {/* Concerns */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Do you have any concerns about using Tenga Pesa?
                  </Label>
                  <Textarea
                    placeholder="Your answer"
                    value={concerns}
                    onChange={(e) => setConcerns(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Submit Button */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <Button 
                type="submit" 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 w-full sm:w-auto max-w-xs mx-auto" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
