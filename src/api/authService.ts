/**
 * Authentication Service
 * 
 * Handles user authentication, registration, and token management.
 */

import { ENDPOINTS } from './config';
import { get, post, setTokens, clearTokens, withAuth } from './httpClient';
import { mockAuthService } from './mock/mockAuthService';
import { USE_MOCK_API } from './config';

// Types
export interface RegisterRequest {
  phoneNumber: string;
  name: string;
  deviceId: string;
}

export interface RegisterResponse {
  success: boolean;
  userId: string;
  verificationSent: boolean;
}

export interface VerifyRequest {
  phoneNumber: string;
  verificationCode: string;
}

export interface LoginRequest {
  phoneNumber: string;
  deviceId: string;
}

export interface LoginResponse {
  success: boolean;
  verificationSent: boolean;
}

export interface VerifyResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    phoneNumber: string;
    profilePicture?: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  refreshToken: string;
}

// Service implementation
const authService = {
  /**
   * Register a new user with phone number
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    if (USE_MOCK_API) {
      return mockAuthService.register(data);
    }
    return post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * Verify phone number with code
   */
  verify: async (data: VerifyRequest): Promise<VerifyResponse> => {
    if (USE_MOCK_API) {
      return mockAuthService.verify(data);
    }
    const response = await post<VerifyResponse>(ENDPOINTS.AUTH.VERIFY, data);
    
    // Save tokens
    if (response.success) {
      setTokens(response.token, response.refreshToken);
    }
    
    return response;
  },

  /**
   * Login with phone number
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK_API) {
      return mockAuthService.login(data);
    }
    return post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, data);
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    if (USE_MOCK_API) {
      return mockAuthService.refreshToken(refreshToken);
    }
    const response = await post<RefreshTokenResponse>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    
    // Save new tokens
    if (response.success) {
      setTokens(response.token, response.refreshToken);
    }
    
    return response;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<{ success: boolean }> => {
    if (USE_MOCK_API) {
      return mockAuthService.logout();
    }
    const response = await post<{ success: boolean }>(
      ENDPOINTS.AUTH.LOGOUT,
      {},
      withAuth()
    );
    
    // Clear tokens
    if (response.success) {
      clearTokens();
    }
    
    return response;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (USE_MOCK_API) {
      return mockAuthService.isAuthenticated();
    }
    const token = localStorage.getItem('authToken');
    return !!token;
  },
};

export default authService;