import React from 'react';
import { Clock, CheckCircle, AlertCircle, Copy } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'withdrawal' | 'deposit';
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  txHash?: string;
}

interface HistoryComponentProps {
  transactions?: Transaction[];
}

const HistoryComponent: React.FC<HistoryComponentProps> = ({ 
  transactions = [
    {
      id: '1',
      type: 'withdrawal',
      amount: 25.50,
      method: 'TON Wallet',
      status: 'completed',
      date: '2024-01-15',
      txHash: 'EQBx...7k9m'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 15.00,
      method: 'USDT (TRC20)',
      status: 'pending',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 50.00,
      method: 'Bonus',
      status: 'completed',
      date: '2024-01-13'
    }
  ]
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold">Recent Transactions</h3>
      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(tx.status)}
                  <span className="text-white font-medium">
                    {tx.type === 'withdrawal' ? 'Withdrawal' : 'Deposit'}
                  </span>
                </div>
                <span className={`font-bold ${
                  tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount}
                </span>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div>Method: {tx.method}</div>
                <div>Date: {tx.date}</div>
                {tx.txHash && (
                  <div className="flex items-center gap-2">
                    <span>TX: {tx.txHash}</span>
                    <button 
                      onClick={() => copyToClipboard(tx.txHash!)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400">No transactions yet</p>
        </div>
      )}
    </div>
  );
};

export default HistoryComponent; 