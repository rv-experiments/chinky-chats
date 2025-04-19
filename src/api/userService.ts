/**
 * User Service
 * 
 * Handles user profile management and contacts.
 */

import { ENDPOINTS } from './config';
import { get, post, put, withAuth } from './httpClient';
import { mockUserService } from './mock/mockUserService';
import { USE_MOCK_API } from './config';

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

export interface UpdateProfileResponse {
  success: boolean;
  user: User;
}

export interface ContactsRequest {
  contacts: string[]; // Array of phone numbers
}

export interface ContactsResponse {
  users: User[];
}

// Service implementation
const userService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    if (USE_MOCK_API) {
      return mockUserService.getProfile();
    }
    return get<User>(ENDPOINTS.USERS.ME, withAuth());
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    if (USE_MOCK_API) {
      return mockUserService.updateProfile(data);
    }
    return put<UpdateProfileResponse>(ENDPOINTS.USERS.ME, data, withAuth());
  },

  /**
   * Get user by phone number
   */
  getUserByPhone: async (phoneNumber: string): Promise<User> => {
    if (USE_MOCK_API) {
      return mockUserService.getUserByPhone(phoneNumber);
    }
    return get<User>(`${ENDPOINTS.USERS.BY_PHONE}/${phoneNumber}`, withAuth());
  },

  /**
   * Get contacts that are registered on SoulLink
   */
  getContacts: async (phoneNumbers: string[]): Promise<User[]> => {
    if (USE_MOCK_API) {
      return mockUserService.getContacts(phoneNumbers);
    }
    const response = await post<ContactsResponse>(
      ENDPOINTS.USERS.CONTACTS,
      { contacts: phoneNumbers },
      withAuth()
    );
    return response.users;
  },
};

export default userService;