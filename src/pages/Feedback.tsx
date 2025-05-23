import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '@/hooks/use-feedback';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { ChevronRight, CheckCircle2, User, Briefcase, Wallet, PiggyBank } from 'lucide-react';
import type { FeedbackData } from '@/types/feedback';

type FormData = Omit<FeedbackData, 'id' | 'timestamp'>;

const Feedback = () => {
  const navigate = useNavigate();
  const { addFeedback } = useFeedback();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    demographic: {
      ageGroup: '',
      occupation: '',
      incomeRange: '',
      usesMpesa: false,
    },
    financialHabits: {
      followsBudget: '',
      mostSpendingAreas: [],
      runsOutOfMoney: '',
      savesMoney: ''
    },
    reactionToTengaPesa: {
      wouldUseFeature: '',
      findWithdrawalRulesHelpful: '',
      feelingAboutPenalty: '',
      wantsSpendingInsights: ''
    },
    finalThoughts: {
      thinksTengaPesaHelps: '',
      desiredFeatures: '',
      concerns: ''
    }
  });

  // Track other form state
  const [tempFormData, setTempFormData] = useState({
    otherOccupation: '',
    spendingAreas: {
      rent: false,
      food: false,
      transport: false,
      entertainment: false,
      savings: false,
      other: false
    },
    otherSpendingArea: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormField = <T extends keyof FormData>(
    section: T,
    field: keyof FormData[T],
    value: FormData[T][keyof FormData[T]]
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.demographic.ageGroup || 
        !formData.demographic.occupation || 
        !formData.demographic.incomeRange) {
      toast.error("Please fill in all required demographic information");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Update occupation if "Other" was selected
      if (formData.demographic.occupation === 'Other') {
        updateFormField('demographic', 'occupation', tempFormData.otherOccupation);
      }

      // Collect selected spending areas
      const selectedSpendingAreas = Object.entries(tempFormData.spendingAreas)
        .filter(([_, isChecked]) => isChecked)
        .map(([area]) => area === 'other' ? tempFormData.otherSpendingArea : area);

      const updatedFormData: FormData = {
        ...formData,
        financialHabits: {
          ...formData.financialHabits,
          mostSpendingAreas: selectedSpendingAreas
        }
      };

      const success = await addFeedback(updatedFormData);
      
      if (success) {
        toast.success("Thank you for your feedback!", {
          description: "Your responses have been recorded successfully."
        });
        navigate('/');
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Progress indicator based on current step
  const Progress = () => (
    <div className="flex items-center justify-between max-w-xl mx-auto mb-8 px-4">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
            ${currentStep >= step ? 'border-mpesa-green bg-mpesa-green text-white' : 'border-gray-300 text-gray-500'}`}>
            {step === 1 && <User size={20} />}
            {step === 2 && <Wallet size={20} />}
            {step === 3 && <PiggyBank size={20} />}
          </div>
          {step < 3 && (
            <div className={`w-24 h-0.5 mx-2 ${currentStep > step ? 'bg-mpesa-green' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Help Us Improve TengaPesa
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your feedback will help shape the future of mobile money management in Kenya.
              All responses are anonymous and will be used to improve our services.
            </p>
          </div>

          <Progress />

          <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-white">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
                {/* Step 1: Demographic Information */}
                <div className={`p-6 space-y-6 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                  <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-6">
                    <User className="text-mpesa-green" size={24} />
                    <h2>About You</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Age Group */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Age Group</Label>
                      <RadioGroup
                        value={formData.demographic.ageGroup}
                        onValueChange={(value) => updateFormField('demographic', 'ageGroup', value)}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                      >
                        {['18-24', '25-34', '35-44', '45-54', '55+'].map((age) => (
                          <div key={age} className="flex items-center">
                            <RadioGroupItem value={age} id={`age-${age}`} className="peer sr-only" />
                            <Label
                              htmlFor={`age-${age}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {age}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Occupation */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Occupation</Label>
                      <RadioGroup
                        value={formData.demographic.occupation}
                        onValueChange={(value) => updateFormField('demographic', 'occupation', value)}
                        className="grid grid-cols-2 gap-4"
                      >
                        {['Student', 'Employed', 'Self-employed', 'Business Owner', 'Other'].map((occ) => (
                          <div key={occ} className="flex items-center">
                            <RadioGroupItem value={occ} id={`occ-${occ}`} className="peer sr-only" />
                            <Label
                              htmlFor={`occ-${occ}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {occ}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {formData.demographic.occupation === 'Other' && (
                      <div className="space-y-2">
                        <Label htmlFor="other-occupation">Please specify your occupation</Label>
                        <Input
                          id="other-occupation"
                          value={tempFormData.otherOccupation}
                          onChange={(e) => setTempFormData(prev => ({
                            ...prev,
                            otherOccupation: e.target.value
                          }))}
                          className="max-w-md"
                        />
                      </div>
                    )}

                    {/* Income Range */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Monthly Income Range (KES)</Label>
                      <RadioGroup
                        value={formData.demographic.incomeRange}
                        onValueChange={(value) => updateFormField('demographic', 'incomeRange', value)}
                        className="grid grid-cols-2 gap-4"
                      >
                        {['Below 20,000', '20,000 - 50,000', '50,000 - 100,000', 'Above 100,000'].map((range) => (
                          <div key={range} className="flex items-center">
                            <RadioGroupItem value={range} id={`income-${range}`} className="peer sr-only" />
                            <Label
                              htmlFor={`income-${range}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {range}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* M-PESA Usage */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Do you use M-PESA?</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={formData.demographic.usesMpesa ? "default" : "outline"}
                          onClick={() => updateFormField('demographic', 'usesMpesa', true)}
                          className={formData.demographic.usesMpesa ? 'bg-mpesa-green text-white' : ''}
                        >
                          Yes
                        </Button>
                        <Button
                          type="button"
                          variant={!formData.demographic.usesMpesa ? "default" : "outline"}
                          onClick={() => updateFormField('demographic', 'usesMpesa', false)}
                          className={!formData.demographic.usesMpesa ? 'bg-mpesa-green text-white' : ''}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Financial Habits */}
                <div className={`p-6 space-y-6 ${currentStep === 2 ? 'block' : 'hidden'}`}>
                  <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-6">
                    <Wallet className="text-mpesa-green" size={24} />
                    <h2>Your Financial Habits</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Budget Following */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Do you follow a monthly budget?</Label>
                      <RadioGroup
                        value={formData.financialHabits.followsBudget}
                        onValueChange={(value) => updateFormField('financialHabits', 'followsBudget', value)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        {['Always', 'Sometimes', 'Never'].map((option) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`budget-${option}`} className="peer sr-only" />
                            <Label
                              htmlFor={`budget-${option}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Spending Areas */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">What are your main spending areas?</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(tempFormData.spendingAreas).map(([area, checked]) => (
                          area !== 'other' && (
                            <div key={area} className="flex items-center space-x-2">
                              <Checkbox
                                id={`spending-${area}`}
                                checked={checked}
                                onCheckedChange={(checked) => {
                                  setTempFormData(prev => ({
                                    ...prev,
                                    spendingAreas: {
                                      ...prev.spendingAreas,
                                      [area]: checked === true
                                    }
                                  }));
                                }}
                                className="border-2"
                              />
                              <Label htmlFor={`spending-${area}`} className="capitalize">
                                {area}
                              </Label>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Money Management */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">How often do you run out of money before month-end?</Label>
                      <RadioGroup
                        value={formData.financialHabits.runsOutOfMoney}
                        onValueChange={(value) => updateFormField('financialHabits', 'runsOutOfMoney', value)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {['Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`money-${option}`} className="peer sr-only" />
                            <Label
                              htmlFor={`money-${option}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Savings */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Do you regularly save money?</Label>
                      <RadioGroup
                        value={formData.financialHabits.savesMoney}
                        onValueChange={(value) => updateFormField('financialHabits', 'savesMoney', value)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        {['Yes', 'Sometimes', 'No'].map((option) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`saves-${option}`} className="peer sr-only" />
                            <Label
                              htmlFor={`saves-${option}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Step 3: TengaPesa Feedback */}
                <div className={`p-6 space-y-6 ${currentStep === 3 ? 'block' : 'hidden'}`}>
                  <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-6">
                    <PiggyBank className="text-mpesa-green" size={24} />
                    <h2>TengaPesa Feedback</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Would Use Feature */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">
                        Would you use TengaPesa to help manage your M-PESA spending?
                      </Label>
                      <RadioGroup
                        value={formData.reactionToTengaPesa.wouldUseFeature}
                        onValueChange={(value) => updateFormField('reactionToTengaPesa', 'wouldUseFeature', value)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        {['Definitely', 'Maybe', 'No'].map((option) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`use-${option}`} className="peer sr-only" />
                            <Label
                              htmlFor={`use-${option}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Withdrawal Rules */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">
                        Would you find withdrawal rules helpful for managing your spending?
                      </Label>
                      <RadioGroup
                        value={formData.reactionToTengaPesa.findWithdrawalRulesHelpful}
                        onValueChange={(value) => updateFormField('reactionToTengaPesa', 'findWithdrawalRulesHelpful', value)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        {['Very Helpful', 'Somewhat Helpful', 'Not Helpful'].map((option) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`rules-${option}`} className="peer sr-only" />
                            <Label
                              htmlFor={`rules-${option}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Penalty Feelings */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">
                        How do you feel about small penalties for breaking spending rules?
                      </Label>
                      <RadioGroup
                        value={formData.reactionToTengaPesa.feelingAboutPenalty}
                        onValueChange={(value) => updateFormField('reactionToTengaPesa', 'feelingAboutPenalty', value)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {['Acceptable as motivation', 'Prefer no penalties', 'Need more information', 'Not sure'].map((option) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`penalty-${option}`} className="peer sr-only" />
                            <Label
                              htmlFor={`penalty-${option}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Spending Insights */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">
                        Would you like to receive insights about your spending habits?
                      </Label>
                      <RadioGroup
                        value={formData.reactionToTengaPesa.wantsSpendingInsights}
                        onValueChange={(value) => updateFormField('reactionToTengaPesa', 'wantsSpendingInsights', value)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        {['Yes, regularly', 'Sometimes', 'No'].map((option) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`insights-${option}`} className="peer sr-only" />
                            <Label
                              htmlFor={`insights-${option}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Overall Opinion */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">
                        Do you think TengaPesa would help you manage your money better?
                      </Label>
                      <RadioGroup
                        value={formData.finalThoughts.thinksTengaPesaHelps}
                        onValueChange={(value) => updateFormField('finalThoughts', 'thinksTengaPesaHelps', value)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        {['Yes, definitely', 'Maybe', 'No'].map((option) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`helps-${option}`} className="peer sr-only" />
                            <Label
                              htmlFor={`helps-${option}`}
                              className="flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer peer-checked:border-mpesa-green peer-checked:bg-mpesa-green/5 hover:bg-gray-50 transition-all"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Desired Features */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">
                        What features would you like to see in TengaPesa?
                      </Label>
                      <Textarea
                        value={formData.finalThoughts.desiredFeatures}
                        onChange={(e) => updateFormField('finalThoughts', 'desiredFeatures', e.target.value)}
                        placeholder="Share your ideas for features that would help you manage your money better..."
                        className="min-h-[100px] resize-none"
                      />
                    </div>

                    {/* Concerns */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">
                        Do you have any concerns about using TengaPesa?
                      </Label>
                      <Textarea
                        value={formData.finalThoughts.concerns}
                        onChange={(e) => updateFormField('finalThoughts', 'concerns', e.target.value)}
                        placeholder="Share any concerns or worries you might have..."
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="p-6 bg-gray-50 flex flex-col sm:flex-row-reverse justify-between gap-4">
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-mpesa-green hover:bg-mpesa-darkgreen text-white flex items-center justify-center gap-2"
                    >
                      Next Step
                      <ChevronRight size={16} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-mpesa-green hover:bg-mpesa-darkgreen text-white flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          Submit Feedback
                          <CheckCircle2 size={16} />
                        </>
                      )}
                    </Button>
                  )}
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-gray-300"
                    >
                      Previous Step
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
