import { api } from '../config';
import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  PaginationParams, 
  PaginatedResponse 
} from '../types';

export const tasksApi = {
  // Get all tasks with pagination
  getTasks: async (params?: PaginationParams): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>('/tasks', { params });
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, taskData: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Bulk delete tasks
  bulkDeleteTasks: async (ids: string[]): Promise<void> => {
    await api.post('/tasks/bulk-delete', { ids });
  },

  // Change task status
  changeTaskStatus: async (id: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled'): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // Assign task to user
  assignTask: async (id: string, userId: string): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/assign`, { userId });
    return response.data;
  },

  // Get tasks by status
  getTasksByStatus: async (status: string, params?: PaginationParams): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>(`/tasks/status/${status}`, { params });
    return response.data;
  },

  // Get tasks by user
  getTasksByUser: async (userId: string, params?: PaginationParams): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>(`/tasks/user/${userId}`, { params });
    return response.data;
  },

  // Get tasks by priority
  getTasksByPriority: async (priority: string, params?: PaginationParams): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>(`/tasks/priority/${priority}`, { params });
    return response.data;
  },

  // Search tasks
  searchTasks: async (query: string, params?: PaginationParams): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>('/tasks/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  },

  // Get task statistics
  getTaskStats: async (): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
  }> => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },

  // Export tasks
  exportTasks: async (format: 'csv' | 'excel' = 'csv', filters?: any): Promise<Blob> => {
    const response = await api.get(`/tasks/export?format=${format}`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },

  // Import tasks
  importTasks: async (file: File): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/tasks/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Duplicate task
  duplicateTask: async (id: string): Promise<Task> => {
    const response = await api.post<Task>(`/tasks/${id}/duplicate`);
    return response.data;
  },

  // Add comment to task
  addTaskComment: async (id: string, comment: string): Promise<{
    id: string;
    taskId: string;
    comment: string;
    createdBy: string;
    createdAt: string;
  }> => {
    const response = await api.post(`/tasks/${id}/comments`, { comment });
    return response.data;
  },

  // Get task comments
  getTaskComments: async (id: string, params?: PaginationParams): Promise<PaginatedResponse<{
    id: string;
    taskId: string;
    comment: string;
    createdBy: string;
    createdAt: string;
  }>> => {
    const response = await api.get(`/tasks/${id}/comments`, { params });
    return response.data;
  },

  // Add attachment to task
  addTaskAttachment: async (id: string, file: File): Promise<{
    id: string;
    taskId: string;
    filename: string;
    size: number;
    url: string;
    uploadedBy: string;
    createdAt: string;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/tasks/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get task attachments
  getTaskAttachments: async (id: string): Promise<{
    id: string;
    taskId: string;
    filename: string;
    size: number;
    url: string;
    uploadedBy: string;
    createdAt: string;
  }[]> => {
    const response = await api.get(`/tasks/${id}/attachments`);
    return response.data;
  },

  // Delete task attachment
  deleteTaskAttachment: async (taskId: string, attachmentId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
  },

  // Get overdue tasks
  getOverdueTasks: async (params?: PaginationParams): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>('/tasks/overdue', { params });
    return response.data;
  },

  // Get tasks due today
  getTasksDueToday: async (params?: PaginationParams): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>('/tasks/due-today', { params });
    return response.data;
  },

  // Get tasks due this week
  getTasksDueThisWeek: async (params?: PaginationParams): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>('/tasks/due-this-week', { params });
    return response.data;
  },

  // Bulk update task status
  bulkUpdateTaskStatus: async (ids: string[], status: string): Promise<void> => {
    await api.patch('/tasks/bulk-status', { ids, status });
  },

  // Bulk assign tasks
  bulkAssignTasks: async (ids: string[], userId: string): Promise<void> => {
    await api.patch('/tasks/bulk-assign', { ids, userId });
  }
}; 