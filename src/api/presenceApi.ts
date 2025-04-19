import apiClient from './apiClient';

// Types
export interface PresenceStatus {
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface UpdatePresenceResponse {
  success: boolean;
  message?: string;
}

export interface GetPartnerPresenceResponse {
  success: boolean;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  message?: string;
}

// Presence API service
export const presenceApi = {
  // Update user presence status
  async updatePresence(status: 'online' | 'offline' | 'away'): Promise<UpdatePresenceResponse> {
    return apiClient.post<UpdatePresenceResponse>('/presence', { status });
  },

  // Get partner presence status
  async getPartnerPresence(partnerId: string): Promise<GetPartnerPresenceResponse> {
    return apiClient.get<GetPartnerPresenceResponse>(`/presence/${partnerId}`);
  }
};

export default presenceApi;