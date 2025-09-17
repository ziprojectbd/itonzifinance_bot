import { api } from '../config';
import { 
  Payment, 
  CreatePaymentRequest, 
  UpdatePaymentRequest, 
  PaginationParams, 
  PaginatedResponse 
} from '../types';

export const paymentsApi = {
  // Get all payments with pagination
  getPayments: async (params?: PaginationParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>('/payments', { params });
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (id: string): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  // Create new payment
  createPayment: async (paymentData: CreatePaymentRequest): Promise<Payment> => {
    const response = await api.post<Payment>('/payments', paymentData);
    return response.data;
  },

  // Update payment
  updatePayment: async (id: string, paymentData: UpdatePaymentRequest): Promise<Payment> => {
    const response = await api.put<Payment>(`/payments/${id}`, paymentData);
    return response.data;
  },

  // Delete payment
  deletePayment: async (id: string): Promise<void> => {
    await api.delete(`/payments/${id}`);
  },

  // Bulk delete payments
  bulkDeletePayments: async (ids: string[]): Promise<void> => {
    await api.post('/payments/bulk-delete', { ids });
  },

  // Change payment status
  changePaymentStatus: async (id: string, status: 'pending' | 'completed' | 'failed' | 'cancelled'): Promise<Payment> => {
    const response = await api.patch<Payment>(`/payments/${id}/status`, { status });
    return response.data;
  },

  // Process payment
  processPayment: async (id: string): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/${id}/process`);
    return response.data;
  },

  // Cancel payment
  cancelPayment: async (id: string, reason?: string): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/${id}/cancel`, { reason });
    return response.data;
  },

  // Refund payment
  refundPayment: async (id: string, amount?: number, reason?: string): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/${id}/refund`, { amount, reason });
    return response.data;
  },

  // Get payments by status
  getPaymentsByStatus: async (status: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>(`/payments/status/${status}`, { params });
    return response.data;
  },

  // Get payments by user
  getPaymentsByUser: async (userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>(`/payments/user/${userId}`, { params });
    return response.data;
  },

  // Get payments by type
  getPaymentsByType: async (type: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>(`/payments/type/${type}`, { params });
    return response.data;
  },

  // Get payments by method
  getPaymentsByMethod: async (method: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>(`/payments/method/${method}`, { params });
    return response.data;
  },

  // Search payments
  searchPayments: async (query: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>('/payments/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  },

  // Get payment statistics
  getPaymentStats: async (): Promise<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    cancelled: number;
    totalAmount: number;
    pendingAmount: number;
    completedAmount: number;
    byType: Record<string, number>;
    byMethod: Record<string, number>;
    byStatus: Record<string, number>;
  }> => {
    const response = await api.get('/payments/stats');
    return response.data;
  },

  // Export payments
  exportPayments: async (format: 'csv' | 'excel' = 'csv', filters?: any): Promise<Blob> => {
    const response = await api.get(`/payments/export?format=${format}`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },

  // Import payments
  importPayments: async (file: File): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/payments/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async (): Promise<{
    id: string;
    name: string;
    type: 'bank' | 'crypto' | 'paypal' | 'stripe';
    isActive: boolean;
    config: any;
  }[]> => {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  // Add payment method
  addPaymentMethod: async (methodData: {
    name: string;
    type: 'bank' | 'crypto' | 'paypal' | 'stripe';
    config: any;
  }): Promise<{
    id: string;
    name: string;
    type: string;
    isActive: boolean;
    config: any;
  }> => {
    const response = await api.post('/payments/methods', methodData);
    return response.data;
  },

  // Update payment method
  updatePaymentMethod: async (id: string, methodData: {
    name?: string;
    isActive?: boolean;
    config?: any;
  }): Promise<{
    id: string;
    name: string;
    type: string;
    isActive: boolean;
    config: any;
  }> => {
    const response = await api.put(`/payments/methods/${id}`, methodData);
    return response.data;
  },

  // Delete payment method
  deletePaymentMethod: async (id: string): Promise<void> => {
    await api.delete(`/payments/methods/${id}`);
  },

  // Get payment settings
  getPaymentSettings: async (): Promise<{
    currency: string;
    minWithdrawal: number;
    maxWithdrawal: number;
    withdrawalFee: number;
    processingTime: number;
    autoApprove: boolean;
  }> => {
    const response = await api.get('/payments/settings');
    return response.data;
  },

  // Update payment settings
  updatePaymentSettings: async (settings: {
    currency?: string;
    minWithdrawal?: number;
    maxWithdrawal?: number;
    withdrawalFee?: number;
    processingTime?: number;
    autoApprove?: boolean;
  }): Promise<void> => {
    await api.put('/payments/settings', settings);
  },

  // Get pending withdrawals
  getPendingWithdrawals: async (params?: PaginationParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>('/payments/pending-withdrawals', { params });
    return response.data;
  },

  // Approve withdrawal
  approveWithdrawal: async (id: string): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/${id}/approve`);
    return response.data;
  },

  // Reject withdrawal
  rejectWithdrawal: async (id: string, reason: string): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/${id}/reject`, { reason });
    return response.data;
  },

  // Bulk approve withdrawals
  bulkApproveWithdrawals: async (ids: string[]): Promise<void> => {
    await api.post('/payments/bulk-approve', { ids });
  },

  // Bulk reject withdrawals
  bulkRejectWithdrawals: async (ids: string[], reason: string): Promise<void> => {
    await api.post('/payments/bulk-reject', { ids, reason });
  },

  // Get payment history
  getPaymentHistory: async (userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>(`/payments/history/${userId}`, { params });
    return response.data;
  },

  // Get payment analytics
  getPaymentAnalytics: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<{
    period: string;
    data: {
      date: string;
      amount: number;
      count: number;
    }[];
  }> => {
    const response = await api.get(`/payments/analytics?period=${period}`);
    return response.data;
  }
}; 