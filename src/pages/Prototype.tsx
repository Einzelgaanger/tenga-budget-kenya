
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, DollarSign, Target, TrendingUp, Shield, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Prototype = () => {
  const navigate = useNavigate();
  const [currentBalance, setCurrentBalance] = useState(5000);
  const [monthlyTarget, setMonthlyTarget] = useState(2000);
  const [spentThisMonth, setSpentThisMonth] = useState(800);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedRule, setSelectedRule] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const progressPercentage = (spentThisMonth / monthlyTarget) * 100;
  const remainingBudget = monthlyTarget - spentThisMonth;

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount && selectedRule) {
      if (amount > remainingBudget) {
        setShowWarning(true);
      } else {
        setCurrentBalance(prev => prev - amount);
        setSpentThisMonth(prev => prev + amount);
        setWithdrawAmount('');
        setShowWarning(false);
      }
    }
  };

  const withdrawalRules = [
    { id: 'groceries', label: 'Groceries & Food', icon: '🛒' },
    { id: 'transport', label: 'Transport', icon: '🚗' },
    { id: 'utilities', label: 'Utilities & Bills', icon: '💡' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'emergency', label: 'Emergency', icon: '🚨' }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-6 sm:py-8 px-3 sm:px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">TengaPesa Prototype</h1>
            <p className="text-gray-600">Smart budgeting for M-PESA users</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balance & Budget Overview */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current M-PESA Balance</p>
                  <p className="text-3xl font-bold text-emerald-600">KSh {currentBalance.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Monthly Budget Progress</span>
                    <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>Spent: KSh {spentThisMonth}</span>
                    <span>Target: KSh {monthlyTarget}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-xs text-gray-600">Remaining</p>
                    <p className="font-semibold text-blue-600">KSh {remainingBudget}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <p className="text-xs text-gray-600">Days Left</p>
                    <p className="font-semibold text-purple-600">15 days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Withdrawal */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Smart Withdrawal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Withdrawal Amount (KSh)
                  </label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Category
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {withdrawalRules.map((rule) => (
                      <Button
                        key={rule.id}
                        variant={selectedRule === rule.id ? "default" : "outline"}
                        onClick={() => setSelectedRule(rule.id)}
                        className="justify-start h-auto p-3"
                      >
                        <span className="mr-2">{rule.icon}</span>
                        {rule.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {showWarning && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-700">
                      <p className="font-medium">Budget Exceeded!</p>
                      <p>This withdrawal will exceed your monthly budget by KSh {parseFloat(withdrawAmount) - remainingBudget}. Consider adjusting your spending.</p>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || !selectedRule}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Process Withdrawal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center p-4">
              <Shield className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">Budget Protection</h3>
              <p className="text-sm text-gray-600 mt-1">Automatic warnings when spending exceeds limits</p>
            </Card>
            
            <Card className="text-center p-4">
              <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Smart Categories</h3>
              <p className="text-sm text-gray-600 mt-1">Categorized spending for better tracking</p>
            </Card>
            
            <Card className="text-center p-4">
              <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Real-time Updates</h3>
              <p className="text-sm text-gray-600 mt-1">Instant budget updates with every transaction</p>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>How TengaPesa Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Set Your Budget</h3>
                <p className="text-sm text-gray-600">Define monthly spending limits for different categories</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Smart Withdrawals</h3>
                <p className="text-sm text-gray-600">Choose category when withdrawing money from M-PESA</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Stay on Track</h3>
                <p className="text-sm text-gray-600">Get warnings and insights to maintain your budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Prototype;
