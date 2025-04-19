import { apiService } from './apiClient';

// Types
export interface RegisterRequest {
  phoneNumber: string;
  name: string;
  deviceId: string;
}

export interface VerifyRequest {
  phoneNumber: string;
  verificationCode: string;
}

export interface LoginRequest {
  phoneNumber: string;
  deviceId: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  userId?: string;
  verificationSent?: boolean;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    name: string;
    phoneNumber: string;
    profilePicture?: string;
  };
}

// Auth API service
const authApi = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/register', data);
  },
  
  // Verify phone number with code
  verify: async (data: VerifyRequest): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>('/auth/verify', data);
    
    // If successful, store tokens
    if (response.success && response.token && response.refreshToken) {
      await apiService.setAuthTokens(response.token, response.refreshToken);
    }
    
    return response;
  },
  
  // Login with phone number
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/login', data);
  },
  
  // Refresh authentication token
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>('/auth/refresh', data);
    
    // If successful, store new tokens
    if (response.success && response.token && response.refreshToken) {
      await apiService.setAuthTokens(response.token, response.refreshToken);
    }
    
    return response;
  },
  
  // Logout user
  logout: async (): Promise<{ success: boolean }> => {
    const response = await apiService.post<{ success: boolean }>('/auth/logout');
    
    // Clear tokens regardless of response
    await apiService.clearAuthTokens();
    
    return response;
  },
  
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    return apiService.isAuthenticated();
  },
};

export default authApi;