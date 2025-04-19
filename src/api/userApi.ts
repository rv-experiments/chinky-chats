import { apiService } from './apiClient';

// Types
export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  profilePicture?: string;
}

export interface ContactsRequest {
  contacts: string[]; // Array of phone numbers
}

export interface ContactsResponse {
  users: User[];
}

// User API service
const userApi = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    return apiService.get<User>('/users/me');
  },
  
  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<{ success: boolean; user: User }> => {
    return apiService.put<{ success: boolean; user: User }>('/users/me', data);
  },
  
  // Get user by phone number
  getUserByPhone: async (phoneNumber: string): Promise<User> => {
    return apiService.get<User>(`/users/phone/${encodeURIComponent(phoneNumber)}`);
  },
  
  // Get contacts that are registered on SoulLink
  getContacts: async (data: ContactsRequest): Promise<ContactsResponse> => {
    return apiService.post<ContactsResponse>('/users/contacts', data);
  },
};

export default userApi;