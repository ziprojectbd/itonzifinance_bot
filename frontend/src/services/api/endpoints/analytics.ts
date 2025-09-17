import { api } from '../config';
import { 
  DashboardStats, 
  AnalyticsData, 
  ChartData 
} from '../types';

export const analyticsApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/analytics/dashboard');
    return response.data;
  },

  // Get analytics data for charts
  getAnalyticsData: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<AnalyticsData> => {
    const response = await api.get<AnalyticsData>(`/analytics/data?period=${period}`);
    return response.data;
  },

  // Get user growth chart data
  getUserGrowth: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<ChartData> => {
    const response = await api.get<ChartData>(`/analytics/user-growth?period=${period}`);
    return response.data;
  },

  // Get task completion chart data
  getTaskCompletion: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<ChartData> => {
    const response = await api.get<ChartData>(`/analytics/task-completion?period=${period}`);
    return response.data;
  },

  // Get revenue chart data
  getRevenueData: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<ChartData> => {
    const response = await api.get<ChartData>(`/analytics/revenue?period=${period}`);
    return response.data;
  },

  // Get system metrics
  getSystemMetrics: async (): Promise<{
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    uptime: string;
    lastUpdate: string;
  }> => {
    const response = await api.get('/analytics/system-metrics');
    return response.data;
  },

  // Get real-time metrics
  getRealTimeMetrics: async (): Promise<{
    activeUsers: number;
    currentTasks: number;
    pendingPayments: number;
    systemLoad: number;
    timestamp: string;
  }> => {
    const response = await api.get('/analytics/real-time');
    return response.data;
  },

  // Get user activity analytics
  getUserActivity: async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<{
    period: string;
    data: {
      date: string;
      newUsers: number;
      activeUsers: number;
      returningUsers: number;
    }[];
  }> => {
    const response = await api.get(`/analytics/user-activity?period=${period}`);
    return response.data;
  },

  // Get task analytics
  getTaskAnalytics: async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<{
    period: string;
    data: {
      date: string;
      created: number;
      completed: number;
      cancelled: number;
      avgCompletionTime: number;
    }[];
  }> => {
    const response = await api.get(`/analytics/task-analytics?period=${period}`);
    return response.data;
  },

  // Get payment analytics
  getPaymentAnalytics: async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<{
    period: string;
    data: {
      date: string;
      totalAmount: number;
      transactionCount: number;
      avgTransactionAmount: number;
      successRate: number;
    }[];
  }> => {
    const response = await api.get(`/analytics/payment-analytics?period=${period}`);
    return response.data;
  },

  // Get geographic analytics
  getGeographicAnalytics: async (): Promise<{
    countries: {
      country: string;
      users: number;
      revenue: number;
      percentage: number;
    }[];
    totalUsers: number;
    totalRevenue: number;
  }> => {
    const response = await api.get('/analytics/geographic');
    return response.data;
  },

  // Get device analytics
  getDeviceAnalytics: async (): Promise<{
    devices: {
      device: string;
      users: number;
      percentage: number;
    }[];
    browsers: {
      browser: string;
      users: number;
      percentage: number;
    }[];
    totalUsers: number;
  }> => {
    const response = await api.get('/analytics/devices');
    return response.data;
  },

  // Get conversion funnel
  getConversionFunnel: async (): Promise<{
    stages: {
      stage: string;
      count: number;
      conversionRate: number;
    }[];
    totalConversions: number;
    overallConversionRate: number;
  }> => {
    const response = await api.get('/analytics/conversion-funnel');
    return response.data;
  },

  // Get retention analytics
  getRetentionAnalytics: async (period: '7d' | '30d' | '90d' = '30d'): Promise<{
    period: string;
    data: {
      cohort: string;
      day1: number;
      day7: number;
      day30: number;
      day90: number;
    }[];
  }> => {
    const response = await api.get(`/analytics/retention?period=${period}`);
    return response.data;
  },

  // Get performance analytics
  getPerformanceAnalytics: async (): Promise<{
    pageLoadTimes: {
      page: string;
      avgLoadTime: number;
      p95LoadTime: number;
      requests: number;
    }[];
    apiResponseTimes: {
      endpoint: string;
      avgResponseTime: number;
      p95ResponseTime: number;
      requests: number;
      errors: number;
    }[];
    errorRates: {
      type: string;
      count: number;
      percentage: number;
    }[];
  }> => {
    const response = await api.get('/analytics/performance');
    return response.data;
  },

  // Get custom analytics report
  getCustomReport: async (params: {
    metrics: string[];
    dimensions: string[];
    filters?: Record<string, any>;
    period?: string;
    limit?: number;
  }): Promise<{
    data: any[];
    total: number;
    metadata: {
      metrics: string[];
      dimensions: string[];
      period: string;
    };
  }> => {
    const response = await api.post('/analytics/custom-report', params);
    return response.data;
  },

  // Export analytics data
  exportAnalytics: async (type: string, format: 'csv' | 'excel' = 'csv', params?: any): Promise<Blob> => {
    const response = await api.get(`/analytics/export/${type}?format=${format}`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Get analytics settings
  getAnalyticsSettings: async (): Promise<{
    trackingEnabled: boolean;
    dataRetentionDays: number;
    anonymizeData: boolean;
    customDimensions: string[];
    goals: {
      id: string;
      name: string;
      type: string;
      value: number;
      isActive: boolean;
    }[];
  }> => {
    const response = await api.get('/analytics/settings');
    return response.data;
  },

  // Update analytics settings
  updateAnalyticsSettings: async (settings: {
    trackingEnabled?: boolean;
    dataRetentionDays?: number;
    anonymizeData?: boolean;
    customDimensions?: string[];
  }): Promise<void> => {
    await api.put('/analytics/settings', settings);
  },

  // Add analytics goal
  addAnalyticsGoal: async (goal: {
    name: string;
    type: string;
    value: number;
  }): Promise<{
    id: string;
    name: string;
    type: string;
    value: number;
    isActive: boolean;
  }> => {
    const response = await api.post('/analytics/goals', goal);
    return response.data;
  },

  // Update analytics goal
  updateAnalyticsGoal: async (id: string, goal: {
    name?: string;
    type?: string;
    value?: number;
    isActive?: boolean;
  }): Promise<void> => {
    await api.put(`/analytics/goals/${id}`, goal);
  },

  // Delete analytics goal
  deleteAnalyticsGoal: async (id: string): Promise<void> => {
    await api.delete(`/analytics/goals/${id}`);
  }
}; 