import { api } from '../config';
import { 
  SystemSetting, 
  UpdateSettingRequest 
} from '../types';

export const settingsApi = {
  // Get all system settings
  getSettings: async (): Promise<SystemSetting[]> => {
    const response = await api.get<SystemSetting[]>('/settings');
    return response.data;
  },

  // Get settings by category
  getSettingsByCategory: async (category: string): Promise<SystemSetting[]> => {
    const response = await api.get<SystemSetting[]>(`/settings/category/${category}`);
    return response.data;
  },

  // Get setting by key
  getSettingByKey: async (key: string): Promise<SystemSetting> => {
    const response = await api.get<SystemSetting>(`/settings/${key}`);
    return response.data;
  },

  // Update setting
  updateSetting: async (key: string, value: string): Promise<SystemSetting> => {
    const response = await api.put<SystemSetting>(`/settings/${key}`, { value });
    return response.data;
  },

  // Bulk update settings
  bulkUpdateSettings: async (settings: Record<string, string>): Promise<SystemSetting[]> => {
    const response = await api.put<SystemSetting[]>('/settings/bulk', { settings });
    return response.data;
  },

  // Reset setting to default
  resetSetting: async (key: string): Promise<SystemSetting> => {
    const response = await api.post<SystemSetting>(`/settings/${key}/reset`);
    return response.data;
  },

  // Reset all settings to default
  resetAllSettings: async (): Promise<void> => {
    await api.post('/settings/reset-all');
  },

  // Get general settings
  getGeneralSettings: async (): Promise<{
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    language: string;
    maintenanceMode: boolean;
    maintenanceMessage: string;
  }> => {
    const response = await api.get('/settings/general');
    return response.data;
  },

  // Update general settings
  updateGeneralSettings: async (settings: {
    siteName?: string;
    siteDescription?: string;
    siteUrl?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: string;
    language?: string;
    maintenanceMode?: boolean;
    maintenanceMessage?: string;
  }): Promise<void> => {
    await api.put('/settings/general', settings);
  },

  // Get security settings
  getSecuritySettings: async (): Promise<{
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireLowercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSymbols: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorEnabled: boolean;
    jwtSecret: string;
    corsOrigins: string[];
  }> => {
    const response = await api.get('/settings/security');
    return response.data;
  },

  // Update security settings
  updateSecuritySettings: async (settings: {
    passwordMinLength?: number;
    passwordRequireUppercase?: boolean;
    passwordRequireLowercase?: boolean;
    passwordRequireNumbers?: boolean;
    passwordRequireSymbols?: boolean;
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
    twoFactorEnabled?: boolean;
    corsOrigins?: string[];
  }): Promise<void> => {
    await api.put('/settings/security', settings);
  },

  // Get email settings
  getEmailSettings: async (): Promise<{
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpEncryption: 'none' | 'ssl' | 'tls';
    fromEmail: string;
    fromName: string;
    replyToEmail: string;
    emailVerificationRequired: boolean;
    welcomeEmailEnabled: boolean;
  }> => {
    const response = await api.get('/settings/email');
    return response.data;
  },

  // Update email settings
  updateEmailSettings: async (settings: {
    smtpHost?: string;
    smtpPort?: number;
    smtpUsername?: string;
    smtpPassword?: string;
    smtpEncryption?: 'none' | 'ssl' | 'tls';
    fromEmail?: string;
    fromName?: string;
    replyToEmail?: string;
    emailVerificationRequired?: boolean;
    welcomeEmailEnabled?: boolean;
  }): Promise<void> => {
    await api.put('/settings/email', settings);
  },

  // Test email configuration
  testEmailSettings: async (testEmail: string): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await api.post('/settings/email/test', { testEmail });
    return response.data;
  },

  // Get file upload settings
  getFileUploadSettings: async (): Promise<{
    maxFileSize: number;
    allowedExtensions: string[];
    storageProvider: 'local' | 's3' | 'gcs' | 'azure';
    s3Bucket?: string;
    s3Region?: string;
    s3AccessKey?: string;
    s3SecretKey?: string;
    gcsBucket?: string;
    gcsCredentials?: string;
    azureContainer?: string;
    azureConnectionString?: string;
  }> => {
    const response = await api.get('/settings/file-upload');
    return response.data;
  },

  // Update file upload settings
  updateFileUploadSettings: async (settings: {
    maxFileSize?: number;
    allowedExtensions?: string[];
    storageProvider?: 'local' | 's3' | 'gcs' | 'azure';
    s3Bucket?: string;
    s3Region?: string;
    s3AccessKey?: string;
    s3SecretKey?: string;
    gcsBucket?: string;
    gcsCredentials?: string;
    azureContainer?: string;
    azureConnectionString?: string;
  }): Promise<void> => {
    await api.put('/settings/file-upload', settings);
  },

  // Test file upload configuration
  testFileUploadSettings: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await api.post('/settings/file-upload/test');
    return response.data;
  },

  // Get notification settings
  getNotificationSettings: async (): Promise<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    inAppNotifications: boolean;
    notificationTypes: {
      userRegistration: boolean;
      passwordReset: boolean;
      taskAssignment: boolean;
      paymentProcessed: boolean;
      systemAlert: boolean;
    };
  }> => {
    const response = await api.get('/settings/notifications');
    return response.data;
  },

  // Update notification settings
  updateNotificationSettings: async (settings: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    inAppNotifications?: boolean;
    notificationTypes?: {
      userRegistration?: boolean;
      passwordReset?: boolean;
      taskAssignment?: boolean;
      paymentProcessed?: boolean;
      systemAlert?: boolean;
    };
  }): Promise<void> => {
    await api.put('/settings/notifications', settings);
  },

  // Get API settings
  getApiSettings: async (): Promise<{
    apiEnabled: boolean;
    rateLimitEnabled: boolean;
    rateLimitRequests: number;
    rateLimitWindow: number;
    apiKeyRequired: boolean;
    corsEnabled: boolean;
    corsOrigins: string[];
    webhookUrl?: string;
    webhookSecret?: string;
  }> => {
    const response = await api.get('/settings/api');
    return response.data;
  },

  // Update API settings
  updateApiSettings: async (settings: {
    apiEnabled?: boolean;
    rateLimitEnabled?: boolean;
    rateLimitRequests?: number;
    rateLimitWindow?: number;
    apiKeyRequired?: boolean;
    corsEnabled?: boolean;
    corsOrigins?: string[];
    webhookUrl?: string;
    webhookSecret?: string;
  }): Promise<void> => {
    await api.put('/settings/api', settings);
  },

  // Generate new API key
  generateApiKey: async (): Promise<{
    apiKey: string;
    expiresAt: string;
  }> => {
    const response = await api.post('/settings/api/generate-key');
    return response.data;
  },

  // Get backup settings
  getBackupSettings: async (): Promise<{
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupTime: string;
    retentionDays: number;
    includeFiles: boolean;
    includeDatabase: boolean;
    storageLocation: 'local' | 's3' | 'gcs';
    s3Bucket?: string;
    gcsBucket?: string;
  }> => {
    const response = await api.get('/settings/backup');
    return response.data;
  },

  // Update backup settings
  updateBackupSettings: async (settings: {
    autoBackup?: boolean;
    backupFrequency?: 'daily' | 'weekly' | 'monthly';
    backupTime?: string;
    retentionDays?: number;
    includeFiles?: boolean;
    includeDatabase?: boolean;
    storageLocation?: 'local' | 's3' | 'gcs';
    s3Bucket?: string;
    gcsBucket?: string;
  }): Promise<void> => {
    await api.put('/settings/backup', settings);
  },

  // Export settings
  exportSettings: async (format: 'json' | 'yaml' = 'json'): Promise<Blob> => {
    const response = await api.get(`/settings/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Import settings
  importSettings: async (file: File, options?: {
    overwrite?: boolean;
    validateOnly?: boolean;
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
    
    const response = await api.post('/settings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get settings audit log
  getSettingsAuditLog: async (params?: {
    page?: number;
    limit?: number;
    settingKey?: string;
    action?: 'create' | 'update' | 'delete';
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    data: {
      id: string;
      settingKey: string;
      action: string;
      oldValue?: string;
      newValue?: string;
      userId: string;
      userEmail: string;
      timestamp: string;
      ipAddress: string;
    }[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await api.get('/settings/audit-log', { params });
    return response.data;
  },

  // Clear settings audit log
  clearSettingsAuditLog: async (): Promise<void> => {
    await api.delete('/settings/audit-log');
  }
}; 