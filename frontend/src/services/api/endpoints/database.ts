import { api } from '../config';
import { 
  DatabaseTable, 
  DatabaseBackup, 
  DatabaseQuery, 
  PaginationParams, 
  PaginatedResponse 
} from '../types';

export const databaseApi = {
  // Get all database tables
  getTables: async (): Promise<DatabaseTable[]> => {
    const response = await api.get<DatabaseTable[]>('/database/tables');
    return response.data;
  },

  // Get table structure
  getTableStructure: async (tableName: string): Promise<DatabaseTable> => {
    const response = await api.get<DatabaseTable>(`/database/tables/${tableName}`);
    return response.data;
  },

  // Get table data
  getTableData: async (tableName: string, params?: PaginationParams & {
    filters?: Record<string, any>;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: any[];
    total: number;
    columns: string[];
  }> => {
    const response = await api.get(`/database/tables/${tableName}/data`, { params });
    return response.data;
  },

  // Execute custom query
  executeQuery: async (sql: string): Promise<{
    id: string;
    sql: string;
    result: any;
    executionTime: number;
    status: 'success' | 'error';
    error?: string;
    rowCount: number;
    columns: string[];
  }> => {
    const response = await api.post('/database/query', { sql });
    return response.data;
  },

  // Get query history
  getQueryHistory: async (params?: PaginationParams): Promise<PaginatedResponse<DatabaseQuery>> => {
    const response = await api.get<PaginatedResponse<DatabaseQuery>>('/database/queries', { params });
    return response.data;
  },

  // Get query by ID
  getQueryById: async (id: string): Promise<DatabaseQuery> => {
    const response = await api.get<DatabaseQuery>(`/database/queries/${id}`);
    return response.data;
  },

  // Delete query from history
  deleteQuery: async (id: string): Promise<void> => {
    await api.delete(`/database/queries/${id}`);
  },

  // Clear query history
  clearQueryHistory: async (): Promise<void> => {
    await api.delete('/database/queries');
  },

  // Get database statistics
  getDatabaseStats: async (): Promise<{
    totalTables: number;
    totalRows: number;
    totalSize: string;
    lastBackup: string;
    connectionStatus: 'connected' | 'disconnected' | 'error';
    performance: {
      avgQueryTime: number;
      slowQueries: number;
      activeConnections: number;
    };
  }> => {
    const response = await api.get('/database/stats');
    return response.data;
  },

  // Create database backup
  createBackup: async (options?: {
    includeData?: boolean;
    includeStructure?: boolean;
    compression?: boolean;
    description?: string;
  }): Promise<DatabaseBackup> => {
    const response = await api.post('/database/backups', options);
    return response.data;
  },

  // Get all backups
  getBackups: async (params?: PaginationParams): Promise<PaginatedResponse<DatabaseBackup>> => {
    const response = await api.get<PaginatedResponse<DatabaseBackup>>('/database/backups', { params });
    return response.data;
  },

  // Get backup by ID
  getBackupById: async (id: string): Promise<DatabaseBackup> => {
    const response = await api.get<DatabaseBackup>(`/database/backups/${id}`);
    return response.data;
  },

  // Delete backup
  deleteBackup: async (id: string): Promise<void> => {
    await api.delete(`/database/backups/${id}`);
  },

  // Download backup
  downloadBackup: async (id: string): Promise<Blob> => {
    const response = await api.get(`/database/backups/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Restore from backup
  restoreBackup: async (id: string, options?: {
    dropExisting?: boolean;
    createNew?: boolean;
  }): Promise<{
    success: boolean;
    message: string;
    restoredTables: string[];
  }> => {
    const response = await api.post(`/database/backups/${id}/restore`, options);
    return response.data;
  },

  // Get backup settings
  getBackupSettings: async (): Promise<{
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionDays: number;
    backupTime: string;
    includeData: boolean;
    includeStructure: boolean;
    compression: boolean;
    storageLocation: string;
  }> => {
    const response = await api.get('/database/backup-settings');
    return response.data;
  },

  // Update backup settings
  updateBackupSettings: async (settings: {
    autoBackup?: boolean;
    backupFrequency?: 'daily' | 'weekly' | 'monthly';
    retentionDays?: number;
    backupTime?: string;
    includeData?: boolean;
    includeStructure?: boolean;
    compression?: boolean;
    storageLocation?: string;
  }): Promise<void> => {
    await api.put('/database/backup-settings', settings);
  },

  // Get database connections
  getConnections: async (): Promise<{
    id: string;
    name: string;
    host: string;
    port: number;
    database: string;
    username: string;
    isActive: boolean;
    lastUsed: string;
  }[]> => {
    const response = await api.get('/database/connections');
    return response.data;
  },

  // Add database connection
  addConnection: async (connectionData: {
    name: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  }): Promise<{
    id: string;
    name: string;
    host: string;
    port: number;
    database: string;
    username: string;
    isActive: boolean;
    lastUsed: string;
  }> => {
    const response = await api.post('/database/connections', connectionData);
    return response.data;
  },

  // Update database connection
  updateConnection: async (id: string, connectionData: {
    name?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
  }): Promise<void> => {
    await api.put(`/database/connections/${id}`, connectionData);
  },

  // Delete database connection
  deleteConnection: async (id: string): Promise<void> => {
    await api.delete(`/database/connections/${id}`);
  },

  // Test database connection
  testConnection: async (connectionData: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  }): Promise<{
    success: boolean;
    message: string;
    version?: string;
    tables?: string[];
  }> => {
    const response = await api.post('/database/test-connection', connectionData);
    return response.data;
  },

  // Switch database connection
  switchConnection: async (id: string): Promise<void> => {
    await api.post(`/database/connections/${id}/switch`);
  },

  // Get database logs
  getDatabaseLogs: async (params?: PaginationParams): Promise<PaginatedResponse<{
    id: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
    details?: any;
  }>> => {
    const response = await api.get('/database/logs', { params });
    return response.data;
  },

  // Clear database logs
  clearDatabaseLogs: async (): Promise<void> => {
    await api.delete('/database/logs');
  },

  // Get database performance metrics
  getPerformanceMetrics: async (period: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<{
    period: string;
    metrics: {
      timestamp: string;
      queryCount: number;
      avgResponseTime: number;
      slowQueries: number;
      errors: number;
      activeConnections: number;
    }[];
  }> => {
    const response = await api.get(`/database/performance?period=${period}`);
    return response.data;
  },

  // Optimize database
  optimizeDatabase: async (): Promise<{
    success: boolean;
    message: string;
    optimizedTables: string[];
    freedSpace: string;
  }> => {
    const response = await api.post('/database/optimize');
    return response.data;
  },

  // Get database size information
  getDatabaseSize: async (): Promise<{
    totalSize: string;
    dataSize: string;
    indexSize: string;
    tables: {
      name: string;
      size: string;
      rows: number;
    }[];
  }> => {
    const response = await api.get('/database/size');
    return response.data;
  },

  // Export table data
  exportTableData: async (tableName: string, format: 'csv' | 'excel' | 'json' = 'csv', filters?: any): Promise<Blob> => {
    const response = await api.get(`/database/tables/${tableName}/export?format=${format}`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },

  // Import table data
  importTableData: async (tableName: string, file: File, options?: {
    replace?: boolean;
    skipErrors?: boolean;
  }): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    
    const response = await api.post(`/database/tables/${tableName}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get saved queries
  getSavedQueries: async (): Promise<{
    id: string;
    name: string;
    sql: string;
    description?: string;
    category?: string;
    isPublic: boolean;
    createdBy: string;
    createdAt: string;
  }[]> => {
    const response = await api.get('/database/saved-queries');
    return response.data;
  },

  // Save query
  saveQuery: async (queryData: {
    name: string;
    sql: string;
    description?: string;
    category?: string;
    isPublic?: boolean;
  }): Promise<{
    id: string;
    name: string;
    sql: string;
    description?: string;
    category?: string;
    isPublic: boolean;
    createdBy: string;
    createdAt: string;
  }> => {
    const response = await api.post('/database/saved-queries', queryData);
    return response.data;
  },

  // Update saved query
  updateSavedQuery: async (id: string, queryData: {
    name?: string;
    sql?: string;
    description?: string;
    category?: string;
    isPublic?: boolean;
  }): Promise<void> => {
    await api.put(`/database/saved-queries/${id}`, queryData);
  },

  // Delete saved query
  deleteSavedQuery: async (id: string): Promise<void> => {
    await api.delete(`/database/saved-queries/${id}`);
  }
}; 