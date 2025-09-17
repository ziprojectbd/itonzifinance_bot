import React, { useState } from 'react';
import { Tab, DatabaseStats, TableInfo, BackupInfo, TabType, QueryResult } from './database/types';
import { TabNavigation } from './database/TabNavigation';
import { OverviewTab } from './database/tabs/OverviewTab';
import { TablesTab } from './database/tabs/TablesTab';
import { BackupsTab } from './database/tabs/BackupsTab';
import { QueriesTab } from './database/tabs/QueriesTab';
import { SettingsTab } from './database/tabs/SettingsTab';
import { Database, Table,   Terminal, Settings, DatabaseBackup } from 'lucide-react';

// Mock data - replace with actual API calls
const mockDatabaseStats: DatabaseStats = {
  totalSize: '2.5 GB',
  totalTables: 24,
  totalRecords: 12453,
  lastBackup: '2 hours ago',
  uptime: '15 days',
  connections: 8,
  queryPerformance: 98.7,
  storageUsed: 65,
  storageTotal: 100,
};

const mockTables: TableInfo[] = [
  { name: 'users', records: 1245, size: '245 MB', lastModified: '2 hours ago', status: 'healthy' },
  { name: 'orders', records: 8567, size: '1.2 GB', lastModified: '30 minutes ago', status: 'warning' },
  { name: 'products', records: 1542, size: '456 MB', lastModified: '5 hours ago', status: 'healthy' },
];

const mockBackups: BackupInfo[] = [
  { id: '1', name: 'backup_20230612', size: '1.8 GB', createdAt: '2 hours ago', type: 'automatic', status: 'completed' },
  { id: '2', name: 'backup_20230611', size: '1.7 GB', createdAt: '1 day ago', type: 'automatic', status: 'completed' },
  { id: '3', name: 'manual_backup_20230610', size: '1.6 GB', createdAt: '2 days ago', type: 'manual', status: 'completed' },
];

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Database },
  { id: 'tables', label: 'Tables', icon: Table },
  { id: 'backups', label: 'Backups', icon:   DatabaseBackup   },
  { id: 'queries', label: 'Queries', icon: Terminal },
  { id: 'settings', label: 'Settings', icon: Settings },
];

  const DatabaseManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

  const executeQuery = async (query: string) => {
    try {
      // TODO: Implement actual query execution logic here
      // For now, we'll simulate a successful query execution
      const result: QueryResult = {
        query,
        executionTime: '0.05s',
        rowsAffected: 1,
        success: true
      };
      setQueryResult(result);
    } catch (error) {
      console.error('Error executing query:', error);
      const result: QueryResult = {
        query,
        executionTime: '0s',
        rowsAffected: 0,
        success: false
      };
      setQueryResult(result);
    }
  };

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      // TODO: Implement actual backup logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate backup
      // Add success notification or state update here
    } catch (error) {
      console.error('Backup failed:', error);
      // Add error handling here
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    try {
      setIsBackingUp(true);
      // TODO: Implement actual restore logic here using backupId
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate restore
      // Add success notification or state update here
      console.log('Restore successful' , backupId);
    } catch (error) {
      console.error('Restore failed:', error);
      // Add error handling here
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
  };

  const handleTableSelect = (table: TableInfo | null) => {
    setSelectedTable(table);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab 
          stats={mockDatabaseStats} 
          onBackup={handleBackup} 
          isBackingUp={isBackingUp} 
        />;
      case 'tables':
        return (
          <TablesTab
            tables={mockTables}
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
            searchQuery={searchQuery}
          />
        );
      case 'backups':
        return (
          <BackupsTab 
            backups={mockBackups}
            stats={{ lastBackup: mockDatabaseStats.lastBackup }}
            onBackup={handleBackup}
            onRestore={handleRestore}
            isBackingUp={isBackingUp}
          />
        );
      case 'queries':
        return (
          <QueriesTab
            onExecute={executeQuery}
            queryResult={queryResult}
          />
        );
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Database Management</h1>
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tables..."
              className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
      <div className="flex-1 overflow-auto p-6 pt-0">
        {renderActiveTab()}
      </div>
    </div>
  );
};


export default DatabaseManager;