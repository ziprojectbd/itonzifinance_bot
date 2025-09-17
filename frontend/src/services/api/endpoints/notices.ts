import { apiClient } from '../config';
import { PaginationParams, PaginatedResponse } from '../types';

export interface Notice {
  id: string;
  title: string;
  message: string;
  recipients: string[] | 'all'; // Array of user IDs or 'all'
  status: 'draft' | 'sent' | 'delivered' | 'failed';
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledAt?: string;
  sentAt?: string;
  deliveredCount: number;
  readCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticeRequest {
  title: string;
  message: string;
  recipients: string[] | 'all';
  type?: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  scheduledAt?: string;
}

export interface UpdateNoticeRequest {
  title?: string;
  message?: string;
  recipients?: string[] | 'all';
  type?: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  scheduledAt?: string;
}

export interface NoticeFilters {
  status?: 'draft' | 'sent' | 'delivered' | 'failed';
  type?: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  recipient?: string; // User ID to filter by
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
}

export interface NoticeStats {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface NoticeDeliveryStatus {
  noticeId: string;
  userId: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  errorMessage?: string;
}

// Get all notices with pagination and filters
export const getNotices = async (
  params?: PaginationParams & NoticeFilters
): Promise<PaginatedResponse<Notice>> => {
  const response = await apiClient.get('/notices', { params });
  return response.data;
};

// Get a single notice by ID
export const getNotice = async (id: string): Promise<Notice> => {
  const response = await apiClient.get(`/notices/${id}`);
  return response.data;
};

// Create a new notice
export const createNotice = async (data: CreateNoticeRequest): Promise<Notice> => {
  const response = await apiClient.post('/notices', data);
  return response.data;
};

// Update an existing notice
export const updateNotice = async (id: string, data: UpdateNoticeRequest): Promise<Notice> => {
  const response = await apiClient.put(`/notices/${id}`, data);
  return response.data;
};

// Delete a notice
export const deleteNotice = async (id: string): Promise<void> => {
  await apiClient.delete(`/notices/${id}`);
};

// Send a notice immediately
export const sendNotice = async (id: string): Promise<Notice> => {
  const response = await apiClient.post(`/notices/${id}/send`);
  return response.data;
};

// Schedule a notice for later
export const scheduleNotice = async (id: string, scheduledAt: string): Promise<Notice> => {
  const response = await apiClient.post(`/notices/${id}/schedule`, { scheduledAt });
  return response.data;
};

// Cancel a scheduled notice
export const cancelScheduledNotice = async (id: string): Promise<Notice> => {
  const response = await apiClient.post(`/notices/${id}/cancel`);
  return response.data;
};

// Get notice statistics
export const getNoticeStats = async (filters?: NoticeFilters): Promise<NoticeStats> => {
  const response = await apiClient.get('/notices/stats', { params: filters });
  return response.data;
};

// Get delivery status for a specific notice
export const getNoticeDeliveryStatus = async (id: string): Promise<NoticeDeliveryStatus[]> => {
  const response = await apiClient.get(`/notices/${id}/delivery-status`);
  return response.data;
};

// Bulk send notices to multiple users
export const bulkSendNotices = async (data: {
  title: string;
  message: string;
  userIds: string[];
  type?: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}): Promise<Notice[]> => {
  const response = await apiClient.post('/notices/bulk-send', data);
  return response.data;
};

// Send notice to users by criteria
export const sendNoticeByCriteria = async (data: {
  title: string;
  message: string;
  criteria: {
    status?: 'active' | 'banned';
    minPoints?: number;
    maxPoints?: number;
    kycStatus?: 'pending' | 'verified' | 'rejected';
    countries?: string[];
    joinedAfter?: string;
    joinedBefore?: string;
  };
  type?: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}): Promise<Notice> => {
  const response = await apiClient.post('/notices/send-by-criteria', data);
  return response.data;
};

// Get notice templates
export const getNoticeTemplates = async (): Promise<{
  id: string;
  name: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}[]> => {
  const response = await apiClient.get('/notices/templates');
  return response.data;
};

// Create notice from template
export const createNoticeFromTemplate = async (templateId: string, data: {
  recipients: string[] | 'all';
  scheduledAt?: string;
  customFields?: Record<string, string>;
}): Promise<Notice> => {
  const response = await apiClient.post(`/notices/templates/${templateId}/create`, data);
  return response.data;
};

// Export notices to CSV
export const exportNotices = async (filters?: NoticeFilters): Promise<Blob> => {
  const response = await apiClient.get('/notices/export', {
    params: filters,
    responseType: 'blob'
  });
  return response.data;
};

// Import notices from CSV
export const importNotices = async (file: File): Promise<{
  imported: number;
  failed: number;
  errors: string[];
}> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/notices/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}; 