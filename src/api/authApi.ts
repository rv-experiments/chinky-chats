import apiClient from './apiClient';

// Types
export interface LoginRequest {
  phoneNumber: string;
  deviceId: string;
}

export interface LoginResponse {
  success: boolean;
  verificationSent: boolean;
  userId?: string;
  message?: string;
}

export interface VerifyCodeRequest {
  phoneNumber: string;
  code: string;
  deviceId: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

// Auth API service
export const authApi = {
  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    return apiClient.isAuthenticated();
  },

  // Login with phone number
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },

  // Verify SMS code
  async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const response = await apiClient.post<VerifyCodeResponse>('/auth/verify', data);
    
    // If successful, save tokens
    if (response.success && response.accessToken && response.refreshToken) {
      await apiClient.saveTokens(response.accessToken, response.refreshToken);
    }
    
    return response;
  },

  // Refresh token
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
    
    // If successful, save tokens
    if (response.success && response.accessToken && response.refreshToken) {
      await apiClient.saveTokens(response.accessToken, response.refreshToken);
    }
    
    return response;
  },

  // Logout
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await apiClient.post<LogoutResponse>('/auth/logout');
      
      // Clear tokens regardless of response
      await apiClient.clearTokens();
      
      return response;
    } catch (error) {
      // Clear tokens even if API call fails
      await apiClient.clearTokens();
      
      throw error;
    }
  }
};

export default authApi;