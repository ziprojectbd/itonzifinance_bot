import React from 'react';
import { BackupInfo, DatabaseStats } from '../types';
import { Shield, RefreshCw } from 'lucide-react';

interface BackupsTabProps {
  backups: BackupInfo[];
  stats: Pick<DatabaseStats, 'lastBackup'>;
  onBackup: () => void;
  onRestore: (id: string) => void;
  isBackingUp: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-400 bg-green-400/20';
    case 'in-progress': return 'text-yellow-400 bg-yellow-400/20';
    case 'failed': return 'text-red-400 bg-red-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const BackupsTab: React.FC<BackupsTabProps> = ({
  backups,
  stats,
  onBackup,
  onRestore,
  isBackingUp,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Database Backups</h3>
        <button
          onClick={onBackup}
          disabled={isBackingUp}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          {isBackingUp ? 'Creating Backup...' : 'Create Backup'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{backups.filter(b => b.status === 'completed').length}</div>
          <div className="text-gray-400 text-sm">Completed Backups</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{formatDate(stats.lastBackup)}</div>
          <div className="text-gray-400 text-sm">Last Backup</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">7.2 GB</div>
          <div className="text-gray-400 text-sm">Total Backup Size</div>
        </div>
      </div>

      <div className="space-y-3 overflow-x-auto flex-nowrap">
        {backups.map((backup) => (
          <div key={backup.id} className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between min-w-max">
            <div className="flex items-center gap-4">
              <div className="text-2xl">
                {backup.type === 'automatic' ? '🤖' : '👤'}
              </div>
              <div>
                <div className="text-white font-medium break-words whitespace-normal">{backup.name}</div>
                <div className="text-gray-400 text-sm break-words whitespace-normal">
                  {backup.size} • {formatDate(backup.createdAt)} • {backup.type}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  getStatusColor(backup.status)
                }`}
              >
                {backup.status}
              </span>
              <button
                onClick={() => onRestore(backup.id)}
                className="bg-orange-600 hover:bg-orange-500 px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Restore
              </button>
              <button className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm font-medium transition-colors">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
