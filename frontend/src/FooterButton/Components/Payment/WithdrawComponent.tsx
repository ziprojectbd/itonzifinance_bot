import React, { useState } from 'react';
import { Wallet, DollarSign, CreditCard, ArrowRight, Coins, Zap, TrendingUp, Activity, Globe } from 'lucide-react';

interface WithdrawComponentProps {
  balance: number;
  onWithdraw: (method: string, amount: string, address: string) => void;
  isProcessing: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  minAmount: number;
  fee: number;
  processingTime: string;
  available: boolean;
}

const WithdrawComponent: React.FC<WithdrawComponentProps> = ({ 
  balance, 
  onWithdraw, 
  isProcessing 
}) => {
  const [amount, setAmount] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showDetails, setShowDetails] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'ton',
      name: 'TON Wallet',
      icon: <Wallet className="w-6 h-6" />,
      minAmount: 0.1,
      fee: 0.01,
      processingTime: '5-10 minutes',
      available: true
    },
    {
      id: 'usdt',
      name: 'USDT (TRC20)',
      icon: <DollarSign className="w-6 h-6" />,
      minAmount: 5,
      fee: 1,
      processingTime: '10-30 minutes',
      available: true
    },
    {
      id: 'binance',
      name: 'Binance UID',
      icon: <Coins className="w-6 h-6 text-yellow-400" />,
      minAmount: 1,
      fee: 0,
      processingTime: '5-15 minutes',
      available: true
    },
    {
      id: 'bitget',
      name: 'Bitget UID',
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      minAmount: 1,
      fee: 0,
      processingTime: '5-15 minutes',
      available: true
    },
    {
      id: 'mexc',
      name: 'MEXC UID',
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
      minAmount: 1,
      fee: 0,
      processingTime: '5-15 minutes',
      available: true
    },
    {
      id: 'bybit',
      name: 'Bybit UID',
      icon: <Activity className="w-6 h-6 text-purple-400" />,
      minAmount: 1,
      fee: 0,
      processingTime: '5-15 minutes',
      available: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <CreditCard className="w-6 h-6" />,
      minAmount: 10,
      fee: 0.5,
      processingTime: '1-3 business days',
      available: true
    },
    {
      id: 'payoneer',
      name: 'Payoneer',
      icon: <Globe className="w-6 h-6 text-orange-400" />,
      minAmount: 15,
      fee: 1,
      processingTime: '2-5 business days',
      available: true
    }
  ];

  // Wallet validation functions
  const validateTONWallet = (address: string): boolean => {
    // TON wallet addresses start with 'EQ' or 'UQ' and are 48 characters long
    const tonRegex = /^[EU]Q[a-zA-Z0-9]{46}$/;
    return tonRegex.test(address);
  };

  const validateUSDTAddress = (address: string): boolean => {
    // TRC20 addresses start with 'T' and are 34 characters long
    const trc20Regex = /^T[a-zA-Z0-9]{33}$/;
    return trc20Regex.test(address);
  };

  const validateBinanceUID = (uid: string): boolean => {
    // Binance UID is typically 6-10 digits
    const binanceUIDRegex = /^\d{6,10}$/;
    return binanceUIDRegex.test(uid);
  };

  const validateExchangeUID = (uid: string): boolean => {
    // Exchange UIDs are typically 6-10 digits (Bitget, MEXC, Bybit)
    const exchangeUIDRegex = /^\d{6,10}$/;
    return exchangeUIDRegex.test(uid);
  };

  const validateWalletAddress = (methodId: string, address: string): string => {
    if (!address.trim()) {
      return 'Wallet address is required';
    }

    switch (methodId) {
      case 'ton':
        if (!validateTONWallet(address)) {
          return 'Invalid TON wallet address. Should start with EQ or UQ and be 48 characters long';
        }
        break;
      case 'usdt':
        if (!validateUSDTAddress(address)) {
          return 'Invalid USDT (TRC20) address. Should start with T and be 34 characters long';
        }
        break;
      case 'binance':
        if (!validateBinanceUID(address)) {
          return 'Invalid Binance UID. Should be 6-10 digits only';
        }
        break;
      case 'bitget':
        if (!validateExchangeUID(address)) {
          return 'Invalid Bitget UID. Should be 6-10 digits only';
        }
        break;
      case 'mexc':
        if (!validateExchangeUID(address)) {
          return 'Invalid MEXC UID. Should be 6-10 digits only';
        }
        break;
      case 'bybit':
        if (!validateExchangeUID(address)) {
          return 'Invalid Bybit UID. Should be 6-10 digits only';
        }
        break;
      case 'paypal':
        // PayPal uses email addresses
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(address)) {
          return 'Invalid PayPal email address';
        }
        break;
      case 'payoneer':
        // Payoneer uses email addresses
        const payoneerEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!payoneerEmailRegex.test(address)) {
          return 'Invalid Payoneer email address';
        }
        break;
      default:
        return 'Invalid payment method';
    }

    return '';
  };

  const handleWithdraw = (methodId: string) => {
    if (!amount || !walletAddress) return;
    
    const amountNum = parseFloat(amount);
    const method = paymentMethods.find(m => m.id === methodId);
    
    // Check balance
    if (amountNum > balance) {
      setValidationError(`Insufficient balance. Available: $${balance.toFixed(2)}`);
      return;
    }
    
    // Check minimum amount
    if (amountNum < method!.minAmount) {
      setValidationError(`Minimum withdrawal amount is $${method!.minAmount}`);
      return;
    }
    
    // Check if amount is greater than fee
    if (amountNum <= method!.fee) {
      setValidationError(`Amount must be greater than fee ($${method!.fee})`);
      return;
    }
    
    const error = validateWalletAddress(methodId, walletAddress);
    if (error) {
      setValidationError(error);
      return;
    }
    
    setValidationError('');
    onWithdraw(methodId, amount, walletAddress);
  };



  const toggleDetails = (methodId: string) => {
    if (showDetails === methodId) {
      setShowDetails('');
      setAmount('');
      setWalletAddress('');
      setValidationError('');
    } else {
      setShowDetails(methodId);
      setAmount('');
      setWalletAddress('');
      setValidationError('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div>
        <h3 className="text-white font-bold mb-3">Payment Methods</h3>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                showDetails === method.id
                  ? 'border-green-400 bg-green-400/10'
                  : method.available
                  ? 'border-gray-600 bg-gray-800/50'
                  : 'border-gray-700 bg-gray-800/30 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-green-400">{method.icon}</div>
                  <div className="text-left">
                    <div className="text-white font-medium">{method.name}</div>
                    <div className="text-gray-400 text-sm">
                      Min: ${method.minAmount} • Fee: ${method.fee} • {method.processingTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.available && (
                    <span className="text-red-400 text-xs font-bold">SOON</span>
                  )}
                  {method.available && (
                    <button
                      onClick={() => toggleDetails(method.id)}
                      className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      {showDetails === method.id ? 'Cancel' : 'Withdraw'}
                    </button>
                  )}
                </div>
              </div>

              {/* Withdrawal Details */}
              {showDetails === method.id && method.available && (
                <div className="space-y-4 pt-4 border-t border-gray-600">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-white font-bold mb-2">Withdrawal Amount</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
                      />
                      <button
                        onClick={() => setAmount(balance.toString())}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm font-bold transition-colors"
                      >
                        MAX
                      </button>
                    </div>
                    {amount && (
                      <div className="mt-2 text-sm">
                        {parseFloat(amount) > balance ? (
                          <div className="text-red-400">
                            Insufficient balance. Available: ${balance.toFixed(2)}
                          </div>
                        ) : parseFloat(amount) <= method.fee ? (
                          <div className="text-red-400">
                            Amount must be greater than fee (${method.fee})
                          </div>
                        ) : (
                          <div className="text-gray-400">
                            You'll receive: ${(parseFloat(amount) - method.fee).toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-white font-bold mb-2">
                      {['paypal', 'payoneer'].includes(method.id) ? `${method.name} Email` : 
                       ['binance', 'bitget', 'mexc', 'bybit'].includes(method.id) ? `${method.name.split(' ')[0]} UID` : 'Wallet Address'}
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => {
                        setWalletAddress(e.target.value);
                        setValidationError(''); // Clear error when user types
                      }}
                      placeholder={
                        ['paypal', 'payoneer'].includes(method.id)
                          ? `Enter your ${method.name} email` 
                          : method.id === 'ton'
                          ? 'EQ... or UQ... (48 characters)'
                          : ['binance', 'bitget', 'mexc', 'bybit'].includes(method.id)
                          ? `Enter your ${method.name.split(' ')[0]} UID (6-10 digits)`
                          : 'T... (34 characters)'
                      }
                      className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
                        validationError && showDetails === method.id 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-600 focus:border-green-400'
                      }`}
                    />
                    {validationError && showDetails === method.id && (
                      <div className="mt-2 text-sm text-red-400 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        {validationError}
                      </div>
                    )}
                  </div>

                  {/* Withdraw Button */}
                  {amount && walletAddress && !validationError && parseFloat(amount) <= balance && parseFloat(amount) > method.fee && parseFloat(amount) >= method.minAmount && (
                    <button
                      onClick={() => handleWithdraw(method.id)}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-3 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-5 h-5" />
                          Withdraw ${amount} via {method.name}
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* General Submit Button */}
      {showDetails && amount && walletAddress && !validationError && parseFloat(amount) <= balance && parseFloat(amount) > (paymentMethods.find(m => m.id === showDetails)?.fee || 0) && parseFloat(amount) >= (paymentMethods.find(m => m.id === showDetails)?.minAmount || 0) && (
        <div className="pt-6 border-t border-gray-600">
          <button
            onClick={() => handleWithdraw(showDetails)}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-4 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
          >
            {isProcessing ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing Withdrawal...
              </>
            ) : (
              <>
                <ArrowRight className="w-6 h-6" />
                Submit Withdrawal Request
              </>
            )}
          </button>
          <p className="text-center text-gray-400 text-sm mt-2">
            By clicking submit, you agree to our withdrawal terms and conditions
          </p>
        </div>
      )}
    </div>
  );
};

export default WithdrawComponent; 