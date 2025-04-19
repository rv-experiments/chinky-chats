/**
 * Connection Service
 * 
 * Handles connection requests and management between users.
 */

import { ENDPOINTS } from './config';
import { get, post, withAuth } from './httpClient';
import { mockConnectionService } from './mock/mockConnectionService';
import { USE_MOCK_API } from './config';
import { User } from './userService';

// Types
export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Connection {
  id: string;
  userId1: string;
  userId2: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface SendConnectionRequest {
  targetUserId: string;
  message?: string;
}

export interface SendConnectionResponse {
  success: boolean;
  connectionRequest: ConnectionRequest;
}

export interface AcceptConnectionResponse {
  success: boolean;
  connection: Connection;
}

export interface ConnectionStatusResponse {
  status: 'connected' | 'pending' | 'not_connected';
  connectionId?: string;
  requestId?: string;
}

// Service implementation
const connectionService = {
  /**
   * Send connection request to another user
   */
  sendRequest: async (data: SendConnectionRequest): Promise<SendConnectionResponse> => {
    if (USE_MOCK_API) {
      return mockConnectionService.sendRequest(data);
    }
    return post<SendConnectionResponse>(
      ENDPOINTS.CONNECTIONS.REQUEST,
      data,
      withAuth()
    );
  },

  /**
   * Accept connection request
   */
  acceptRequest: async (requestId: string): Promise<AcceptConnectionResponse> => {
    if (USE_MOCK_API) {
      return mockConnectionService.acceptRequest(requestId);
    }
    return post<AcceptConnectionResponse>(
      `${ENDPOINTS.CONNECTIONS.ACCEPT}/${requestId}`,
      {},
      withAuth()
    );
  },

  /**
   * Reject connection request
   */
  rejectRequest: async (requestId: string): Promise<{ success: boolean }> => {
    if (USE_MOCK_API) {
      return mockConnectionService.rejectRequest(requestId);
    }
    return post<{ success: boolean }>(
      `${ENDPOINTS.CONNECTIONS.REJECT}/${requestId}`,
      {},
      withAuth()
    );
  },

  /**
   * Get connection status with another user
   */
  getConnectionStatus: async (userId: string): Promise<ConnectionStatusResponse> => {
    if (USE_MOCK_API) {
      return mockConnectionService.getConnectionStatus(userId);
    }
    return get<ConnectionStatusResponse>(
      `${ENDPOINTS.CONNECTIONS.STATUS}/${userId}`,
      withAuth()
    );
  },

  /**
   * Get partner information
   */
  getPartner: async (): Promise<User & { connectionId: string }> => {
    if (USE_MOCK_API) {
      return mockConnectionService.getPartner();
    }
    return get<User & { connectionId: string }>(
      ENDPOINTS.CONNECTIONS.PARTNER,
      withAuth()
    );
  },
};

export default connectionService;