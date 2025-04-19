import { apiService } from './apiClient';
import { User } from './userApi';

// Types
export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
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

export interface ConnectionStatusResponse {
  status: 'connected' | 'pending' | 'not_connected';
  connectionId?: string;
  requestId?: string;
}

export interface SendConnectionRequest {
  targetUserId: string;
  message?: string;
}

// Connection API service
const connectionApi = {
  // Send connection request
  sendRequest: async (data: SendConnectionRequest): Promise<{ success: boolean; connectionRequest: ConnectionRequest }> => {
    return apiService.post<{ success: boolean; connectionRequest: ConnectionRequest }>('/connections/request', data);
  },
  
  // Accept connection request
  acceptRequest: async (requestId: string): Promise<{ success: boolean; connection: Connection }> => {
    return apiService.post<{ success: boolean; connection: Connection }>(`/connections/accept/${requestId}`);
  },
  
  // Reject connection request
  rejectRequest: async (requestId: string): Promise<{ success: boolean }> => {
    return apiService.post<{ success: boolean }>(`/connections/reject/${requestId}`);
  },
  
  // Get connection status with another user
  getConnectionStatus: async (userId: string): Promise<ConnectionStatusResponse> => {
    return apiService.get<ConnectionStatusResponse>(`/connections/status/${userId}`);
  },
  
  // Get partner information
  getPartner: async (): Promise<User & { connectionId: string }> => {
    return apiService.get<User & { connectionId: string }>('/connections/partner');
  },
};

export default connectionApi;