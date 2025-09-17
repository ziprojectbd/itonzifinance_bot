import { api } from '../config';
import { 
  Notification, 
  CreateNotificationRequest, 
  PaginationParams, 
  PaginatedResponse 
} from '../types';

export const notificationsApi = {
  // Get all notifications with pagination
  getNotifications: async (params?: PaginationParams): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get<PaginatedResponse<Notification>>('/notifications', { params });
    return response.data;
  },

  // Get notification by ID
  getNotificationById: async (id: string): Promise<Notification> => {
    const response = await api.get<Notification>(`/notifications/${id}`);
    return response.data;
  },

  // Create new notification
  createNotification: async (notificationData: CreateNotificationRequest): Promise<Notification> => {
    const response = await api.post<Notification>('/notifications', notificationData);
    return response.data;
  },

  // Update notification
  updateNotification: async (id: string, notificationData: Partial<Notification>): Promise<Notification> => {
    const response = await api.put<Notification>(`/notifications/${id}`, notificationData);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  // Bulk delete notifications
  bulkDeleteNotifications: async (ids: string[]): Promise<void> => {
    await api.post('/notifications/bulk-delete', { ids });
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark notification as unread
  markAsUnread: async (id: string): Promise<Notification> => {
    const response = await api.patch<Notification>(`/notifications/${id}/unread`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (userId?: string): Promise<void> => {
    const params = userId ? { userId } : {};
    await api.post('/notifications/mark-all-read', params);
  },

  // Get notifications by user
  getNotificationsByUser: async (userId: string, params?: PaginationParams): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get<PaginatedResponse<Notification>>(`/notifications/user/${userId}`, { params });
    return response.data;
  },

  // Get notifications by type
  getNotificationsByType: async (type: string, params?: PaginationParams): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get<PaginatedResponse<Notification>>(`/notifications/type/${type}`, { params });
    return response.data;
  },

  // Get unread notifications
  getUnreadNotifications: async (userId?: string, params?: PaginationParams): Promise<PaginatedResponse<Notification>> => {
    const queryParams = userId ? { ...params, userId } : params;
    const response = await api.get<PaginatedResponse<Notification>>('/notifications/unread', { params: queryParams });
    return response.data;
  },

  // Get read notifications
  getReadNotifications: async (userId?: string, params?: PaginationParams): Promise<PaginatedResponse<Notification>> => {
    const queryParams = userId ? { ...params, userId } : params;
    const response = await api.get<PaginatedResponse<Notification>>('/notifications/read', { params: queryParams });
    return response.data;
  },

  // Search notifications
  searchNotifications: async (query: string, params?: PaginationParams): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get<PaginatedResponse<Notification>>('/notifications/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  },

  // Get notification statistics
  getNotificationStats: async (): Promise<{
    total: number;
    unread: number;
    read: number;
    byType: Record<string, number>;
    byUser: Record<string, number>;
  }> => {
    const response = await api.get('/notifications/stats');
    return response.data;
  },

  // Send bulk notifications
  sendBulkNotifications: async (notificationData: {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    userIds?: string[];
    userGroups?: string[];
    allUsers?: boolean;
  }): Promise<{
    sent: number;
    failed: number;
    errors: string[];
  }> => {
    const response = await api.post('/notifications/bulk-send', notificationData);
    return response.data;
  },

  // Get notification templates
  getNotificationTemplates: async (): Promise<{
    id: string;
    name: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    variables: string[];
    isActive: boolean;
  }[]> => {
    const response = await api.get('/notifications/templates');
    return response.data;
  },

  // Create notification template
  createNotificationTemplate: async (templateData: {
    name: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    variables: string[];
  }): Promise<{
    id: string;
    name: string;
    title: string;
    message: string;
    type: string;
    variables: string[];
    isActive: boolean;
  }> => {
    const response = await api.post('/notifications/templates', templateData);
    return response.data;
  },

  // Update notification template
  updateNotificationTemplate: async (id: string, templateData: {
    name?: string;
    title?: string;
    message?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    variables?: string[];
    isActive?: boolean;
  }): Promise<void> => {
    await api.put(`/notifications/templates/${id}`, templateData);
  },

  // Delete notification template
  deleteNotificationTemplate: async (id: string): Promise<void> => {
    await api.delete(`/notifications/templates/${id}`);
  },

  // Send notification using template
  sendNotificationWithTemplate: async (templateId: string, data: {
    userIds?: string[];
    userGroups?: string[];
    allUsers?: boolean;
    variables: Record<string, string>;
  }): Promise<{
    sent: number;
    failed: number;
    errors: string[];
  }> => {
    const response = await api.post(`/notifications/templates/${templateId}/send`, data);
    return response.data;
  },

  // Get notification settings
  getNotificationSettings: async (): Promise<{
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
    inAppEnabled: boolean;
    defaultSettings: {
      email: boolean;
      push: boolean;
      sms: boolean;
      inApp: boolean;
    };
    userSettings: Record<string, {
      email: boolean;
      push: boolean;
      sms: boolean;
      inApp: boolean;
    }>;
  }> => {
    const response = await api.get('/notifications/settings');
    return response.data;
  },

  // Update notification settings
  updateNotificationSettings: async (settings: {
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    smsEnabled?: boolean;
    inAppEnabled?: boolean;
    defaultSettings?: {
      email: boolean;
      push: boolean;
      sms: boolean;
      inApp: boolean;
    };
  }): Promise<void> => {
    await api.put('/notifications/settings', settings);
  },

  // Update user notification preferences
  updateUserNotificationPreferences: async (userId: string, preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  }): Promise<void> => {
    await api.put(`/notifications/user/${userId}/preferences`, preferences);
  },

  // Get notification channels
  getNotificationChannels: async (): Promise<{
    id: string;
    name: string;
    type: 'email' | 'push' | 'sms' | 'webhook';
    isActive: boolean;
    config: any;
  }[]> => {
    const response = await api.get('/notifications/channels');
    return response.data;
  },

  // Add notification channel
  addNotificationChannel: async (channelData: {
    name: string;
    type: 'email' | 'push' | 'sms' | 'webhook';
    config: any;
  }): Promise<{
    id: string;
    name: string;
    type: string;
    isActive: boolean;
    config: any;
  }> => {
    const response = await api.post('/notifications/channels', channelData);
    return response.data;
  },

  // Update notification channel
  updateNotificationChannel: async (id: string, channelData: {
    name?: string;
    isActive?: boolean;
    config?: any;
  }): Promise<void> => {
    await api.put(`/notifications/channels/${id}`, channelData);
  },

  // Delete notification channel
  deleteNotificationChannel: async (id: string): Promise<void> => {
    await api.delete(`/notifications/channels/${id}`);
  },

  // Test notification channel
  testNotificationChannel: async (id: string, testData: any): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await api.post(`/notifications/channels/${id}/test`, testData);
    return response.data;
  },

  // Get notification logs
  getNotificationLogs: async (params?: PaginationParams): Promise<PaginatedResponse<{
    id: string;
    notificationId: string;
    channel: string;
    recipient: string;
    status: 'sent' | 'failed' | 'pending';
    sentAt?: string;
    error?: string;
  }>> => {
    const response = await api.get('/notifications/logs', { params });
    return response.data;
  },

  // Export notifications
  exportNotifications: async (format: 'csv' | 'excel' = 'csv', filters?: any): Promise<Blob> => {
    const response = await api.get(`/notifications/export?format=${format}`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
}; 