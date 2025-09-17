import React, { useState } from 'react';
import { X, History, Search, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Eye, Download, RefreshCw } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ActivityRecord {
  id: string;
  type: 'ad_watch' | 'task_complete' | 'referral' | 'bonus' | 'withdrawal' | 'login';
  title: string;
  description: string;
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  details?: any;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'earnings' | 'withdrawals' | 'tasks'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const activityHistory: ActivityRecord[] = [
    {
      id: '1',
      type: 'ad_watch',
      title: 'Ad Watched',
      description: 'Completed video advertisement',
      amount: 0.001,
      timestamp: '2024-01-15T14:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'task_complete',
      title: 'Daily Check-in',
      description: 'Completed daily check-in streak',
      amount: 0.05,
      timestamp: '2024-01-15T09:00:00Z',
      status: 'completed'
    },
    {
      id: '3',
      type: 'referral',
      title: 'Referral Bonus',
      description: 'Friend joined using your code',
      amount: 0.1,
      timestamp: '2024-01-14T16:45:00Z',
      status: 'completed'
    },
    {
      id: '4',
      type: 'withdrawal',
      title: 'Withdrawal Request',
      description: 'TON Wallet withdrawal',
      amount: -25.5,
      timestamp: '2024-01-14T12:20:00Z',
      status: 'pending'
    },
    {
      id: '5',
      type: 'bonus',
      title: 'Weekly Bonus',
      description: 'Top 10 leaderboard reward',
      amount: 1.0,
      timestamp: '2024-01-13T18:00:00Z',
      status: 'completed'
    },
    {
      id: '6',
      type: 'task_complete',
      title: 'Social Media Share',
      description: 'Shared iTonzi on social media',
      amount: 0.075,
      timestamp: '2024-01-13T11:30:00Z',
      status: 'completed'
    },
    {
      id: '7',
      type: 'ad_watch',
      title: 'Auto Ads Session',
      description: 'Completed 10 ads in auto mode',
      amount: 0.01,
      timestamp: '2024-01-12T20:15:00Z',
      status: 'completed'
    },
    {
      id: '8',
      type: 'login',
      title: 'Login Bonus',
      description: 'Daily login reward',
      amount: 0.01,
      timestamp: '2024-01-12T08:45:00Z',
      status: 'completed'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ad_watch': return <Eye className="w-5 h-5 text-blue-400" />;
      case 'task_complete': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'referral': return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'bonus': return <TrendingUp className="w-5 h-5 text-yellow-400" />;
      case 'withdrawal': return <TrendingDown className="w-5 h-5 text-red-400" />;
      case 'login': return <Clock className="w-5 h-5 text-cyan-400" />;
      default: return <History className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredHistory = activityHistory.filter(record => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'earnings' && record.amount > 0) ||
      (activeFilter === 'withdrawals' && record.amount < 0) ||
      (activeFilter === 'tasks' && record.type === 'task_complete');
    
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const totalEarnings = activityHistory
    .filter(record => record.amount > 0)
    .reduce((sum, record) => sum + record.amount, 0);

  const totalWithdrawals = Math.abs(activityHistory
    .filter(record => record.amount < 0)
    .reduce((sum, record) => sum + record.amount, 0));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 m-0">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full h-full min-h-screen flex flex-col overflow-hidden border border-gray-700 rounded-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Activity History</h2>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-300">${totalEarnings.toFixed(3)}</div>
                <div className="text-blue-100 text-sm">Total Earned</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-300">${totalWithdrawals.toFixed(3)}</div>
                <div className="text-blue-100 text-sm">Withdrawn</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 bg-gray-800 border-b border-gray-700 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'earnings', label: 'Earnings' },
              { id: 'withdrawals', label: 'Withdrawals' },
              { id: 'tasks', label: 'Tasks' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {filteredHistory.length > 0 ? (
            <div className="space-y-3">
              {filteredHistory.map((record) => (
                <div key={record.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getActivityIcon(record.type)}
                      <div>
                        <div className="text-white font-medium">{record.title}</div>
                        <div className="text-gray-400 text-sm">{record.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        record.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {record.amount > 0 ? '+' : ''}${Math.abs(record.amount).toFixed(3)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {getStatusIcon(record.status)}
                        <span>{record.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(record.timestamp)}</span>
                    <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-white font-bold mb-2">No Activities Found</h3>
              <p className="text-gray-400 text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'Start earning to see your activity history'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;