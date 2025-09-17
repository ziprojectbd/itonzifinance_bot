import { api } from '../config';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  PaginationParams, 
  PaginatedResponse 
} from '../types';

export const usersApi = {
  // Get all users with pagination
  getUsers: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Bulk delete users
  bulkDeleteUsers: async (ids: string[]): Promise<void> => {
    await api.post('/users/bulk-delete', { ids });
  },

  // Activate/deactivate user
  toggleUserStatus: async (id: string, isActive: boolean): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/status`, { isActive });
    return response.data;
  },

  // Change user role
  changeUserRole: async (id: string, role: 'user' | 'admin' | 'moderator'): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/role`, { role });
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role: string, params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>(`/users/role/${role}`, { params });
    return response.data;
  },

  // Search users
  searchUsers: async (query: string, params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  },

  // Get user statistics
  getUserStats: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
  }> => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Export users
  exportUsers: async (format: 'csv' | 'excel' = 'csv'): Promise<Blob> => {
    const response = await api.get(`/users/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Import users
  importUsers: async (file: File): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Send welcome email to user
  sendWelcomeEmail: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/welcome-email`);
  },

  // Reset user password (admin action)
  resetUserPassword: async (id: string): Promise<{ temporaryPassword: string }> => {
    const response = await api.post<{ temporaryPassword: string }>(`/users/${id}/reset-password`);
    return response.data;
  },

  // Get user activity log
  getUserActivity: async (id: string, params?: PaginationParams): Promise<PaginatedResponse<{
    id: string;
    action: string;
    details: any;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
  }>> => {
    const response = await api.get(`/users/${id}/activity`, { params });
    return response.data;
  },

  // Get online users
  getOnlineUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users/online');
    return response.data;
  },

  // Force logout user
  forceLogoutUser: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/force-logout`);
  }
}; 