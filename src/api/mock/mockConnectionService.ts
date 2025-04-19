/**
 * Mock Connection Service
 * 
 * Provides mock implementations of connection service methods for development.
 */

import {
  ConnectionRequest,
  Connection,
  SendConnectionRequest,
  SendConnectionResponse,
  AcceptConnectionResponse,
  ConnectionStatusResponse,
} from '../connectionService';
import { User } from '../userService';

// Mock partner data
const mockPartner: User & { connectionId: string } = {
  id: 'user-456',
  name: 'Jane Smith',
  phoneNumber: '+0987654321',
  profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
  status: 'online',
  lastSeen: new Date().toISOString(),
  connectionId: 'connection-123',
};

// Mock connection request
const mockConnectionRequest: ConnectionRequest = {
  id: 'request-123',
  fromUserId: 'user-123',
  toUserId: 'user-456',
  status: 'pending',
  createdAt: new Date().toISOString(),
};

// Mock connection
const mockConnection: Connection = {
  id: 'connection-123',
  userId1: 'user-123',
  userId2: 'user-456',
  status: 'active',
  createdAt: new Date().toISOString(),
};

export const mockConnectionService = {
  sendRequest: async (data: SendConnectionRequest): Promise<SendConnectionResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      connectionRequest: {
        ...mockConnectionRequest,
        toUserId: data.targetUserId,
      },
    };
  },

  acceptRequest: async (requestId: string): Promise<AcceptConnectionResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      connection: mockConnection,
    };
  },

  rejectRequest: async (requestId: string): Promise<{ success: boolean }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
    };
  },

  getConnectionStatus: async (userId: string): Promise<ConnectionStatusResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, return different statuses based on userId
    if (userId === 'user-456') {
      return {
        status: 'connected',
        connectionId: 'connection-123',
      };
    } else if (userId === 'user-789') {
      return {
        status: 'pending',
        requestId: 'request-123',
      };
    } else {
      return {
        status: 'not_connected',
      };
    }
  },

  getPartner: async (): Promise<User & { connectionId: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { ...mockPartner };
  },
};