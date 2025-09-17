export interface DatabaseStats {
  totalSize: string;
  totalTables: number;
  totalRecords: number;
  lastBackup: string;
  uptime: string;
  connections: number;
  queryPerformance: number;
  storageUsed: number;
  storageTotal: number;
}

export interface TableInfo {
  name: string;
  records: number;
  size: string;
  lastModified: string;
  status: 'healthy' | 'warning' | 'error';
}

export interface BackupInfo {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  type: 'manual' | 'automatic';
  status: 'completed' | 'in-progress' | 'failed';
}

export type TabType = 'overview' | 'tables' | 'backups' | 'queries' | 'settings';

export interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface QueryResult {
  query: string;
  executionTime: string;
  rowsAffected: number;
  success: boolean;
}
