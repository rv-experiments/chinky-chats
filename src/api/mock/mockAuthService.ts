/**
 * Mock Authentication Service
 * 
 * Provides mock implementations of auth service methods for development.
 */

import {
  RegisterRequest,
  RegisterResponse,
  VerifyRequest,
  VerifyResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '../authService';

// Mock user data
const mockUser = {
  id: 'user-123',
  name: 'John Doe',
  phoneNumber: '+1234567890',
  profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
};

// Mock tokens
const mockTokens = {
  token: 'mock-jwt-token',
  refreshToken: 'mock-refresh-token',
};

// Local storage mock for tokens
let storedToken: string | null = null;
let storedRefreshToken: string | null = null;

export const mockAuthService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      userId: 'user-123',
      verificationSent: true,
    };
  },

  verify: async (data: VerifyRequest): Promise<VerifyResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Store tokens in mock storage
    storedToken = mockTokens.token;
    storedRefreshToken = mockTokens.refreshToken;
    
    return {
      success: true,
      token: mockTokens.token,
      refreshToken: mockTokens.refreshToken,
      user: mockUser,
    };
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      verificationSent: true,
    };
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update stored tokens
    storedToken = `${mockTokens.token}-refreshed`;
    storedRefreshToken = `${mockTokens.refreshToken}-refreshed`;
    
    return {
      success: true,
      token: storedToken,
      refreshToken: storedRefreshToken,
    };
  },

  logout: async (): Promise<{ success: boolean }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear stored tokens
    storedToken = null;
    storedRefreshToken = null;
    
    return {
      success: true,
    };
  },

  isAuthenticated: (): boolean => {
    return !!storedToken;
  },
};