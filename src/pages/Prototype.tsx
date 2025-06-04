
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, EyeOff, Plus, Trash2, Send, Lock, LockOpen, AlertTriangle, CheckCircle, Info, DollarSign, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Prototype = () => {
  const navigate = useNavigate();
  
  // Initialize state from localStorage or defaults
  const [balances, setBalances] = useState(() => {
    const saved = localStorage.getItem('tengapesa_balances');
    return saved ? JSON.parse(saved) : { main: 'KES 100,000' };
  });
  
  const [titles, setTitles] = useState(() => {
    const saved = localStorage.getItem('tengapesa_titles');
    return saved ? JSON.parse(saved) : { main: 'MAIN' };
  });
  
  const [lockedFunds, setLockedFunds] = useState(() => {
    const saved = localStorage.getItem('tengapesa_locked_funds');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [selectedAccount, setSelectedAccount] = useState('main');
  const [showBalance, setShowBalance] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [newAccountName, setNewAccountName] = useState('');
  const [transferFrom, setTransferFrom] = useState('main');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [lockAmount, setLockAmount] = useState('');
  const [lockYears, setLockYears] = useState(0);
  const [lockMonths, setLockMonths] = useState(0);
  const [lockDays, setLockDays] = useState(1);
  const [lockPenalty, setLockPenalty] = useState(1);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('tengapesa_balances', JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem('tengapesa_titles', JSON.stringify(titles));
  }, [titles]);

  useEffect(() => {
    localStorage.setItem('tengapesa_locked_funds', JSON.stringify(lockedFunds));
  }, [lockedFunds]);

  const currencyToNumber = (currencyStr) => {
    return parseFloat(currencyStr.replace('KES ', '').replace(/,/g, ''));
  };

  const numberToCurrency = (num) => {
    return `KES ${num.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB');
  };

  const showAlert = (type, title, message) => {
    alert(`${title}: ${message}`);
  };

  const createAccount = () => {
    if (!newAccountName.trim()) return;
    
    const accountKey = newAccountName.toLowerCase().replace(/\s+/g, '');
    if (balances[accountKey]) {
      showAlert('error', 'Account Exists', 'An account with this name already exists');
      return;
    }

    setBalances(prev => ({ ...prev, [accountKey]: 'KES 0' }));
    setTitles(prev => ({ ...prev, [accountKey]: newAccountName.trim() }));
    setSelectedAccount(accountKey);
    setNewAccountName('');
    setShowCreateModal(false);
    showAlert('success', 'Account Created', `${newAccountName} account created successfully`);
  };

  const deleteAccount = () => {
    if (selectedAccount === 'main') return;
    
    if (deleteStep === 1) {
      setDeleteStep(2);
      return;
    }

    if (deleteConfirmText !== 'DELETE') {
      showAlert('error', 'Invalid Confirmation', 'Please type DELETE to confirm');
      return;
    }

    // Transfer remaining balance to main
    const remainingBalance = currencyToNumber(balances[selectedAccount]);
    if (remainingBalance > 0) {
      const mainBalance = currencyToNumber(balances.main);
      setBalances(prev => ({
        ...prev,
        main: numberToCurrency(mainBalance + remainingBalance),
        [selectedAccount]: undefined
      }));
    } else {
      setBalances(prev => {
        const newBalances = { ...prev };
        delete newBalances[selectedAccount];
        return newBalances;
      });
    }

    setTitles(prev => {
      const newTitles = { ...prev };
      delete newTitles[selectedAccount];
      return newTitles;
    });

    if (lockedFunds[selectedAccount]) {
      setLockedFunds(prev => {
        const newLocked = { ...prev };
        delete newLocked[selectedAccount];
        return newLocked;
      });
    }

    setSelectedAccount('main');
    setShowDeleteModal(false);
    setDeleteStep(1);
    setDeleteConfirmText('');
    showAlert('success', 'Account Deleted', 'Account deleted successfully');
  };

  const transferMoney = () => {
    if (transferFrom === transferTo) {
      showAlert('error', 'Invalid Transfer', 'Cannot transfer to the same account');
      return;
    }

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Invalid Amount', 'Please enter a valid amount');
      return;
    }

    const fromBalance = currencyToNumber(balances[transferFrom]);
    if (fromBalance < amount) {
      showAlert('error', 'Insufficient Funds', 'Not enough funds in source account');
      return;
    }

    const toBalance = currencyToNumber(balances[transferTo]);
    setBalances(prev => ({
      ...prev,
      [transferFrom]: numberToCurrency(fromBalance - amount),
      [transferTo]: numberToCurrency(toBalance + amount)
    }));

    setTransferAmount('');
    setShowTransferModal(false);
    showAlert('success', 'Transfer Complete', `KES ${amount.toLocaleString()} transferred successfully`);
  };

  const lockFunds = () => {
    const amount = parseFloat(lockAmount);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (lockYears === 0 && lockMonths === 0 && lockDays === 0) {
      showAlert('error', 'Invalid Period', 'Please specify a lock period');
      return;
    }

    const currentBalance = currencyToNumber(balances[selectedAccount]);
    if (amount > currentBalance) {
      showAlert('error', 'Insufficient Funds', 'Not enough funds to lock');
      return;
    }

    const now = new Date();
    const unlockDate = new Date(now);
    unlockDate.setFullYear(unlockDate.getFullYear() + lockYears);
    unlockDate.setMonth(unlockDate.getMonth() + lockMonths);
    unlockDate.setDate(unlockDate.getDate() + lockDays);

    setBalances(prev => ({
      ...prev,
      [selectedAccount]: numberToCurrency(currentBalance - amount)
    }));

    setLockedFunds(prev => ({
      ...prev,
      [selectedAccount]: {
        amount,
        until: unlockDate.getTime(),
        penalty: lockPenalty
      }
    }));

    setLockAmount('');
    setLockYears(0);
    setLockMonths(0);
    setLockDays(1);
    setLockPenalty(1);
    setShowLockModal(false);
    showAlert('success', 'Funds Locked', `KES ${amount.toLocaleString()} locked until ${formatDate(unlockDate)}`);
  };

  const unlockFunds = () => {
    const locked = lockedFunds[selectedAccount];
    if (!locked) return;

    const penaltyAmount = locked.amount * (locked.penalty / 100);
    const returnAmount = locked.amount - penaltyAmount;
    const currentBalance = currencyToNumber(balances[selectedAccount]);

    setBalances(prev => ({
      ...prev,
      [selectedAccount]: numberToCurrency(currentBalance + returnAmount)
    }));

    setLockedFunds(prev => {
      const newLocked = { ...prev };
      delete newLocked[selectedAccount];
      return newLocked;
    });

    showAlert('info', 'Funds Unlocked', `KES ${returnAmount.toLocaleString()} returned (KES ${penaltyAmount.toLocaleString()} penalty applied)`);
  };

  const accountKeys = Object.keys(balances);
  const currentLocked = lockedFunds[selectedAccount];
  const isLocked = currentLocked && new Date(currentLocked.until) > new Date();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto py-6 px-4 max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin')}
              className="text-white hover:bg-gray-800 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">TengaPesa</h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 p-2">
                <Send className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-gray-800 p-2"
                onClick={() => setShowLockModal(true)}
              >
                <Lock className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-gray-400">Good morning, Alfred</p>
          </div>

          {/* Account Management */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <select 
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600 rounded px-3 py-2 text-lg font-semibold"
                >
                  {accountKeys.map(key => (
                    <option key={key} value={key}>{titles[key]}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCreateModal(true)}
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {selectedAccount !== 'main' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDeleteModal(true)}
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-2">
                  {showBalance ? balances[selectedAccount] : 'KES ••••••'}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-gray-700 p-1"
                  >
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {isLocked && (
                  <div className="bg-blue-900 rounded-lg p-3 mt-3">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">
                        KES {currentLocked.amount.toLocaleString()} locked
                      </span>
                    </div>
                    <p className="text-xs text-blue-300 mb-2">
                      Until: {formatDate(new Date(currentLocked.until))}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={unlockFunds}
                      className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                    >
                      <LockOpen className="h-4 w-4 mr-1" />
                      Unlock Early (Penalty: {currentLocked.penalty}%)
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button 
              className="bg-green-600 hover:bg-green-700 h-16 flex-col gap-1"
              onClick={() => setShowTransferModal(true)}
            >
              <Send className="h-5 w-5" />
              <span className="text-xs">TRANSFER</span>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 h-16 flex-col gap-1">
              <DollarSign className="h-5 w-5" />
              <span className="text-xs">PAY</span>
            </Button>
          </div>

          {/* Recent Transactions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">RECENT TRANSACTIONS</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold">
                    KS
                  </div>
                  <div>
                    <p className="font-medium text-white">KASINA SUITES</p>
                    <p className="text-xs text-gray-400">3 May, 07:13 PM</p>
                  </div>
                </div>
                <span className="text-red-400 font-semibold">- KSH 7,000.00</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Mini Account</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  <X className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
              <Input
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="Account name (e.g., Holiday)"
                className="mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                New accounts start with KES 0. Transfer money from your Main account after creation.
              </p>
              <Button onClick={createAccount} className="w-full bg-green-600 hover:bg-green-700">
                Create Account
              </Button>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-red-600">Delete Account</h3>
                <Button variant="ghost" size="sm" onClick={() => { setShowDeleteModal(false); setDeleteStep(1); }}>
                  <X className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
              
              {deleteStep === 1 ? (
                <>
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to delete the <strong>{titles[selectedAccount]}</strong> account?
                  </p>
                  <div className="bg-gray-100 rounded p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      Current balance: <strong>{balances[selectedAccount]}</strong>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Any remaining funds will be transferred to your Main account.
                    </p>
                  </div>
                  <Button onClick={deleteAccount} className="w-full bg-red-600 hover:bg-red-700 mb-2">
                    Continue to Delete
                  </Button>
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="w-full">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span className="font-semibold text-red-600">Final Warning</span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    This action cannot be undone. Type <strong>DELETE</strong> below to confirm.
                  </p>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE here"
                    className="mb-4"
                  />
                  <Button 
                    onClick={deleteAccount} 
                    disabled={deleteConfirmText !== 'DELETE'}
                    className="w-full bg-red-600 hover:bg-red-700 mb-2"
                  >
                    Permanently Delete Account
                  </Button>
                  <Button variant="outline" onClick={() => setDeleteStep(1)} className="w-full">
                    Go Back
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {showTransferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Transfer Money</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowTransferModal(false)}>
                  <X className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select 
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {accountKeys.map(key => (
                    <option key={key} value={key}>{titles[key]}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select 
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select account</option>
                  {accountKeys.filter(key => key !== transferFrom).map(key => (
                    <option key={key} value={key}>{titles[key]}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <Input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="KES 0.00"
                />
              </div>
              
              <Button onClick={transferMoney} className="w-full bg-green-600 hover:bg-green-700">
                Send Money
              </Button>
            </div>
          </div>
        )}

        {showLockModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-600">Lock Your Savings</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowLockModal(false)}>
                  <X className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                <div className="bg-gray-100 rounded px-3 py-2 font-semibold text-blue-600">
                  {titles[selectedAccount]}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Lock</label>
                <Input
                  type="number"
                  value={lockAmount}
                  onChange={(e) => setLockAmount(e.target.value)}
                  placeholder="KES 0.00"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lock Period</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">Years</label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={lockYears}
                      onChange={(e) => setLockYears(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Months</label>
                    <Input
                      type="number"
                      min="0"
                      max="11"
                      value={lockMonths}
                      onChange={(e) => setLockMonths(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Days</label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={lockDays}
                      onChange={(e) => setLockDays(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penalty for Early Withdrawal (%)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={lockPenalty}
                  onChange={(e) => setLockPenalty(parseFloat(e.target.value) || 1)}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Minimum penalty is 1%. This fee will be deducted if you withdraw before the lock period ends.
                </p>
              </div>
              
              <Button onClick={lockFunds} className="w-full bg-blue-600 hover:bg-blue-700">
                Lock Money
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Prototype;
