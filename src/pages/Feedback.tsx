
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '@/context/FeedbackContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { FeedbackData } from '@/types/feedback';
import { v4 as uuidv4 } from 'uuid';

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
  const [spendingAreas, setSpendingAreas] = useState<Record<string, boolean>>({
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
  
  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gather selected spending areas
    const selectedSpendingAreas = Object.entries(spendingAreas)
      .filter(([_, isChecked]) => isChecked)
      .map(([area, _]) => area === 'other' ? otherSpendingArea : area);
    
    // Create feedback object
    const feedback: FeedbackData = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      demographic: {
        ageGroup,
        occupation: occupation === 'Other' ? otherOccupation : occupation,
        incomeRange,
        usesMpesa: usesMpesa === true,
      },
      financialHabits: {
        followsBudget,
        mostSpendingAreas: selectedSpendingAreas,
        runsOutOfMoney,
        savesMoney,
      },
      reactionToTengaPesa: {
        wouldUseFeature,
        findWithdrawalRulesHelpful,
        feelingAboutPenalty,
        wantsSpendingInsights,
      },
      finalThoughts: {
        thinksTengaPesaHelps,
        desiredFeatures,
        concerns,
      },
    };
    
    // Add feedback to context
    addFeedback(feedback);
    
    // Show success message
    toast.success("Thank you for your feedback!", {
      description: "Your responses have been recorded successfully."
    });
    
    // Redirect to homepage
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Tenga Pesa Feedback Questionnaire</h1>
          <p className="text-gray-600 mb-8 text-center">
            We're collecting opinions about a proposed budgeting feature within M-PESA to help people better manage their money. Your feedback is anonymous and valuable.
          </p>
          
          <form onSubmit={handleSubmit}>
            {/* Section A: Demographics */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">Section A: Demographic Information</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Age Group */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Age Group:</Label>
                  <RadioGroup value={ageGroup} onValueChange={setAgeGroup} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Under 18" id="age-1" />
                      <Label htmlFor="age-1">Under 18</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="18-24" id="age-2" />
                      <Label htmlFor="age-2">18-24</Label>
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
                      <RadioGroupItem value="45 and above" id="age-5" />
                      <Label htmlFor="age-5">45 and above</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Occupation */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Occupation:</Label>
                  <RadioGroup value={occupation} onValueChange={setOccupation} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Student" id="occ-1" />
                      <Label htmlFor="occ-1">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Employed" id="occ-2" />
                      <Label htmlFor="occ-2">Employed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Self-employed" id="occ-3" />
                      <Label htmlFor="occ-3">Self-employed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Unemployed" id="occ-4" />
                      <Label htmlFor="occ-4">Unemployed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Other" id="occ-5" />
                      <Label htmlFor="occ-5">Other</Label>
                    </div>
                    {occupation === 'Other' && (
                      <Textarea 
                        placeholder="Please specify your occupation" 
                        value={otherOccupation}
                        onChange={(e) => setOtherOccupation(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </RadioGroup>
                </div>
                
                {/* Income Range */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Monthly Income Range (Approximate):</Label>
                  <RadioGroup value={incomeRange} onValueChange={setIncomeRange} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Below KES 5,000" id="inc-1" />
                      <Label htmlFor="inc-1">Below KES 5,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="KES 5,000 - 10,000" id="inc-2" />
                      <Label htmlFor="inc-2">KES 5,000 - 10,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="KES 10,001 - 30,000" id="inc-3" />
                      <Label htmlFor="inc-3">KES 10,001 - 30,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="KES 30,001 - 60,000" id="inc-4" />
                      <Label htmlFor="inc-4">KES 30,001 - 60,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Above KES 60,000" id="inc-5" />
                      <Label htmlFor="inc-5">Above KES 60,000</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* M-PESA Usage */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Do you actively use M-PESA?</Label>
                  <RadioGroup 
                    value={usesMpesa === true ? "Yes" : usesMpesa === false ? "No" : ""} 
                    onValueChange={(value) => setUsesMpesa(value === "Yes")}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="mpesa-1" />
                      <Label htmlFor="mpesa-1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="mpesa-2" />
                      <Label htmlFor="mpesa-2">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            {/* Section B: Financial Habits */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">Section B: Financial Habits</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Budget Following */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Do you follow a budget for your monthly spending?</Label>
                  <RadioGroup value={followsBudget} onValueChange={setFollowsBudget} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="budget-1" />
                      <Label htmlFor="budget-1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="budget-2" />
                      <Label htmlFor="budget-2">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sometimes" id="budget-3" />
                      <Label htmlFor="budget-3">Sometimes</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Spending Areas */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Where does most of your income go? (You can choose more than one)</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="spend-1" 
                        checked={spendingAreas.rent}
                        onCheckedChange={(checked) => 
                          setSpendingAreas({...spendingAreas, rent: checked === true})}
                      />
                      <Label htmlFor="spend-1">Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="spend-2" 
                        checked={spendingAreas.food}
                        onCheckedChange={(checked) => 
                          setSpendingAreas({...spendingAreas, food: checked === true})}
                      />
                      <Label htmlFor="spend-2">Food</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="spend-3" 
                        checked={spendingAreas.transport}
                        onCheckedChange={(checked) => 
                          setSpendingAreas({...spendingAreas, transport: checked === true})}
                      />
                      <Label htmlFor="spend-3">Transport</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="spend-4" 
                        checked={spendingAreas.entertainment}
                        onCheckedChange={(checked) => 
                          setSpendingAreas({...spendingAreas, entertainment: checked === true})}
                      />
                      <Label htmlFor="spend-4">Entertainment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="spend-5" 
                        checked={spendingAreas.savings}
                        onCheckedChange={(checked) => 
                          setSpendingAreas({...spendingAreas, savings: checked === true})}
                      />
                      <Label htmlFor="spend-5">Savings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="spend-6" 
                        checked={spendingAreas.other}
                        onCheckedChange={(checked) => 
                          setSpendingAreas({...spendingAreas, other: checked === true})}
                      />
                      <Label htmlFor="spend-6">Other</Label>
                    </div>
                    {spendingAreas.other && (
                      <Textarea 
                        placeholder="Please specify other spending areas" 
                        value={otherSpendingArea}
                        onChange={(e) => setOtherSpendingArea(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
                
                {/* Running Out of Money */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Have you ever run out of money before meeting important needs?</Label>
                  <RadioGroup value={runsOutOfMoney} onValueChange={setRunsOutOfMoney} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Frequently" id="run-1" />
                      <Label htmlFor="run-1">Frequently</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sometimes" id="run-2" />
                      <Label htmlFor="run-2">Sometimes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rarely" id="run-3" />
                      <Label htmlFor="run-3">Rarely</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Never" id="run-4" />
                      <Label htmlFor="run-4">Never</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Saving Money */}
                <div>
                  <Label className="text-base font-medium mb-2 block">Do you save money regularly?</Label>
                  <RadioGroup value={savesMoney} onValueChange={setSavesMoney} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="save-1" />
                      <Label htmlFor="save-1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="save-2" />
                      <Label htmlFor="save-2">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Occasionally" id="save-3" />
                      <Label htmlFor="save-3">Occasionally</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            {/* Section C: Reaction to Tenga Pesa Idea */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">Section C: Reaction to Tenga Pesa Idea</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Would Use Feature */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    If M-PESA introduced a budgeting feature where your income is automatically divided into mini-accounts 
                    (e.g., rent, food, savings) – would you use it?
                  </Label>
                  <RadioGroup value={wouldUseFeature} onValueChange={setWouldUseFeature} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Definitely" id="use-1" />
                      <Label htmlFor="use-1">Definitely</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Maybe" id="use-2" />
                      <Label htmlFor="use-2">Maybe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="use-3" />
                      <Label htmlFor="use-3">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Withdrawal Rules Helpfulness */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Would you find it helpful if each mini-account had withdrawal rules to help control spending?
                  </Label>
                  <RadioGroup value={findWithdrawalRulesHelpful} onValueChange={setFindWithdrawalRulesHelpful} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Very helpful" id="rules-1" />
                      <Label htmlFor="rules-1">Very helpful</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Somewhat helpful" id="rules-2" />
                      <Label htmlFor="rules-2">Somewhat helpful</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Not helpful" id="rules-3" />
                      <Label htmlFor="rules-3">Not helpful</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Feeling About Penalty */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    How would you feel about a small penalty for withdrawing money early from a goal or locked mini-account?
                  </Label>
                  <RadioGroup value={feelingAboutPenalty} onValueChange={setFeelingAboutPenalty} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="I support it – it builds discipline" id="penalty-1" />
                      <Label htmlFor="penalty-1">I support it – it builds discipline</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="I don't mind if it's optional" id="penalty-2" />
                      <Label htmlFor="penalty-2">I don't mind if it's optional</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="I don't like penalties at all" id="penalty-3" />
                      <Label htmlFor="penalty-3">I don't like penalties at all</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Spending Insights */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Would you like to see spending insights and nudges (e.g., "you spent KES 2,000 on entertainment this week") in M-PESA?
                  </Label>
                  <RadioGroup value={wantsSpendingInsights} onValueChange={setWantsSpendingInsights} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="insights-1" />
                      <Label htmlFor="insights-1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="insights-2" />
                      <Label htmlFor="insights-2">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Not sure" id="insights-3" />
                      <Label htmlFor="insights-3">Not sure</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            {/* Section D: Final Thoughts */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">Section D: Final Thoughts</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tenga Pesa Helps */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Do you think Tenga Pesa could help you better manage your money?
                  </Label>
                  <RadioGroup value={thinksTengaPesaHelps} onValueChange={setThinksTengaPesaHelps} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="help-1" />
                      <Label htmlFor="help-1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="help-2" />
                      <Label htmlFor="help-2">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Maybe" id="help-3" />
                      <Label htmlFor="help-3">Maybe</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Desired Features */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    What features would you like to see in such a budgeting tool?
                  </Label>
                  <Textarea 
                    placeholder="Enter your desired features..." 
                    value={desiredFeatures}
                    onChange={(e) => setDesiredFeatures(e.target.value)}
                    className="h-24"
                  />
                </div>
                
                {/* Concerns / Suggestions */}
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Any concerns or suggestions?
                  </Label>
                  <Textarea 
                    placeholder="Enter your concerns or suggestions..." 
                    value={concerns}
                    onChange={(e) => setConcerns(e.target.value)}
                    className="h-24"
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center mt-8">
              <Button type="submit" className="bg-mpesa-green hover:bg-mpesa-darkgreen text-lg py-6 px-8">
                Submit Feedback
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
