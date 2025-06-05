import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Bell, 
  MoreHorizontal, 
  QrCode, 
  ArrowUpDown, 
  CreditCard, 
  Smartphone, 
  DollarSign,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Home,
  ArrowLeftRight,
  BarChart3,
  Grid3X3,
  Send,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from '@/components/ui/sonner';

const Prototype = () => {
  const [selectedAccount, setSelectedAccount] = useState('main');
  const [balances, setBalances] = useState<Record<string, number>>({
    main: 100000,
  });
  const [titles, setTitles] = useState<Record<string, string>>({
    main: 'M-PESA',
  });
  const [descriptions, setDescriptions] = useState<Record<string, string>>({
    main: 'Main M-PESA account for all transactions',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccountTitle, setNewAccountTitle] = useState('');
  const [newAccountDescription, setNewAccountDescription] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFromAccount, setTransferFromAccount] = useState('');
  const [transferToAccount, setTransferToAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockAmount, setLockAmount] = useState('');
  const [lockYears, setLockYears] = useState('0');
  const [lockMonths, setLockMonths] = useState('0');
  const [lockDays, setLockDays] = useState('1');
  const [customPenalty, setCustomPenalty] = useState('1');
  const [lockedFunds, setLockedFunds] = useState<Record<string, any>>({});
  const [showBalance, setShowBalance] = useState(true);

  const loadAccounts = () => {
    const storedTitles = localStorage.getItem('accountTitles');
    if (storedTitles) {
      const parsed = JSON.parse(storedTitles);
      setTitles({ main: 'M-PESA', ...parsed });
    }
    
    const storedDescriptions = localStorage.getItem('accountDescriptions');
    if (storedDescriptions) {
      const parsed = JSON.parse(storedDescriptions);
      setDescriptions({ main: 'Main M-PESA account for all transactions', ...parsed });
    }
    
    const storedBalances = localStorage.getItem('accountBalances');
    if (storedBalances) {
      const parsed = JSON.parse(storedBalances);
      setBalances({ main: 100000, ...parsed });
    }
  };

  const saveAccounts = () => {
    localStorage.setItem('accountTitles', JSON.stringify(titles));
    localStorage.setItem('accountDescriptions', JSON.stringify(descriptions));
    localStorage.setItem('accountBalances', JSON.stringify(balances));
  };

  const showEnhancedToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, description?: string) => {
    const config = {
      success: { icon: <CheckCircle className="h-4 w-4" />, className: 'border-green-200 bg-green-50 text-green-800' },
      error: { icon: <AlertTriangle className="h-4 w-4" />, className: 'border-red-200 bg-red-50 text-red-800' },
      warning: { icon: <AlertTriangle className="h-4 w-4" />, className: 'border-yellow-200 bg-yellow-50 text-yellow-800' },
      info: { icon: <Info className="h-4 w-4" />, className: 'border-blue-200 bg-blue-50 text-blue-800' }
    };

    const toastConfig = config[type];
    
    if (type === 'success') {
      toast.success(title, { description });
    } else if (type === 'error') {
      toast.error(title, { description });
    } else if (type === 'warning') {
      toast.warning(title, { description });
    } else {
      toast.info(title, { description });
    }
  };

  const createNewAccount = () => {
    if (!newAccountTitle.trim()) {
      showEnhancedToast('error', 'Validation Error', 'Account title is required');
      return;
    }

    if (Object.values(titles).includes(newAccountTitle)) {
      showEnhancedToast('error', 'Account Exists', 'An account with this name already exists');
      return;
    }

    const newKey = newAccountTitle.toLowerCase().replace(/\s+/g, '');
    
    const newTitles = { ...titles, [newKey]: newAccountTitle };
    const newDescriptions = { ...descriptions, [newKey]: newAccountDescription.trim() || 'No description provided' };
    const newBalances = { ...balances, [newKey]: 0 };
    
    setTitles(newTitles);
    setDescriptions(newDescriptions);
    setBalances(newBalances);
    setSelectedAccount(newKey);
    setShowCreateModal(false);
    setNewAccountTitle('');
    setNewAccountDescription('');
    
    localStorage.setItem('accountTitles', JSON.stringify(newTitles));
    localStorage.setItem('accountDescriptions', JSON.stringify(newDescriptions));
    localStorage.setItem('accountBalances', JSON.stringify(newBalances));
    
    showEnhancedToast('success', 'Account Created', `${newAccountTitle} account has been created successfully`);
  };

  const deleteAccount = () => {
    if (selectedAccount === 'main') {
      showEnhancedToast('error', 'Cannot Delete Main Account', 'The main M-PESA account cannot be deleted');
      setShowDeleteModal(false);
      return;
    }

    const accountBalance = balances[selectedAccount] || 0;
    let totalTransferAmount = accountBalance;

    if (lockedFunds[selectedAccount]) {
      const lockedAmount = lockedFunds[selectedAccount].amount;
      const penalty = lockedFunds[selectedAccount].penalty;
      const penaltyAmount = lockedAmount * (penalty / 100);
      const netLockedAmount = lockedAmount - penaltyAmount;
      
      totalTransferAmount += netLockedAmount;
      
      showEnhancedToast('warning', 'Locked Funds Penalty Applied', 
        `Penalty of KES ${penaltyAmount.toFixed(2)} applied. Net transfer: KES ${totalTransferAmount.toFixed(2)}`);
      
      const { [selectedAccount]: removedLock, ...restLocks } = lockedFunds;
      setLockedFunds(restLocks);
      localStorage.setItem('lockedFunds', JSON.stringify(restLocks));
    }

    const newBalances = {
      ...balances,
      main: (balances.main || 0) + totalTransferAmount
    };
    
    const { [selectedAccount]: deletedTitle, ...restTitles } = titles;
    const { [selectedAccount]: deletedDescription, ...restDescriptions } = descriptions;
    const { [selectedAccount]: deletedBalance, ...restBalances } = newBalances;

    delete restBalances[selectedAccount];

    setTitles(restTitles);
    setDescriptions(restDescriptions);
    setBalances(restBalances);
    setSelectedAccount('main');
    
    localStorage.setItem('accountTitles', JSON.stringify(restTitles));
    localStorage.setItem('accountDescriptions', JSON.stringify(restDescriptions));
    localStorage.setItem('accountBalances', JSON.stringify(restBalances));
    
    setShowDeleteModal(false);
    
    showEnhancedToast('success', 'Account Deleted', 
      `${deletedTitle} deleted successfully. KES ${totalTransferAmount.toLocaleString()} transferred to main account`);
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    
    if (!transferFromAccount || !transferToAccount) {
      showEnhancedToast('error', 'Invalid Selection', 'Please select both source and destination accounts');
      return;
    }
    
    if (transferFromAccount === transferToAccount) {
      showEnhancedToast('error', 'Invalid Transfer', 'Cannot transfer to the same account');
      return;
    }
    
    if (!amount || amount <= 0) {
      showEnhancedToast('error', 'Invalid Amount', 'Please enter a valid transfer amount');
      return;
    }
    
    if ((balances[transferFromAccount] || 0) < amount) {
      showEnhancedToast('error', 'Insufficient Funds', 'Not enough balance in source account');
      return;
    }

    const lockedAmount = lockedFunds[transferFromAccount]?.amount || 0;
    const availableBalance = (balances[transferFromAccount] || 0) - lockedAmount;
    
    if (availableBalance < amount) {
      showEnhancedToast('error', 'Insufficient Available Funds', 
        `Only KES ${availableBalance.toLocaleString()} available (KES ${lockedAmount.toLocaleString()} locked)`);
      return;
    }

    const newBalances = {
      ...balances,
      [transferFromAccount]: (balances[transferFromAccount] || 0) - amount,
      [transferToAccount]: (balances[transferToAccount] || 0) + amount
    };
    
    setBalances(newBalances);
    localStorage.setItem('accountBalances', JSON.stringify(newBalances));

    setShowTransferModal(false);
    setTransferFromAccount('');
    setTransferToAccount('');
    setTransferAmount('');
    
    showEnhancedToast('success', 'Transfer Successful', 
      `KES ${amount.toLocaleString()} transferred from ${titles[transferFromAccount]} to ${titles[transferToAccount]}`);
  };

  const loadLockedFunds = () => {
    const storedLockedFunds = localStorage.getItem('lockedFunds');
    if (storedLockedFunds) {
      setLockedFunds(JSON.parse(storedLockedFunds));
    }
  };

  const saveLockedFunds = (updatedLockedFunds: any) => {
    localStorage.setItem('lockedFunds', JSON.stringify(updatedLockedFunds));
    setLockedFunds(updatedLockedFunds);
  };

  const validateLockDuration = () => {
    const years = parseInt(lockYears);
    const months = parseInt(lockMonths);
    const days = parseInt(lockDays);
    
    if (years === 0 && months === 0 && days === 0) {
      return false;
    }
    
    if (years === 0 && months === 0 && days < 1) {
      return false;
    }
    
    return true;
  };

  const handleLockFunds = () => {
    const amount = parseFloat(lockAmount);
    const penalty = parseFloat(customPenalty);
    
    if (!amount || amount <= 0) {
      showEnhancedToast('error', 'Invalid Amount', 'Please enter a valid amount to lock');
      return;
    }
    
    if (!validateLockDuration()) {
      showEnhancedToast('error', 'Invalid Duration', 'Please enter a valid lock duration (minimum 1 day)');
      return;
    }
    
    if ((balances[selectedAccount] || 0) < amount) {
      showEnhancedToast('error', 'Insufficient Funds', 'Not enough balance to lock this amount');
      return;
    }
    
    if (penalty < 1 || penalty > 100) {
      showEnhancedToast('error', 'Invalid Penalty', 'Penalty must be between 1% and 100%');
      return;
    }

    const lockUntil = new Date();
    const years = parseInt(lockYears);
    const months = parseInt(lockMonths);
    const days = parseInt(lockDays);
    
    lockUntil.setFullYear(lockUntil.getFullYear() + years);
    lockUntil.setMonth(lockUntil.getMonth() + months);
    lockUntil.setDate(lockUntil.getDate() + days);

    const newBalances = {
      ...balances,
      [selectedAccount]: (balances[selectedAccount] || 0) - amount
    };
    setBalances(newBalances);
    localStorage.setItem('accountBalances', JSON.stringify(newBalances));

    const updatedLockedFunds = {
      ...lockedFunds,
      [selectedAccount]: {
        amount: amount,
        until: lockUntil.getTime(),
        penalty: penalty
      }
    };

    saveLockedFunds(updatedLockedFunds);
    setShowLockModal(false);
    setLockAmount('');
    setLockYears('0');
    setLockMonths('0');
    setLockDays('1');
    setCustomPenalty('1');
    
    showEnhancedToast('success', 'Funds Locked Successfully', 
      `KES ${amount.toLocaleString()} locked until ${lockUntil.toLocaleDateString()} with ${penalty}% early penalty`);
  };

  const handleUnlockEarly = (account: string) => {
    if (lockedFunds[account]) {
      const lockedAmount = lockedFunds[account].amount;
      const penaltyRate = lockedFunds[account].penalty;
      const penaltyAmount = lockedAmount * (penaltyRate / 100);
      const netAmount = lockedAmount - penaltyAmount;
      
      const newBalances = {
        ...balances,
        [account]: (balances[account] || 0) + netAmount
      };
      setBalances(newBalances);
      localStorage.setItem('accountBalances', JSON.stringify(newBalances));

      const { [account]: removedLock, ...restLocks } = lockedFunds;
      saveLockedFunds(restLocks);
      
      if (penaltyAmount > 0) {
        showEnhancedToast('warning', 'Early Unlock Penalty Applied', 
          `Penalty: KES ${penaltyAmount.toFixed(2)}. Net received: KES ${netAmount.toFixed(2)}`);
      } else {
        showEnhancedToast('success', 'Funds Unlocked', 
          `KES ${netAmount.toFixed(2)} successfully unlocked`);
      }
    }
  };

  const getAvailableBalance = (account: string) => {
    const totalBalance = balances[account] || 0;
    return totalBalance;
  };

  const isLockExpired = (account: string) => {
    if (!lockedFunds[account]) return false;
    return Date.now() > lockedFunds[account].until;
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const displayBalance = (account: string) => {
    if (!showBalance) return 'KES ***,***';
    return `KES ${(balances[account] || 0).toLocaleString()}`;
  };

  useEffect(() => {
    loadAccounts();
    loadLockedFunds();
  }, []);

  useEffect(() => {
    saveAccounts();
  }, [balances, titles, descriptions]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile App Container */}
        <div className="max-w-sm mx-auto bg-white shadow-xl min-h-screen">
          {/* Header */}
          <div className="bg-green-600 text-white p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <User className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm opacity-90">Good morning,</p>
                  <p className="font-semibold">Alfred</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowTransferModal(true)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  title="Transfer Between Accounts"
                >
                  <Send size={18} />
                </button>
                <button 
                  onClick={() => setShowLockModal(true)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  title="Lock Funds"
                >
                  <Lock size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Bell size={20} className="opacity-80" />
                <MoreHorizontal size={20} className="opacity-80" />
              </div>
              <QrCode size={20} className="opacity-80" />
            </div>
          </div>

          {/* Account Selection */}
          <div className="p-4 bg-white border-b border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-sm font-medium text-gray-700">Account</Label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
                >
                  <Plus size={14} className="mr-1" />
                  Create
                </Button>
                {selectedAccount !== 'main' && (
                  <Button
                    onClick={() => setShowDeleteModal(true)}
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 h-8 px-3"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
            
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            >
              {Object.entries(titles).map(([key, title]) => (
                <option key={key} value={key}>
                  {title}
                </option>
              ))}
            </select>

            {/* Account Description */}
            {descriptions[selectedAccount] && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">Account Details:</p>
                <p className="text-sm text-blue-700">{descriptions[selectedAccount]}</p>
              </div>
            )}
          </div>

          {/* Balance Card */}
          <div className="p-4">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    Available Balance
                    {lockedFunds[selectedAccount] && (
                      <Lock size={14} className="text-blue-600" />
                    )}
                  </span>
                  <button 
                    onClick={toggleBalanceVisibility}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {displayBalance(selectedAccount)}
                </div>
                
                {/* Locked Funds Indicator */}
                {lockedFunds[selectedAccount] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Lock className="text-blue-600" size={16} />
                        <span className="font-semibold text-blue-900">
                          KES {lockedFunds[selectedAccount].amount.toLocaleString()} Locked
                        </span>
                      </div>
                      <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                        {lockedFunds[selectedAccount].penalty}% penalty
                      </span>
                    </div>
                    <div className="text-sm text-blue-700 mb-3">
                      {isLockExpired(selectedAccount) ? (
                        <span className="text-green-600 font-medium">Lock expired - funds available for unlock</span>
                      ) : (
                        `Locked until ${new Date(lockedFunds[selectedAccount].until).toLocaleDateString()}`
                      )}
                    </div>
                    <Button
                      onClick={() => handleUnlockEarly(selectedAccount)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white h-8"
                    >
                      <Unlock size={14} className="mr-1" />
                      {isLockExpired(selectedAccount) ? 'Unlock Funds' : `Unlock Early (${lockedFunds[selectedAccount].penalty}% penalty)`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-3 p-4">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <ArrowUpDown className="text-white" size={20} />
              </div>
              <span className="text-xs text-gray-700 font-medium">SEND & REQUEST</span>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="text-white" size={20} />
              </div>
              <span className="text-xs text-gray-700 font-medium">PAY</span>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="text-white" size={20} />
              </div>
              <span className="text-xs text-gray-700 font-medium">WITHDRAW</span>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Smartphone className="text-white" size={20} />
              </div>
              <span className="text-xs text-gray-700 font-medium">AIRTIME</span>
            </div>
          </div>

          {/* Statements Section */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">M-PESA STATEMENTS</h3>
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                SEE ALL
              </Button>
            </div>
            
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">KS</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">KASINA SUITES</p>
                    <p className="text-sm text-gray-600">3 May, 07:13 PM</p>
                  </div>
                  <span className="font-semibold text-red-600">- KSH. 7,000.00</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Services */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Financial Services</h3>
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {['Pochi', 'MALI', 'Ziidi', 'KCB'].map((service) => (
                <div key={service} className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-semibold text-gray-700">{service}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200">
            <div className="grid grid-cols-4 p-2">
              <div className="text-center py-2">
                <Home className="text-green-600 mx-auto mb-1" size={20} />
                <span className="text-xs text-green-600 font-medium">HOME</span>
              </div>
              <div className="text-center py-2">
                <ArrowLeftRight className="text-gray-400 mx-auto mb-1" size={20} />
                <span className="text-xs text-gray-400">TRANSACT</span>
              </div>
              <div className="text-center py-2">
                <Grid3X3 className="text-gray-400 mx-auto mb-1" size={20} />
                <span className="text-xs text-gray-400">SERVICES</span>
              </div>
              <div className="text-center py-2">
                <BarChart3 className="text-gray-400 mx-auto mb-1" size={20} />
                <span className="text-xs text-gray-400">GROW</span>
              </div>
            </div>
          </div>

          {/* Modals */}
          {/* Create Account Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Create New Account</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="account-title" className="block mb-2">Account Title *</Label>
                      <Input
                        id="account-title"
                        value={newAccountTitle}
                        onChange={(e) => setNewAccountTitle(e.target.value)}
                        placeholder="e.g., School Fees, Savings"
                      />
                    </div>
                    <div>
                      <Label htmlFor="account-description" className="block mb-2">Description</Label>
                      <Textarea
                        id="account-description"
                        value={newAccountDescription}
                        onChange={(e) => setNewAccountDescription(e.target.value)}
                        placeholder="e.g., School account number: 123456789"
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="ghost" onClick={() => {
                      setShowCreateModal(false);
                      setNewAccountTitle('');
                      setNewAccountDescription('');
                    }}>Cancel</Button>
                    <Button onClick={createNewAccount} className="bg-green-600 hover:bg-green-700">
                      Create Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Delete Account Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Account</h3>
                  <p className="mb-4">
                    Are you sure you want to delete the account "{titles[selectedAccount]}"?
                    {lockedFunds[selectedAccount] && (
                      <span className="block text-red-600 text-sm mt-2 font-medium">
                        ⚠️ This account has locked funds. Early withdrawal penalty of {lockedFunds[selectedAccount].penalty}% will apply.
                      </span>
                    )}
                    <span className="block text-gray-600 text-sm mt-2">
                      All funds (KES {((balances[selectedAccount] || 0) + (lockedFunds[selectedAccount]?.amount || 0)).toLocaleString()}) will be transferred to your main account.
                    </span>
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={deleteAccount}>Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transfer Between Accounts Modal */}
          {showTransferModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Transfer Between Accounts</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="transfer-from" className="block mb-2">From Account</Label>
                      <select
                        id="transfer-from"
                        value={transferFromAccount}
                        onChange={(e) => setTransferFromAccount(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg"
                      >
                        <option value="">Select account</option>
                        {Object.entries(titles).map(([key, title]) => (
                          <option key={key} value={key}>
                            {title} (KES {getAvailableBalance(key).toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="transfer-to" className="block mb-2">To Account</Label>
                      <select
                        id="transfer-to"
                        value={transferToAccount}
                        onChange={(e) => setTransferToAccount(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg"
                      >
                        <option value="">Select account</option>
                        {Object.entries(titles).map(([key, title]) => (
                          <option key={key} value={key}>
                            {title}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="transfer-amount" className="block mb-2">Amount</Label>
                      <Input
                        id="transfer-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="ghost" onClick={() => setShowTransferModal(false)}>Cancel</Button>
                    <Button onClick={handleTransfer} className="bg-green-600 hover:bg-green-700">
                      Transfer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Lock Funds Modal */}
          {showLockModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Lock Funds</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="lock-account" className="block mb-2">Account: {titles[selectedAccount]}</Label>
                      <p className="text-sm text-gray-600">Available: KES {getAvailableBalance(selectedAccount).toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="lock-amount" className="block mb-2">Amount to Lock</Label>
                      <Input
                        id="lock-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={lockAmount}
                        onChange={(e) => setLockAmount(e.target.value)}
                        max={getAvailableBalance(selectedAccount)}
                      />
                    </div>
                    
                    <div>
                      <Label className="block mb-2">Lock Duration</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="lock-years" className="block mb-1 text-xs">Years</Label>
                          <Input
                            id="lock-years"
                            type="number"
                            min="0"
                            max="10"
                            value={lockYears}
                            onChange={(e) => setLockYears(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lock-months" className="block mb-1 text-xs">Months</Label>
                          <Input
                            id="lock-months"
                            type="number"
                            min="0"
                            max="11"
                            value={lockMonths}
                            onChange={(e) => setLockMonths(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lock-days" className="block mb-1 text-xs">Days</Label>
                          <Input
                            id="lock-days"
                            type="number"
                            min={parseInt(lockYears) === 0 && parseInt(lockMonths) === 0 ? "1" : "0"}
                            max="30"
                            value={lockDays}
                            onChange={(e) => setLockDays(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-penalty" className="block mb-2">Early Unlock Penalty (%)</Label>
                      <Input
                        id="custom-penalty"
                        type="number"
                        placeholder="1"
                        value={customPenalty}
                        onChange={(e) => setCustomPenalty(e.target.value)}
                        min="1"
                        max="100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Penalty for early withdrawal (1-100%)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="ghost" onClick={() => setShowLockModal(false)}>Cancel</Button>
                    <Button onClick={handleLockFunds} className="bg-blue-600 hover:bg-blue-700">
                      Lock Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Prototype;
