/**
 * Mock User Service
 * 
 * Provides mock implementations of user service methods for development.
 */

import { User, UpdateProfileRequest, UpdateProfileResponse } from '../userService';

// Mock user data
const mockUser: User = {
  id: 'user-123',
  name: 'John Doe',
  phoneNumber: '+1234567890',
  profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
  status: 'online',
  lastSeen: new Date().toISOString(),
};

// Mock contacts
const mockContacts: User[] = [
  {
    id: 'user-456',
    name: 'Jane Smith',
    phoneNumber: '+0987654321',
    profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'user-789',
    name: 'Alex Johnson',
    phoneNumber: '+1122334455',
    profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    status: 'away',
    lastSeen: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
  },
];

export const mockUserService = {
  getProfile: async (): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { ...mockUser };
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update mock user
    const updatedUser = {
      ...mockUser,
      ...(data.name && { name: data.name }),
      ...(data.profilePicture && { profilePicture: data.profilePicture }),
    };
    
    return {
      success: true,
      user: updatedUser,
    };
  },

  getUserByPhone: async (phoneNumber: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user by phone number
    const user = mockContacts.find(u => u.phoneNumber === phoneNumber);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return { ...user };
  },

  getContacts: async (phoneNumbers: string[]): Promise<User[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter contacts by phone numbers
    const contacts = mockContacts.filter(user => 
      phoneNumbers.includes(user.phoneNumber)
    );
    
    return [...contacts];
  },
};