import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  X,
  Eye,
  Download,
  Filter,
  Search,
  RefreshCw,
  Ban,
  Check,
  Wallet,
  ExternalLink,
  Copy,
  Calendar,
  Users,
  Target
} from 'lucide-react';

interface Transaction {
  id: string;
  userId: string;
  username: string;
  type: 'withdrawal' | 'deposit' | 'bonus' | 'referral' | 'task_reward';
  amount: number;
  currency: 'USD' | 'TON' | 'USDT';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  method: string;
  walletAddress?: string;
  txHash?: string;
  createdAt: string;
  processedAt?: string;
  notes?: string;
  riskScore: number;
  fees: number;
}

interface PaymentStats {
  totalVolume: number;
  totalWithdrawals: number;
  totalDeposits: number;
  pendingAmount: number;
  processingAmount: number;
  completedToday: number;
  failedToday: number;
  averageProcessingTime: string;
  conversionRate: number;
}

const PaymentManager: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'withdrawal' | 'deposit' | 'bonus' | 'referral' | 'task_reward'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'amount' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(20);

  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    totalVolume: 2450000,
    totalWithdrawals: 1890000,
    totalDeposits: 560000,
    pendingAmount: 45600,
    processingAmount: 23400,
    completedToday: 156,
    failedToday: 8,
    averageProcessingTime: '2h 34m',
    conversionRate: 94.2
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterAndSortTransactions();
  }, [transactions, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const loadTransactions = () => {
    // Generate sample transactions
    const sampleTransactions: Transaction[] = Array.from({ length: 100 }, (_, index) => {
      const types: Transaction['type'][] = ['withdrawal', 'deposit', 'bonus', 'referral', 'task_reward'];
      const statuses: Transaction['status'][] = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
      const methods = ['TON Wallet', 'USDT (TRC20)', 'PayPal', 'Bank Transfer'];
      
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: `tx_${index + 1}`,
        userId: `user_${Math.floor(Math.random() * 1000) + 1}`,
        username: `User${Math.floor(Math.random() * 1000) + 1}`,
        type,
        amount: Math.floor(Math.random() * 1000) + 10,
        currency: ['USD', 'TON', 'USDT'][Math.floor(Math.random() * 3)] as any,
        status,
        method: methods[Math.floor(Math.random() * methods.length)],
        walletAddress: Math.random() > 0.3 ? `UQBx...${Math.random().toString(36).substr(2, 4)}` : undefined,
        txHash: status === 'completed' ? `0x${Math.random().toString(16).substr(2, 8)}...` : undefined,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        processedAt: status === 'completed' ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() : undefined,
        notes: Math.random() > 0.8 ? 'Requires manual review' : undefined,
        riskScore: Math.floor(Math.random() * 100),
        fees: Math.floor(Math.random() * 10) + 1
      };
    });

    setTransactions(sampleTransactions);
  };

  const filterAndSortTransactions = () => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  

  const handleTransactionAction = (transactionId: string, action: 'approve' | 'reject' | 'cancel' | 'retry') => {
    const updatedTransactions = transactions.map(tx => {
      if (tx.id === transactionId) {
        switch (action) {
          case 'approve':
            return { ...tx, status: 'completed' as const, processedAt: new Date().toISOString() };
          case 'reject':
            return { ...tx, status: 'failed' as const, processedAt: new Date().toISOString() };
          case 'cancel':
            return { ...tx, status: 'cancelled' as const, processedAt: new Date().toISOString() };
          case 'retry':
            return { ...tx, status: 'processing' as const };
          default:
            return tx;
        }
      }
      return tx;
    });

    setTransactions(updatedTransactions);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'processing': return 'text-blue-400 bg-blue-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      case 'cancelled': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'withdrawal': return 'text-red-400 bg-red-400/20';
      case 'deposit': return 'text-green-400 bg-green-400/20';
      case 'bonus': return 'text-purple-400 bg-purple-400/20';
      case 'referral': return 'text-blue-400 bg-blue-400/20';
      case 'task_reward': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400 bg-red-400/20';
    if (score >= 40) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-green-400 bg-green-400/20';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const exportTransactions = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'itonzi-transactions.json';
    link.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Payment Management</h2>
        <p className="text-yellow-100">Monitor and manage all financial transactions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">${paymentStats.totalVolume.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Volume</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-red-400">${paymentStats.totalWithdrawals.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Withdrawals</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-green-400">${paymentStats.totalDeposits.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Deposits</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-yellow-400">${paymentStats.pendingAmount.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Pending</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-blue-400">${paymentStats.processingAmount.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Processing</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-green-400">{paymentStats.completedToday}</div>
          <div className="text-gray-400 text-sm">Completed Today</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-red-400">{paymentStats.failedToday}</div>
          <div className="text-gray-400 text-sm">Failed Today</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-purple-400">{paymentStats.conversionRate}%</div>
          <div className="text-gray-400 text-sm">Success Rate</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1 w-full">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="w-full max-w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              />
            </div>
            {/* Filters */}
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-yellow-400 focus:outline-none w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-yellow-400 focus:outline-none w-full sm:w-auto"
              >
                <option value="all">All Types</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="deposit">Deposit</option>
                <option value="bonus">Bonus</option>
                <option value="referral">Referral</option>
                <option value="task_reward">Task Reward</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-yellow-400 focus:outline-none w-full sm:w-auto"
              >
                <option value="createdAt">Date</option>
                <option value="amount">Amount</option>
                <option value="status">Status</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white hover:bg-gray-600 transition-colors w-full sm:w-auto"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={loadTransactions}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={exportTransactions}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="text-gray-400 text-sm">
          Showing {indexOfFirstTransaction + 1}-{Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} transactions
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Transaction</th>
                <th className="text-left p-4 text-gray-300 font-medium">User</th>
                <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                <th className="text-left p-4 text-gray-300 font-medium">Amount</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Method</th>
                <th className="text-left p-4 text-gray-300 font-medium">Risk</th>
                <th className="text-left p-4 text-gray-300 font-medium">Date</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="text-white font-medium">{transaction.id}</div>
                      {transaction.txHash && (
                        <div className="text-gray-400 text-sm font-mono flex items-center gap-1">
                          {transaction.txHash}
                          <button
                            onClick={() => copyToClipboard(transaction.txHash!)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-white font-medium">{transaction.username}</div>
                      <div className="text-gray-400 text-sm">{transaction.userId}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeColor(transaction.type)}`}>
                      {transaction.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className={`font-bold ${transaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount} {transaction.currency}
                      </div>
                      <div className="text-gray-400 text-sm">Fee: ${transaction.fees}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-white text-sm">{transaction.method}</div>
                      {transaction.walletAddress && (
                        <div className="text-gray-400 text-xs font-mono">{transaction.walletAddress}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(transaction.riskScore)}`}>
                      {transaction.riskScore}%
                    </span>
                    {transaction.notes && (
                      <div className="text-yellow-400 text-xs mt-1">⚠️ Notes</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-gray-400 text-sm">
                      <div>{formatDate(transaction.createdAt)}</div>
                      {transaction.processedAt && (
                        <div className="text-green-400">Processed: {formatDate(transaction.processedAt)}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowTransactionModal(true);
                        }}
                        className="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {transaction.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleTransactionAction(transaction.id, 'approve')}
                            className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTransactionAction(transaction.id, 'reject')}
                            className="w-8 h-8 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {transaction.status === 'failed' && (
                        <button
                          onClick={() => handleTransactionAction(transaction.id, 'retry')}
                          className="w-8 h-8 bg-yellow-600 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors"
                          title="Retry"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Transaction Details</h3>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transaction Info */}
                <div className="space-y-4">
                  <h4 className="text-white font-bold text-lg">Transaction Information</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-gray-400 text-sm">Transaction ID</div>
                      <div className="text-white font-mono">{selectedTransaction.id}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Type</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeColor(selectedTransaction.type)}`}>
                        {selectedTransaction.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Status</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedTransaction.status)}`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Amount</div>
                      <div className={`text-lg font-bold ${selectedTransaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                        {selectedTransaction.type === 'withdrawal' ? '-' : '+'}${selectedTransaction.amount} {selectedTransaction.currency}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Fees</div>
                      <div className="text-white">${selectedTransaction.fees}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Method</div>
                      <div className="text-white">{selectedTransaction.method}</div>
                    </div>
                  </div>
                </div>

                {/* User & Technical Info */}
                <div className="space-y-4">
                  <h4 className="text-white font-bold text-lg">User & Technical Details</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-gray-400 text-sm">User</div>
                      <div className="text-white">{selectedTransaction.username}</div>
                      <div className="text-gray-400 text-sm">{selectedTransaction.userId}</div>
                    </div>
                    {selectedTransaction.walletAddress && (
                      <div>
                        <div className="text-gray-400 text-sm">Wallet Address</div>
                        <div className="text-white font-mono text-sm flex items-center gap-2">
                          {selectedTransaction.walletAddress}
                          <button
                            onClick={() => copyToClipboard(selectedTransaction.walletAddress!)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    {selectedTransaction.txHash && (
                      <div>
                        <div className="text-gray-400 text-sm">Transaction Hash</div>
                        <div className="text-white font-mono text-sm flex items-center gap-2">
                          {selectedTransaction.txHash}
                          <button
                            onClick={() => copyToClipboard(selectedTransaction.txHash!)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="text-blue-400 hover:text-blue-300">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-gray-400 text-sm">Risk Score</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(selectedTransaction.riskScore)}`}>
                        {selectedTransaction.riskScore}%
                      </span>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Created</div>
                      <div className="text-white">{formatDate(selectedTransaction.createdAt)}</div>
                    </div>
                    {selectedTransaction.processedAt && (
                      <div>
                        <div className="text-gray-400 text-sm">Processed</div>
                        <div className="text-white">{formatDate(selectedTransaction.processedAt)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedTransaction.notes && (
                <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/50 rounded-lg">
                  <h5 className="text-yellow-400 font-bold mb-2">Notes</h5>
                  <p className="text-white">{selectedTransaction.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-3">
              {selectedTransaction.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleTransactionAction(selectedTransaction.id, 'approve');
                      setShowTransactionModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleTransactionAction(selectedTransaction.id, 'reject');
                      setShowTransactionModal(false);
                    }}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              {selectedTransaction.status === 'failed' && (
                <button
                  onClick={() => {
                    handleTransactionAction(selectedTransaction.id, 'retry');
                    setShowTransactionModal(false);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Retry
                </button>
              )}
              <button
                onClick={() => setShowTransactionModal(false)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManager;