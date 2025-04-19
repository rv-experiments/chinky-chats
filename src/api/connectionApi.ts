import apiClient from './apiClient';

// Types
export interface Connection {
  connectionId: string;
  partnerId: string;
  partnerName: string;
  partnerPhoneNumber: string;
  partnerProfilePicture?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionRequest {
  phoneNumber: string;
  message?: string;
}

export interface ConnectionResponse {
  success: boolean;
  connection?: Connection;
  message?: string;
}

export interface ConnectionRequestsResponse {
  success: boolean;
  requests: {
    id: string;
    senderId: string;
    senderName: string;
    senderPhoneNumber: string;
    senderProfilePicture?: string;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
  }[];
  message?: string;
}

// Connection API service
export const connectionApi = {
  // Get partner connection
  async getPartner(): Promise<Connection> {
    return apiClient.get<Connection>('/connection/partner');
  },

  // Send connection request
  async sendConnectionRequest(data: ConnectionRequest): Promise<ConnectionResponse> {
    return apiClient.post<ConnectionResponse>('/connection/request', data);
  },

  // Get connection requests
  async getConnectionRequests(): Promise<ConnectionRequestsResponse> {
    return apiClient.get<ConnectionRequestsResponse>('/connection/requests');
  },

  // Accept connection request
  async acceptConnectionRequest(requestId: string): Promise<ConnectionResponse> {
    return apiClient.post<ConnectionResponse>(`/connection/request/${requestId}/accept`);
  },

  // Reject connection request
  async rejectConnectionRequest(requestId: string): Promise<{ success: boolean; message?: string }> {
    return apiClient.post<{ success: boolean; message?: string }>(`/connection/request/${requestId}/reject`);
  },

  // Remove connection
  async removeConnection(connectionId: string): Promise<{ success: boolean; message?: string }> {
    return apiClient.delete<{ success: boolean; message?: string }>(`/connection/${connectionId}`);
  }
};

export default connectionApi;