/**
 * Presence Service
 * 
 * Handles user online presence and status.
 */

import { ENDPOINTS } from './config';
import { get, post, withAuth } from './httpClient';
import { mockPresenceService } from './mock/mockPresenceService';
import { USE_MOCK_API } from './config';

// Types
export interface PresenceStatus {
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface UpdatePresenceRequest {
  status: 'online' | 'offline' | 'away';
}

// Service implementation
const presenceService = {
  /**
   * Update user presence status
   */
  updatePresence: async (
    status: 'online' | 'offline' | 'away'
  ): Promise<{ success: boolean }> => {
    if (USE_MOCK_API) {
      return mockPresenceService.updatePresence(status);
    }
    return post<{ success: boolean }>(
      ENDPOINTS.PRESENCE.BASE,
      { status },
      withAuth()
    );
  },

  /**
   * Get partner's presence status
   */
  getPartnerPresence: async (): Promise<PresenceStatus> => {
    if (USE_MOCK_API) {
      return mockPresenceService.getPartnerPresence();
    }
    return get<PresenceStatus>(ENDPOINTS.PRESENCE.PARTNER, withAuth());
  },
};

export default presenceService;