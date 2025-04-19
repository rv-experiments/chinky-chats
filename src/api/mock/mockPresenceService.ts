/**
 * Mock Presence Service
 * 
 * Provides mock implementations of presence service methods for development.
 */

import { PresenceStatus } from '../presenceService';

// Mock partner presence
let mockPartnerPresence: PresenceStatus = {
  status: 'online',
  lastSeen: new Date().toISOString(),
};

export const mockPresenceService = {
  updatePresence: async (
    status: 'online' | 'offline' | 'away'
  ): Promise<{ success: boolean }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would update the status on the server
    return {
      success: true,
    };
  },

  getPartnerPresence: async (): Promise<PresenceStatus> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Randomly change status sometimes for demo purposes
    if (Math.random() > 0.7) {
      const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
      mockPartnerPresence = {
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastSeen: new Date().toISOString(),
      };
    }
    
    return { ...mockPartnerPresence };
  },
};