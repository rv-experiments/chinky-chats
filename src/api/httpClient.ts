/**
 * HTTP Client
 * 
 * A wrapper around fetch API for making HTTP requests.
 */

import { API_CONFIG, HTTP_STATUS } from './config';

// Error class for API errors
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Interface for request options
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

// Default request options
const defaultOptions: RequestOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
  retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
  retryDelay: API_CONFIG.RETRY_DELAY,
};

// Function to handle request timeout
const timeoutPromise = (ms: number) => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new ApiError('Request timeout', 0));
    }, ms);
  });
};

// Function to delay execution
const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Main request function
export const request = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const mergedOptions: RequestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Prepare URL
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  // Prepare body if it's not a GET request
  if (mergedOptions.body && mergedOptions.method !== 'GET') {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }

  // Function to make the actual request
  const makeRequest = async (): Promise<T> => {
    try {
      // Create a promise that rejects after timeout
      const timeoutId = setTimeout(() => {
        throw new ApiError('Request timeout', 0);
      }, mergedOptions.timeout || API_CONFIG.TIMEOUT);

      // Make the request
      const response = await fetch(url, mergedOptions as RequestInit);
      
      // Clear timeout
      clearTimeout(timeoutId);

      // Parse response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle error responses
      if (!response.ok) {
        throw new ApiError(
          data.error?.message || 'Request failed',
          response.status,
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw new ApiError(
          (error as Error).message || 'Unknown error',
          0
        );
      }
    }
  };

  // Retry logic
  let lastError: ApiError | null = null;
  const retryAttempts = mergedOptions.retryAttempts || API_CONFIG.RETRY_ATTEMPTS;
  const retryDelay = mergedOptions.retryDelay || API_CONFIG.RETRY_DELAY;

  for (let attempt = 0; attempt <= retryAttempts; attempt++) {
    try {
      return await makeRequest();
    } catch (error) {
      lastError = error as ApiError;
      
      // Don't retry for certain status codes
      if (
        lastError.status === HTTP_STATUS.BAD_REQUEST ||
        lastError.status === HTTP_STATUS.UNAUTHORIZED ||
        lastError.status === HTTP_STATUS.FORBIDDEN ||
        lastError.status === HTTP_STATUS.NOT_FOUND
      ) {
        throw lastError;
      }

      // Last attempt, throw the error
      if (attempt === retryAttempts) {
        throw lastError;
      }

      // Wait before retrying
      await delay(retryDelay * Math.pow(2, attempt));
    }
  }

  // This should never happen, but TypeScript requires a return
  throw lastError || new ApiError('Unknown error', 0);
};

// Convenience methods
export const get = <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  return request<T>(endpoint, { ...options, method: 'GET' });
};

export const post = <T>(endpoint: string, body: any, options: RequestOptions = {}): Promise<T> => {
  return request<T>(endpoint, { ...options, method: 'POST', body });
};

export const put = <T>(endpoint: string, body: any, options: RequestOptions = {}): Promise<T> => {
  return request<T>(endpoint, { ...options, method: 'PUT', body });
};

export const del = <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  return request<T>(endpoint, { ...options, method: 'DELETE' });
};

// Token management
let authToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (auth: string, refresh: string) => {
  authToken = auth;
  refreshToken = refresh;
  localStorage.setItem('authToken', auth);
  localStorage.setItem('refreshToken', refresh);
};

export const getAuthToken = (): string | null => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};

export const getRefreshToken = (): string | null => {
  if (!refreshToken) {
    refreshToken = localStorage.getItem('refreshToken');
  }
  return refreshToken;
};

export const clearTokens = () => {
  authToken = null;
  refreshToken = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};

// Add auth header to requests
export const withAuth = (options: RequestOptions = {}): RequestOptions => {
  const token = getAuthToken();
  if (!token) {
    return options;
  }

  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };
};