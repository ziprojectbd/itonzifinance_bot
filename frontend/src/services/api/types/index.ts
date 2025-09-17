// Common API Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role?: 'user' | 'admin' | 'moderator';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'user' | 'admin' | 'moderator';
  isActive?: boolean;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdBy: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  type: 'withdrawal' | 'deposit' | 'bonus' | 'refund';
  method: 'bank' | 'crypto' | 'paypal' | 'stripe';
  reference?: string;
  description?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  userId: string;
  amount: number;
  currency: string;
  type: 'withdrawal' | 'deposit' | 'bonus' | 'refund';
  method: 'bank' | 'crypto' | 'paypal' | 'stripe';
  description?: string;
}

export interface UpdatePaymentRequest {
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference?: string;
  processedAt?: string;
}

// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalEarnings: number;
  pendingWithdrawals: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  serverUptime: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface AnalyticsData {
  userGrowth: ChartData;
  taskCompletion: ChartData;
  revenueData: ChartData;
  systemMetrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface CreateNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

// Database Types
export interface DatabaseTable {
  name: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    primaryKey: boolean;
    foreignKey?: string;
  }[];
  rowCount: number;
  size: string;
}

export interface DatabaseBackup {
  id: string;
  filename: string;
  size: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

export interface DatabaseQuery {
  id: string;
  sql: string;
  result?: any;
  executionTime: number;
  status: 'success' | 'error';
  error?: string;
  createdAt: string;
}

// System Settings Types
export interface SystemSetting {
  key: string;
  value: string;
  description: string;
  category: 'general' | 'security' | 'email' | 'payment' | 'notification';
  isEditable: boolean;
  updatedAt: string;
}

export interface UpdateSettingRequest {
  value: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: any;
}

// Search Types
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters: Record<string, any>;
} 