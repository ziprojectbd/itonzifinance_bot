import { useState, useEffect, useCallback, useRef } from 'react';
import { apiUtils } from '../index';

interface UseApiOptions<T> {
  immediate?: boolean;
  cache?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
  retries?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  dependencies?: any[];
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiState<T> {
  const {
    immediate = true,
    cache = false,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    retries = 0,
    onSuccess,
    onError,
    dependencies = []
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    refetch: async () => {}
  });

  const cacheRef = useRef<ReturnType<typeof apiUtils.createApiCache> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize cache if needed
  useEffect(() => {
    if (cache && !cacheRef.current) {
      cacheRef.current = apiUtils.createApiCache();
    }
  }, [cache]);

  const executeApiCall = useCallback(async (): Promise<void> => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check cache first
      if (cache && cacheRef.current && cacheKey) {
        const cachedData = cacheRef.current.get(cacheKey);
        if (cachedData) {
          setState(prev => ({ ...prev, data: cachedData, loading: false }));
          onSuccess?.(cachedData);
          return;
        }
      }

      // Execute API call with retries if configured
      let data: T;
      if (retries > 0) {
        data = await apiUtils.retryApiCall(apiCall, retries);
      } else {
        data = await apiCall();
      }

      // Cache the result if enabled
      if (cache && cacheRef.current && cacheKey) {
        cacheRef.current.set(cacheKey, data, cacheTTL);
      }

      setState(prev => ({ ...prev, data, loading: false }));
      onSuccess?.(data);
    } catch (error) {
      // Don't set error if request was aborted
      if (error.name === 'AbortError') {
        return;
      }

      setState(prev => ({ ...prev, error, loading: false }));
      onError?.(error);
    }
  }, [apiCall, cache, cacheKey, cacheTTL, retries, onSuccess, onError]);

  // Create refetch function
  const refetch = useCallback(async (): Promise<void> => {
    // Clear cache if refetching
    if (cache && cacheRef.current && cacheKey) {
      cacheRef.current.delete(cacheKey);
    }
    await executeApiCall();
  }, [executeApiCall, cache, cacheKey]);

  // Execute API call on mount and when dependencies change
  useEffect(() => {
    if (immediate) {
      executeApiCall();
    }
  }, [immediate, executeApiCall, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refetch
  };
}

// Hook for mutations (POST, PUT, DELETE)
interface UseMutationOptions<T, R> {
  onSuccess?: (data: R, variables: T) => void;
  onError?: (error: any, variables: T) => void;
  onSettled?: (data: R | null, error: any, variables: T) => void;
}

interface UseMutationState<R> {
  data: R | null;
  loading: boolean;
  error: any;
  mutate: (variables: any) => Promise<R | null>;
  reset: () => void;
}

export function useMutation<T, R>(
  mutationFn: (variables: T) => Promise<R>,
  options: UseMutationOptions<T, R> = {}
): UseMutationState<R> {
  const { onSuccess, onError, onSettled } = options;

  const [state, setState] = useState<UseMutationState<R>>({
    data: null,
    loading: false,
    error: null,
    mutate: async () => null,
    reset: () => {}
  });

  const mutate = useCallback(async (variables: T): Promise<R | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await mutationFn(variables);
      setState(prev => ({ ...prev, data, loading: false }));
      onSuccess?.(data, variables);
      onSettled?.(data, null, variables);
      return data;
    } catch (error) {
      setState(prev => ({ ...prev, error, loading: false }));
      onError?.(error, variables);
      onSettled?.(null, error, variables);
      return null;
    }
  }, [mutationFn, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      mutate: async () => null,
      reset: () => {}
    });
  }, []);

  return {
    ...state,
    mutate,
    reset
  };
}

// Hook for infinite queries (pagination)
interface UseInfiniteQueryOptions<T> {
  getNextPageParam?: (lastPage: T, allPages: T[]) => any;
  getPreviousPageParam?: (firstPage: T, allPages: T[]) => any;
  onSuccess?: (data: T[]) => void;
  onError?: (error: any) => void;
}

interface UseInfiniteQueryState<T> {
  data: T[];
  loading: boolean;
  error: any;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => Promise<void>;
  fetchPreviousPage: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useInfiniteQuery<T>(
  queryFn: (pageParam: any) => Promise<T>,
  options: UseInfiniteQueryOptions<T> = {}
): UseInfiniteQueryState<T> {
  const { getNextPageParam, getPreviousPageParam, onSuccess, onError } = options;

  const [state, setState] = useState<UseInfiniteQueryState<T>>({
    data: [],
    loading: false,
    error: null,
    hasNextPage: false,
    hasPreviousPage: false,
    fetchNextPage: async () => {},
    fetchPreviousPage: async () => {},
    refetch: async () => {}
  });

  const pageParamsRef = useRef<any[]>([]);

  const fetchPage = useCallback(async (pageParam: any, isNext: boolean = true): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const pageData = await queryFn(pageParam);
      
      setState(prev => {
        const newData = isNext 
          ? [...prev.data, pageData]
          : [pageData, ...prev.data];

        const hasNextPage = getNextPageParam ? getNextPageParam(pageData, newData) !== undefined : false;
        const hasPreviousPage = getPreviousPageParam ? getPreviousPageParam(pageData, newData) !== undefined : false;

        return {
          ...prev,
          data: newData,
          loading: false,
          hasNextPage,
          hasPreviousPage
        };
      });

      onSuccess?.(state.data);
    } catch (error) {
      setState(prev => ({ ...prev, error, loading: false }));
      onError?.(error);
    }
  }, [queryFn, getNextPageParam, getPreviousPageParam, onSuccess, onError, state.data]);

  const fetchNextPage = useCallback(async (): Promise<void> => {
    if (state.hasNextPage && !state.loading) {
      const lastPage = state.data[state.data.length - 1];
      const nextPageParam = getNextPageParam?.(lastPage, state.data);
      if (nextPageParam !== undefined) {
        pageParamsRef.current.push(nextPageParam);
        await fetchPage(nextPageParam, true);
      }
    }
  }, [state.hasNextPage, state.loading, state.data, getNextPageParam, fetchPage]);

  const fetchPreviousPage = useCallback(async (): Promise<void> => {
    if (state.hasPreviousPage && !state.loading) {
      const firstPage = state.data[0];
      const previousPageParam = getPreviousPageParam?.(firstPage, state.data);
      if (previousPageParam !== undefined) {
        pageParamsRef.current.unshift(previousPageParam);
        await fetchPage(previousPageParam, false);
      }
    }
  }, [state.hasPreviousPage, state.loading, state.data, getPreviousPageParam, fetchPage]);

  const refetch = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, data: [], hasNextPage: false, hasPreviousPage: false }));
    pageParamsRef.current = [];
    await fetchPage(undefined, true);
  }, [fetchPage]);

  return {
    ...state,
    fetchNextPage,
    fetchPreviousPage,
    refetch
  };
} 