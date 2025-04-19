import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

// Token storage keys
const ACCESS_TOKEN_KEY = 'soullink_access_token';
const REFRESH_TOKEN_KEY = 'soullink_refresh_token';

// API client class
class ApiClient {
  private axiosInstance: AxiosInstance;
  private refreshTokenPromise: Promise<string | null> | null = null;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // If error is 401 and we haven't already tried to refresh the token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const newToken = await this.refreshToken();
            
            if (newToken) {
              // Update the authorization header
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              } else {
                originalRequest.headers = { Authorization: `Bearer ${newToken}` };
              }
              
              // Retry the original request
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, clear tokens and reject
            await this.clearTokens();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Get access token from storage
  private async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // Get refresh token from storage
  private async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  // Save tokens to storage
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, refreshToken],
      ]);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  // Clear tokens from storage
  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Refresh the access token
  private async refreshToken(): Promise<string | null> {
    // If there's already a refresh in progress, return that promise
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    // Create a new refresh token promise
    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = await this.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Save the new tokens
        await this.saveTokens(accessToken, newRefreshToken);
        
        return accessToken;
      } catch (error) {
        console.error('Error refreshing token:', error);
        await this.clearTokens();
        return null;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        // Handle specific error cases
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('API error response:', {
            status: axiosError.response.status,
            data: axiosError.response.data,
            headers: axiosError.response.headers,
          });
          
          throw new Error(`API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error('API no response:', axiosError.request);
          throw new Error('No response from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('API request setup error:', axiosError.message);
          throw new Error(`Request setup error: ${axiosError.message}`);
        }
      } else {
        // Handle non-Axios errors
        console.error('Non-Axios error:', error);
        throw error;
      }
    }
  }

  // Convenience methods for different HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;