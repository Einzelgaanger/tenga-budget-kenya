
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
import { cn } from '@/lib/utils';
import { ChevronRight, CheckCircle2, User, Briefcase, Wallet, PiggyBank, Info, Star, Shield, Clock } from 'lucide-react';
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

  // Custom RadioOption component for better visual feedback
  const RadioOption = ({ value, currentValue, onValueChange, children, id }: {
    value: string;
    currentValue: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    id: string;
  }) => {
    const isSelected = currentValue === value;
    
    return (
      <div className="flex items-center">
        <RadioGroupItem value={value} id={id} className="sr-only" />
        <Label
          htmlFor={id}
          onClick={() => onValueChange(value)}
          className={cn(
            "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
            isSelected 
              ? "border-mpesa-green bg-mpesa-green/10 text-mpesa-green font-medium shadow-sm" 
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          {children}
        </Label>
      </div>
    );
  };

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
        navigate('/feedback');
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
      // Prevent any click events from propagating to the next UI state
      // This helps prevent the submit button from being automatically clicked
      // when it appears in the same position as the Next button
      document.body.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
      }, { once: true, capture: true });
      
      setCurrentStep(prev => prev + 1);
      
      // If moving from first to second page, scroll to the 'Share Your Feedback' section
      // instead of the top of the page
      if (currentStep === 1) {
        setTimeout(() => {
          const feedbackSection = document.querySelector('h2.text-2xl.font-bold.text-gray-900.mb-4');
          if (feedbackSection) {
            feedbackSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100); // Small timeout to ensure state update has completed
      } else {
        // When moving to the third page, add extra protection against accidental submission
        if (currentStep === 2) {
          // Scroll to top with a slight delay to ensure UI has updated
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 50);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
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
      <div className="min-h-screen py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Improved Survey Briefing Section */}
          <div className="mb-8 space-y-4">
            {/* Main Title Card */}
            <Card className="border-2 border-mpesa-green/20 bg-gradient-to-br from-mpesa-green/10 via-green-50/50 to-white">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-mpesa-green p-4 rounded-full shadow-lg">
                      <Star className="text-white" size={32} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      TengaPesa Research Survey
                    </h1>
                    <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
                      Help us build better financial management tools for M-PESA users in Kenya
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What is TengaPesa Card */}
            <Card className="border border-gray-200 hover:border-mpesa-green/30 transition-colors">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-mpesa-green/10 p-2 rounded-lg">
                      <PiggyBank className="text-mpesa-green" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-mpesa-green">What is TengaPesa?</h3>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    TengaPesa is a proposed M-PESA feature that helps you manage your money by creating a special savings wallet with customizable withdrawal rules. You set aside money and create your own rules for when and how you can withdraw it, helping you stick to your financial goals.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Survey Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Shield className="text-blue-600" size={20} />
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Anonymous</h4>
                  <p className="text-sm text-gray-600">Your privacy is protected</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Clock className="text-green-600" size={20} />
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Quick Survey</h4>
                  <p className="text-sm text-gray-600">Takes 5-7 minutes</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <CheckCircle2 className="text-purple-600" size={20} />
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Confidential</h4>
                  <p className="text-sm text-gray-600">Secure responses</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Share Your Feedback
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Your input will help shape the future of mobile money management in Kenya.
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
                          <RadioOption
                            key={age}
                            value={age}
                            currentValue={formData.demographic.ageGroup}
                            onValueChange={(value) => updateFormField('demographic', 'ageGroup', value)}
                            id={`age-${age}`}
                          >
                            {age}
                          </RadioOption>
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
                          <RadioOption
                            key={occ}
                            value={occ}
                            currentValue={formData.demographic.occupation}
                            onValueChange={(value) => updateFormField('demographic', 'occupation', value)}
                            id={`occ-${occ}`}
                          >
                            {occ}
                          </RadioOption>
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

                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Monthly Income Range (KES)</Label>
                      <RadioGroup
                        value={formData.demographic.incomeRange}
                        onValueChange={(value) => updateFormField('demographic', 'incomeRange', value)}
                        className="grid grid-cols-2 gap-4"
                      >
                        {['Below 20,000', '20,000 - 50,000', '50,000 - 100,000', 'Above 100,000'].map((range) => (
                          <RadioOption
                            key={range}
                            value={range}
                            currentValue={formData.demographic.incomeRange}
                            onValueChange={(value) => updateFormField('demographic', 'incomeRange', value)}
                            id={`income-${range}`}
                          >
                            {range}
                          </RadioOption>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Do you use M-PESA App?</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={formData.demographic.usesMpesa ? "default" : "outline"}
                          onClick={() => updateFormField('demographic', 'usesMpesa', true)}
                          className={formData.demographic.usesMpesa ? 'bg-mpesa-green hover:bg-mpesa-darkgreen text-white' : ''}
                        >
                          Yes
                        </Button>
                        <Button
                          type="button"
                          variant={!formData.demographic.usesMpesa ? "default" : "outline"}
                          onClick={() => updateFormField('demographic', 'usesMpesa', false)}
                          className={!formData.demographic.usesMpesa ? 'bg-mpesa-green hover:bg-mpesa-darkgreen text-white' : ''}
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
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Do you follow a monthly budget?</Label>
                      <RadioGroup
                        value={formData.financialHabits.followsBudget}
                        onValueChange={(value) => updateFormField('financialHabits', 'followsBudget', value)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        {['Always', 'Sometimes', 'Never'].map((option) => (
                          <RadioOption
                            key={option}
                            value={option}
                            currentValue={formData.financialHabits.followsBudget}
                            onValueChange={(value) => updateFormField('financialHabits', 'followsBudget', value)}
                            id={`budget-${option}`}
                          >
                            {option}
                          </RadioOption>
                        ))}
                      </RadioGroup>
                    </div>

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

                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">How often do you run out of money before month-end?</Label>
                      <RadioGroup
                        value={formData.financialHabits.runsOutOfMoney}
                        onValueChange={(value) => updateFormField('financialHabits', 'runsOutOfMoney', value)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {['Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
                          <RadioOption
                            key={option}
                            value={option}
                            currentValue={formData.financialHabits.runsOutOfMoney}
                            onValueChange={(value) => updateFormField('financialHabits', 'runsOutOfMoney', value)}
                            id={`money-${option}`}
                          >
                            {option}
                          </RadioOption>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Do you regularly save money?</Label>
                      <RadioGroup
                        value={formData.financialHabits.savesMoney}
                        onValueChange={(value) => updateFormField('financialHabits', 'savesMoney', value)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        {['Yes', 'Sometimes', 'No'].map((option) => (
                          <RadioOption
                            key={option}
                            value={option}
                            currentValue={formData.financialHabits.savesMoney}
                            onValueChange={(value) => updateFormField('financialHabits', 'savesMoney', value)}
                            id={`saves-${option}`}
                          >
                            {option}
                          </RadioOption>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className={`p-6 space-y-6 ${currentStep === 3 ? 'block' : 'hidden'}`}>
                  <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-6">
                    <PiggyBank className="text-mpesa-green" size={24} />
                    <h2>TengaPesa Feedback</h2>
                  </div>

                  <div className="space-y-6">
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
                          <RadioOption
                            key={option}
                            value={option}
                            currentValue={formData.reactionToTengaPesa.wouldUseFeature}
                            onValueChange={(value) => updateFormField('reactionToTengaPesa', 'wouldUseFeature', value)}
                            id={`use-${option}`}
                          >
                            {option}
                          </RadioOption>
                        ))}
                      </RadioGroup>
                    </div>

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
                          <RadioOption
                            key={option}
                            value={option}
                            currentValue={formData.reactionToTengaPesa.findWithdrawalRulesHelpful}
                            onValueChange={(value) => updateFormField('reactionToTengaPesa', 'findWithdrawalRulesHelpful', value)}
                            id={`rules-${option}`}
                          >
                            {option}
                          </RadioOption>
                        ))}
                      </RadioGroup>
                    </div>

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
                          <RadioOption
                            key={option}
                            value={option}
                            currentValue={formData.reactionToTengaPesa.feelingAboutPenalty}
                            onValueChange={(value) => updateFormField('reactionToTengaPesa', 'feelingAboutPenalty', value)}
                            id={`penalty-${option}`}
                          >
                            {option}
                          </RadioOption>
                        ))}
                      </RadioGroup>
                    </div>

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
                          <RadioOption
                            key={option}
                            value={option}
                            currentValue={formData.reactionToTengaPesa.wantsSpendingInsights}
                            onValueChange={(value) => updateFormField('reactionToTengaPesa', 'wantsSpendingInsights', value)}
                            id={`insights-${option}`}
                          >
                            {option}
                          </RadioOption>
                        ))}
                      </RadioGroup>
                    </div>

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
                          <RadioOption
                            key={option}
                            value={option}
                            currentValue={formData.finalThoughts.thinksTengaPesaHelps}
                            onValueChange={(value) => updateFormField('finalThoughts', 'thinksTengaPesaHelps', value)}
                            id={`helps-${option}`}
                          >
                            {option}
                          </RadioOption>
                        ))}
                      </RadioGroup>
                    </div>

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
