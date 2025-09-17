// Main API service exports
export { api, apiClient } from './config';
export type { ApiResponse } from './config';

// Export all API services
export { authApi } from './endpoints/auth';
export { usersApi } from './endpoints/users';
export { tasksApi } from './endpoints/tasks';
export { paymentsApi } from './endpoints/payments';
export { analyticsApi } from './endpoints/analytics';
export { notificationsApi } from './endpoints/notifications';
export { databaseApi } from './endpoints/database';
export { settingsApi } from './endpoints/settings';

// Export all types
export * from './types';

// API service utilities
export const apiUtils = {
  // Format API error message
  formatErrorMessage: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Check if error is network error
  isNetworkError: (error: any): boolean => {
    return !error.response && error.request;
  },

  // Check if error is server error (5xx)
  isServerError: (error: any): boolean => {
    return error.response?.status >= 500;
  },

  // Check if error is client error (4xx)
  isClientError: (error: any): boolean => {
    return error.response?.status >= 400 && error.response?.status < 500;
  },

  // Check if error is authentication error (401)
  isAuthError: (error: any): boolean => {
    return error.response?.status === 401;
  },

  // Check if error is authorization error (403)
  isForbiddenError: (error: any): boolean => {
    return error.response?.status === 403;
  },

  // Check if error is not found error (404)
  isNotFoundError: (error: any): boolean => {
    return error.response?.status === 404;
  },

  // Retry API call with exponential backoff
  retryApiCall: async <T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (apiUtils.isClientError(error)) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  },

  // Debounce API calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle API calls
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Cache API responses
  createApiCache = () => {
    const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
    
    return {
      get: (key: string) => {
        const item = cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > item.ttl) {
          cache.delete(key);
          return null;
        }
        
        return item.data;
      },
      
      set: (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
        cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl
        });
      },
      
      delete: (key: string) => {
        cache.delete(key);
      },
      
      clear: () => {
        cache.clear();
      },
      
      has: (key: string) => {
        return cache.has(key);
      }
    };
  },

  // Generate cache key from parameters
  generateCacheKey: (baseKey: string, params?: any): string => {
    if (!params) return baseKey;
    const paramString = JSON.stringify(params);
    return `${baseKey}:${paramString}`;
  },

  // Handle file upload with progress
  uploadFileWithProgress: async (
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    additionalData?: Record<string, any>
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      
      formData.append('file', file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      xhr.open('POST', url);
      
      // Add authorization header if token exists
      const token = localStorage.getItem('authToken');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  }
};

// Default export for convenience
export default {
  auth: authApi,
  users: usersApi,
  tasks: tasksApi,
  payments: paymentsApi,
  analytics: analyticsApi,
  notifications: notificationsApi,
  database: databaseApi,
  settings: settingsApi,
  utils: apiUtils
}; 