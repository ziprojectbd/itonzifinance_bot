import React, { useState } from 'react';
import { X, Wallet, Coins, TrendingUp, Calendar } from 'lucide-react';
import WithdrawComponent from '../Components/Payment/WithdrawComponent';
import DepositComponent from '../Components/Payment/DepositComponent';
import HistoryComponent from '../Components/Payment/HistoryComponent';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, balance }) => {
  const [activeTab, setActiveTab] = useState<'withdraw' | 'deposit' | 'history'>('withdraw');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Show success message
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 m-0">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full h-full min-h-screen flex flex-col overflow-hidden border border-gray-700 rounded-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Payment Center</h2>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-white">
                <Coins className="w-6 h-6 text-yellow-300" />
                <span className="text-2xl font-bold">${balance.toFixed(3)}</span>
              </div>
              <p className="text-green-100 text-sm">Available Balance</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="flex">
            {[
              { id: 'withdraw', label: 'Withdraw', icon: TrendingUp },
              { id: 'deposit', label: 'Deposit', icon: Wallet },
              { id: 'history', label: 'History', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all ${
                    activeTab === tab.id
                      ? 'text-green-400 bg-green-400/10 border-b-2 border-green-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {activeTab === 'withdraw' && (
            <WithdrawComponent 
              balance={balance}
              onWithdraw={handleWithdraw}
              isProcessing={isProcessing}
            />
          )}

          {activeTab === 'deposit' && (
            <DepositComponent onClose={onClose} />
          )}

          {activeTab === 'history' && (
            <HistoryComponent />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;