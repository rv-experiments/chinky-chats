import apiClient from './apiClient';

// Types
export interface UserProfile {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
  status?: string;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  status?: string;
  profilePicture?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user?: UserProfile;
  message?: string;
}

// User API service
export const userApi = {
  // Get user profile
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/user/profile');
  },

  // Update user profile
  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    return apiClient.put<UpdateProfileResponse>('/user/profile', data);
  },

  // Upload profile picture
  async uploadProfilePicture(file: FormData): Promise<{ success: boolean; url?: string; message?: string }> {
    return apiClient.post<{ success: boolean; url?: string; message?: string }>(
      '/user/profile/picture',
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Delete account
  async deleteAccount(): Promise<{ success: boolean; message?: string }> {
    return apiClient.delete<{ success: boolean; message?: string }>('/user/account');
  }
};

export default userApi;