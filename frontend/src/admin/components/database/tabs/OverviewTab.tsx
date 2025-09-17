import React, { useState } from 'react';
import { DatabaseStats } from '../types';
import { Eye, EyeOff, RefreshCw, Activity, Database, Settings, Shield } from 'lucide-react';

interface OverviewTabProps {
  stats: DatabaseStats;
  onBackup: () => void;
  isBackingUp: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  onBackup,
  isBackingUp,
}) => {
  const [showConnectionString, setShowConnectionString] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Database Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{stats.totalSize}</div>
          <div className="text-gray-400 text-sm">Total Size</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{stats.totalTables}</div>
          <div className="text-gray-400 text-sm">Tables</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{stats.totalRecords.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Records</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{stats.connections}</div>
          <div className="text-gray-400 text-sm">Connections</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-white font-bold text-lg mb-4">Storage Usage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Used</span>
              <span className="text-white font-bold">{stats.storageUsed} MB</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-400 h-3 rounded-full"
                style={{ width: `${(stats.storageUsed / stats.storageTotal) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>0 MB</span>
              <span>{stats.storageTotal} MB</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-white font-bold text-lg mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Uptime</span>
              <span className="text-green-400 font-bold">{stats.uptime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Query Performance</span>
              <span className="text-blue-400 font-bold">{stats.queryPerformance}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Last Backup</span>
              <span className="text-purple-400 font-bold">{formatDate(stats.lastBackup)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Info */}
      <div className="bg-gray-700/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-white font-bold text-lg">Database Connection</h3>
          <button
            onClick={() => setShowConnectionString(!showConnectionString)}
            className="text-orange-400 hover:text-orange-300 flex items-center gap-2"
          >
            {showConnectionString ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showConnectionString ? 'Hide' : 'Show'} Connection String
          </button>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto break-all">
          <div className="text-gray-300">
            {showConnectionString 
              ? 'mongodb+srv://juwel:juwel@cluster0.8ktkm.mongodb.net/iTonziFinance_bot'
              : 'mongodb+srv://••••:••••@cluster0.8ktkm.mongodb.net/iTonziFinance_bot'
            }
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={onBackup}
          disabled={isBackingUp}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
        >
          {isBackingUp ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Shield className="w-6 h-6" />}
          <span className="font-medium">{isBackingUp ? 'Backing Up...' : 'Create Backup'}</span>
        </button>
        <button className="bg-green-600 hover:bg-green-500 p-4 rounded-lg transition-colors flex flex-col items-center gap-2">
          <Activity className="w-6 h-6" />
          <span className="font-medium">Monitor Performance</span>
        </button>
        <button className="bg-purple-600 hover:bg-purple-500 p-4 rounded-lg transition-colors flex flex-col items-center gap-2">
          <Database className="w-6 h-6" />
          <span className="font-medium">Optimize Tables</span>
        </button>
        <button className="bg-orange-600 hover:bg-orange-500 p-4 rounded-lg transition-colors flex flex-col items-center gap-2">
          <Settings className="w-6 h-6" />
          <span className="font-medium">Database Settings</span>
        </button>
      </div>
    </div>
  );
};
