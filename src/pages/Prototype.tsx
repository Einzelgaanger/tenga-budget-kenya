import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Grid3X3
} from 'lucide-react';
import Layout from '@/components/Layout';

const Prototype = () => {
  const [selectedAccount, setSelectedAccount] = useState('main');
  const [balances, setBalances] = useState({
    main: 15000,
    savings: 5000,
    investments: 10000,
  });
  const [titles, setTitles] = useState({
    main: 'M-PESA',
    savings: 'Savings',
    investments: 'Investments',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccountTitle, setNewAccountTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransactModal, setShowTransactModal] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockAmount, setLockAmount] = useState('');
  const [lockDuration, setLockDuration] = useState('30');
  const [lockedFunds, setLockedFunds] = useState<{ [key: string]: any }>({});
  const [showBalance, setShowBalance] = useState(true);

  const loadAccounts = () => {
    const storedTitles = localStorage.getItem('accountTitles');
    if (storedTitles) {
      setTitles(JSON.parse(storedTitles));
    }
    const storedBalances = localStorage.getItem('accountBalances');
    if (storedBalances) {
      setBalances(JSON.parse(storedBalances));
    }
  };

  const saveAccounts = () => {
    localStorage.setItem('accountTitles', JSON.stringify(titles));
    localStorage.setItem('accountBalances', JSON.stringify(balances));
  };

  const createNewAccount = () => {
    if (newAccountTitle && !titles[newAccountTitle]) {
      const newKey = newAccountTitle.toLowerCase().replace(/\s+/g, '');
      setTitles(prev => ({ ...prev, [newKey]: newAccountTitle }));
      setBalances(prev => ({ ...prev, [newKey]: 0 }));
      setSelectedAccount(newKey);
      saveAccounts();
      setShowCreateModal(false);
      setNewAccountTitle('');
    }
  };

  const deleteAccount = () => {
    const { [selectedAccount]: deletedTitle, ...restTitles } = titles;
    const { [selectedAccount]: deletedBalance, ...restBalances } = balances;

    setTitles(restTitles);
    setBalances(restBalances);
    setSelectedAccount('main');
    saveAccounts();
    setShowDeleteModal(false);
  };

  const handleTransaction = () => {
    const amount = parseFloat(transactionAmount);
    if (!isNaN(amount)) {
      setBalances(prev => ({
        ...prev,
        [selectedAccount]: (prev[selectedAccount] || 0) + amount
      }));
      saveAccounts();
      setShowTransactModal(false);
      setTransactionAmount('');
    }
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

  const handleLockFunds = () => {
    const amount = parseFloat(lockAmount);
    if (!isNaN(amount) && amount > 0) {
      const lockUntil = new Date();
      lockUntil.setDate(lockUntil.getDate() + parseInt(lockDuration));

      const updatedLockedFunds = {
        ...lockedFunds,
        [selectedAccount]: {
          amount: amount,
          until: lockUntil.getTime()
        }
      };

      saveLockedFunds(updatedLockedFunds);
      setShowLockModal(false);
      setLockAmount('');
    }
  };

  const handleUnlockEarly = (account: string) => {
    if (lockedFunds[account]) {
      const penalty = lockedFunds[account].amount * 0.1;
      setBalances(prev => ({
        ...prev,
        [account]: (prev[account] || 0) - penalty
      }));

      const { [account]: removedLock, ...restLocks } = lockedFunds;
      saveLockedFunds(restLocks);
      saveAccounts();
    }
  };

  useEffect(() => {
    loadAccounts();
    loadLockedFunds();
  }, []);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const displayBalance = (account: string) => {
    if (!showBalance) return 'KES ***,***';
    return balances[account] || 'KES 0';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile App Container */}
        <div className="max-w-sm mx-auto bg-white shadow-xl min-h-screen">
          {/* Header */}
          <div className="bg-mpesa-green text-white p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <User className="text-mpesa-green" size={20} />
                </div>
                <div>
                  <p className="text-sm opacity-90">Good morning,</p>
                  <p className="font-semibold">Alfred</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowTransactModal(true)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ArrowLeftRight size={18} />
                </button>
                <button 
                  onClick={() => setShowLockModal(true)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
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
                  className="bg-mpesa-green hover:bg-mpesa-darkgreen text-white h-8 px-3"
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
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-mpesa-green focus:border-transparent"
            >
              {Object.entries(titles).map(([key, title]) => (
                <option key={key} value={key}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {/* Balance Card */}
          <div className="p-4">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    Balance
                    {lockedFunds[selectedAccount] && (
                      <Lock size={14} className="text-mpesa-blue" />
                    )}
                  </span>
                  <button 
                    onClick={toggleBalanceVisibility}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  {displayBalance(selectedAccount)}
                </div>
                
                {/* Locked Funds Indicator */}
                {lockedFunds[selectedAccount] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Lock className="text-blue-600" size={16} />
                        <span className="font-semibold text-blue-900">
                          KES {lockedFunds[selectedAccount].amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-blue-700 mb-3">
                      Locked until {new Date(lockedFunds[selectedAccount].until).toLocaleDateString()}
                    </div>
                    <Button
                      onClick={() => handleUnlockEarly(selectedAccount)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white h-8"
                    >
                      <Unlock size={14} className="mr-1" />
                      Unlock Early (with penalty)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-3 p-4">
            <div className="text-center">
              <div className="w-14 h-14 bg-mpesa-green rounded-full flex items-center justify-center mx-auto mb-2">
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
              <Button variant="ghost" size="sm" className="text-mpesa-green hover:text-mpesa-darkgreen">
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
              <Button variant="ghost" size="sm" className="text-mpesa-green hover:text-mpesa-darkgreen">
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
                <Home className="text-mpesa-green mx-auto mb-1" size={20} />
                <span className="text-xs text-mpesa-green font-medium">HOME</span>
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
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <Card className="max-w-sm p-6">
                <CardContent>
                  <Label htmlFor="account-title" className="block mb-2">Account Title</Label>
                  <Input
                    id="account-title"
                    value={newAccountTitle}
                    onChange={(e) => setNewAccountTitle(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button onClick={createNewAccount}>Create Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Delete Account Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <Card className="max-w-sm p-6">
                <CardContent>
                  <p className="mb-4">Are you sure you want to delete the account "{titles[selectedAccount]}"?</p>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={deleteAccount}>Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transact Modal */}
          {showTransactModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <Card className="max-w-sm p-6">
                <CardContent>
                  <Label htmlFor="transaction-amount" className="block mb-2">Transaction Amount</Label>
                  <Input
                    id="transaction-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setShowTransactModal(false)}>Cancel</Button>
                    <Button onClick={handleTransaction}>Confirm Transaction</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lock Funds Modal */}
          {showLockModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <Card className="max-w-sm p-6">
                <CardContent>
                  <Label htmlFor="lock-amount" className="block mb-2">Amount to Lock</Label>
                  <Input
                    id="lock-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={lockAmount}
                    onChange={(e) => setLockAmount(e.target.value)}
                    className="mb-4"
                  />
                  <Label htmlFor="lock-duration" className="block mb-2">Lock Duration (days)</Label>
                  <select
                    id="lock-duration"
                    value={lockDuration}
                    onChange={(e) => setLockDuration(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-mpesa-green focus:border-transparent mb-4"
                  >
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="180">180 Days</option>
                    <option value="365">365 Days</option>
                  </select>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setShowLockModal(false)}>Cancel</Button>
                    <Button onClick={handleLockFunds}>Lock Funds</Button>
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
