
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '@/hooks/use-feedback';
import { useOffline } from '@/hooks/use-offline';
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
import { ChevronRight, CheckCircle2, User, Briefcase, Wallet, PiggyBank, Info, Star, Shield, Clock, AlertTriangle, Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';
import type { FeedbackData } from '@/types/feedback';

type FormData = Omit<FeedbackData, 'id' | 'timestamp'>;

const Feedback = () => {
  const navigate = useNavigate();
  const { addFeedback } = useFeedback();
  const { isOnline, pendingCount, refreshPendingCount } = useOffline();
  
  // Check if user has already submitted feedback
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false);
  
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

  // Check submission status on component mount
  useEffect(() => {
    const submissionStatus = localStorage.getItem('tengapesa_feedback_submitted');
    if (submissionStatus === 'true') {
      setHasAlreadySubmitted(true);
    }
  }, []);

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

  const resetForm = () => {
    setFormData({
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
    
    setTempFormData({
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
    
    setCurrentStep(1);
  };

  const handleAlreadySubmittedAction = () => {
    // Clear localStorage flag
    localStorage.removeItem('tengapesa_feedback_submitted');
    // Reset state
    setHasAlreadySubmitted(false);
    // Reset form
    resetForm();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    toast.info("Form reset", {
      description: "You can now submit feedback again."
    });
  };

  const handleSubmit = async () => {
    console.log('Submit button clicked - handling submission');
    
    // Basic validation
    if (!formData.demographic.ageGroup || 
        !formData.demographic.occupation || 
        !formData.demographic.incomeRange) {
      toast.error("Please fill in all required demographic information");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Update occupation if "Other" was selected
      let finalFormData = { ...formData };
      if (formData.demographic.occupation === 'Other') {
        finalFormData = {
          ...formData,
          demographic: {
            ...formData.demographic,
            occupation: tempFormData.otherOccupation
          }
        };
      }

      // Collect selected spending areas
      const selectedSpendingAreas = Object.entries(tempFormData.spendingAreas)
        .filter(([_, isChecked]) => isChecked)
        .map(([area]) => area === 'other' ? tempFormData.otherSpendingArea : area);

      finalFormData = {
        ...finalFormData,
        financialHabits: {
          ...finalFormData.financialHabits,
          mostSpendingAreas: selectedSpendingAreas
        }
      };

      console.log('Submitting feedback:', finalFormData);
      const success = await addFeedback(finalFormData);
      
      if (success) {
        // Mark as submitted in localStorage
        localStorage.setItem('tengapesa_feedback_submitted', 'true');
        
        if (isOnline) {
          toast.success("Thank you for your feedback!", {
            description: "Your responses have been recorded successfully."
          });
        } else {
          toast.success("Thank you for your feedback!", {
            description: "Your responses have been saved and will be submitted when you're back online."
          });
        }
        
        // Set the submitted state
        setHasAlreadySubmitted(true);
        
        // Reset form
        resetForm();
        
        // Refresh pending count
        refreshPendingCount();
        
        // Scroll to top after submission
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        if (isOnline) {
          toast.error("Failed to submit feedback");
        } else {
          toast.error("Failed to save feedback locally");
        }
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
      setTimeout(() => {
        const formElement = document.getElementById('feedback-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setTimeout(() => {
        const formElement = document.getElementById('feedback-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // If user has already submitted, show thank you message
  if (hasAlreadySubmitted) {
    return (
      <Layout>
        <div className="min-h-screen py-8 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 via-green-25 to-white shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="bg-green-600 p-4 rounded-full shadow-lg">
                      <CheckCircle2 className="text-white" size={48} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      Thank You!
                    </h1>
                    <p className="text-lg text-gray-700">
                      Your feedback has been successfully submitted and recorded.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <AlertTriangle className="text-yellow-600" size={20} />
                      <h3 className="font-semibold text-yellow-800">Already Submitted</h3>
                    </div>
                    <p className="text-sm text-yellow-700">
                      You have already completed this questionnaire. Each person can only submit feedback once to ensure data quality.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      We appreciate your time and valuable input in helping us improve TengaPesa.
                    </p>
                    
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Progress indicator based on current step
  const Progress = () => (
    <div className="flex items-center justify-between max-w-xl mx-auto mb-8 px-4">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
            ${currentStep >= step ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 text-gray-500'}`}>
            {step === 1 && <User size={20} />}
            {step === 2 && <Wallet size={20} />}
            {step === 3 && <PiggyBank size={20} />}
          </div>
          {step < 3 && (
            <div className={`w-24 h-0.5 mx-2 ${currentStep > step ? 'bg-green-600' : 'bg-gray-300'}`} />
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
            <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 via-green-25 to-white">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-green-600 p-4 rounded-full shadow-lg">
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
            <Card className="border border-gray-200 hover:border-green-300 transition-colors">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <PiggyBank className="text-green-600" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-green-600">What is TengaPesa?</h3>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  TengaPesa is a proposed enhancement to the M-PESA platform designed to empower users to create dedicated mini wallets for effective financial planning. It enables the separation of funds into distinct sub-accounts, each with configurable locking functionalities and withdrawal conditions. Users can allocate money exclusively for specific purposes, ensuring that disbursements occur only from designated wallets, thereby promoting disciplined spending and long-term financial goal adherence.
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
            
            {/* Offline Status Indicator */}
            <div className="mt-4 flex justify-center">
              <Card className={`border-2 ${isOnline ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <>
                        <Wifi className="text-green-600" size={16} />
                        <span className="text-green-700 text-sm font-medium">Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="text-orange-600" size={16} />
                        <span className="text-orange-700 text-sm font-medium">Offline - Responses will be saved locally</span>
                      </>
                    )}
                    {pendingCount > 0 && (
                      <div className="flex items-center gap-1 ml-2">
                        <Cloud className="text-blue-600" size={14} />
                        <span className="text-blue-700 text-xs">
                          {pendingCount} pending submission{pendingCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Progress />

          <Card id="feedback-form" className="border-0 shadow-lg rounded-xl overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {/* Step 1: Demographic Information */}
                <div className={`p-6 space-y-6 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                  <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-6">
                    <User className="text-green-600" size={24} />
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
                            <RadioGroupItem value={age} id={`age-${age}`} className="sr-only" />
                            <Label
                              htmlFor={`age-${age}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.demographic.ageGroup === age
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
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
                            <RadioGroupItem value={occ} id={`occ-${occ}`} className="sr-only" />
                            <Label
                              htmlFor={`occ-${occ}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.demographic.occupation === occ
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
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

                    <div className="space-y-4">
                      <Label className="text-base font-medium text-gray-900">Monthly Income Range (KES)</Label>
                      <RadioGroup 
                        value={formData.demographic.incomeRange} 
                        onValueChange={(value) => updateFormField('demographic', 'incomeRange', value)}
                        className="grid grid-cols-2 gap-4"
                      >
                        {['Below 20,000', '20,000 - 50,000', '50,000 - 100,000', 'Above 100,000'].map((range) => (
                          <div key={range} className="flex items-center">
                            <RadioGroupItem value={range} id={`income-${range}`} className="sr-only" />
                            <Label
                              htmlFor={`income-${range}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.demographic.incomeRange === range
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {range}
                            </Label>
                          </div>
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
                          className={formData.demographic.usesMpesa ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                        >
                          Yes
                        </Button>
                        <Button
                          type="button"
                          variant={!formData.demographic.usesMpesa ? "default" : "outline"}
                          onClick={() => updateFormField('demographic', 'usesMpesa', false)}
                          className={!formData.demographic.usesMpesa ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
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
                    <Wallet className="text-green-600" size={24} />
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
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`budget-${option}`} className="sr-only" />
                            <Label
                              htmlFor={`budget-${option}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.financialHabits.followsBudget === option
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {option}
                            </Label>
                          </div>
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
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`money-${option}`} className="sr-only" />
                            <Label
                              htmlFor={`money-${option}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.financialHabits.runsOutOfMoney === option
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {option}
                            </Label>
                          </div>
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
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`saves-${option}`} className="sr-only" />
                            <Label
                              htmlFor={`saves-${option}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.financialHabits.savesMoney === option
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
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
                    <PiggyBank className="text-green-600" size={24} />
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
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`use-${option}`} className="sr-only" />
                            <Label
                              htmlFor={`use-${option}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.reactionToTengaPesa.wouldUseFeature === option
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {option}
                            </Label>
                          </div>
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
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`rules-${option}`} className="sr-only" />
                            <Label
                              htmlFor={`rules-${option}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.reactionToTengaPesa.findWithdrawalRulesHelpful === option
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {option}
                            </Label>
                          </div>
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
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`penalty-${option}`} className="sr-only" />
                            <Label
                              htmlFor={`penalty-${option}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.reactionToTengaPesa.feelingAboutPenalty === option
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {option}
                            </Label>
                          </div>
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
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`insights-${option}`} className="sr-only" />
                            <Label
                              htmlFor={`insights-${option}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.reactionToTengaPesa.wantsSpendingInsights === option
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {option}
                            </Label>
                          </div>
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
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`helps-${option}`} className="sr-only" />
                            <Label
                              htmlFor={`helps-${option}`}
                              className={cn(
                                "flex items-center justify-center w-full p-3 text-gray-700 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                formData.finalThoughts.thinksTengaPesaHelps === option
                                  ? "border-green-600 bg-green-50 text-green-600 font-medium shadow-sm" 
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {option}
                            </Label>
                          </div>
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
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                    >
                      Next Step
                      <ChevronRight size={16} />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
