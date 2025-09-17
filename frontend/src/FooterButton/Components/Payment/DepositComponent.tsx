import React, { useState } from 'react';
import { Wallet, Copy, Check } from 'lucide-react';

interface DepositComponentProps {
  onClose: () => void;
}

const DepositComponent: React.FC<DepositComponentProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('bep20');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const usdtNetworks = [
    { 
      id: 'bep20', 
      name: 'BEP20 (Binance Smart Chain)', 
      symbol: 'BSC',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    },
    { 
      id: 'erc20', 
      name: 'ERC20 (Ethereum)', 
      symbol: 'ETH',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    },
    { 
      id: 'trc20', 
      name: 'TRC20 (Tron)', 
      symbol: 'TRX',
      address: 'TQn9Y2khDD95J42FQtQTdwVVRzQyJxHvJv'
    },
    { 
      id: 'polygon', 
      name: 'Polygon', 
      symbol: 'MATIC',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    },
    { 
      id: 'arbitrum', 
      name: 'Arbitrum', 
      symbol: 'ARB',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!selectedNetwork) {
      alert('Please select a network for USDT payment');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement actual deposit logic here
      console.log(`Processing ${amount} USDT via ${selectedNetwork.toUpperCase()}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Deposit submitted successfully!');
      onClose();
    } catch (error) {
      alert('Deposit failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const selectedNetworkData = usdtNetworks.find(network => network.id === selectedNetwork);

  return (
    <div className="space-y-6">
      <div className="bg-blue-600/20 border border-blue-400/50 rounded-lg p-6">
        <Wallet className="w-12 h-12 mx-auto mb-4 text-blue-400" />
        <h3 className="text-white font-bold text-lg mb-2">Deposit USDT</h3>
        <p className="text-gray-300 mb-4">
          Add USDT to your account to unlock premium features and earn more rewards.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-white font-medium">
            Deposit Amount (USDT)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              USDT
            </span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00 USDT"
              min="1"
              step="0.01"
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Network Selection */}
        <div className="space-y-3">
          <label htmlFor="network" className="block text-white font-medium">
            Select Network
          </label>
          <div className="relative">
            <select
              id="network"
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              {usdtNetworks.map((network) => (
                <option key={network.id} value={network.id} className="bg-gray-800 text-white">
                  {network.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
            <strong>Note:</strong> Make sure to select the correct network. Sending to the wrong network may result in permanent loss of funds.
          </div>
        </div>

        {/* Deposit Address Display */}
        {selectedNetworkData && (
          <div className="space-y-3">
            <label className="block text-white font-medium">
              Deposit Address ({selectedNetworkData.symbol})
            </label>
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">USDT Address:</div>
                  <div className="text-white font-mono text-sm break-all">
                    {selectedNetworkData.address}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(selectedNetworkData.address)}
                  className="ml-3 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                  title="Copy address"
                >
                  {copiedAddress === selectedNetworkData.address ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
              <div className="mt-3 text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded">
                ⚠️ Send only USDT tokens to this address. Sending other tokens may result in permanent loss.
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !amount || !selectedNetwork}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-bold transition-colors text-white"
        >
          {isSubmitting ? 'Processing...' : `Deposit ${amount || '0.00'} USDT (${selectedNetwork.toUpperCase()})`}
        </button>
      </form>
      
      <div className="bg-purple-600/20 border border-purple-400/50 rounded-lg p-4">
        <h4 className="text-white font-bold mb-2">Bonus Opportunities</h4>
        <div className="space-y-2 text-sm text-gray-300">
          <div>• Daily check-in bonus: +10 coins</div>
          <div>• Referral bonus: +100 coins per friend</div>
          <div>• Weekly challenges: Up to +500 coins</div>
        </div>
      </div>
    </div>
  );
};

export default DepositComponent; 