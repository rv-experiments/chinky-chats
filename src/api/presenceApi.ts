import { apiService } from './apiClient';

// Types
export interface UpdatePresenceRequest {
  status: 'online' | 'offline' | 'away';
}

export interface PartnerPresenceResponse {
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
}

// Presence API service
const presenceApi = {
  // Update user presence
  updatePresence: async (data: UpdatePresenceRequest): Promise<{ success: boolean }> => {
    return apiService.post<{ success: boolean }>('/presence', data);
  },
  
  // Get partner presence
  getPartnerPresence: async (): Promise<PartnerPresenceResponse> => {
    return apiService.get<PartnerPresenceResponse>('/presence/partner');
  },
};

export default presenceApi;