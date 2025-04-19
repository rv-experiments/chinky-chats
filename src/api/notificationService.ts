/**
 * Notification Service
 * 
 * Handles push notifications and device registration.
 */

import { ENDPOINTS } from './config';
import { get, post, put, withAuth } from './httpClient';
import { mockNotificationService } from './mock/mockNotificationService';
import { USE_MOCK_API } from './config';

// Types
export interface RegisterDeviceRequest {
  deviceId: string;
  deviceToken: string;
  platform: 'ios' | 'android' | 'web';
}

export interface NotificationSettings {
  messageNotifications: boolean;
  presenceNotifications: boolean;
  connectionRequestNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  doNotDisturb: {
    enabled: boolean;
    startTime?: string; // HH:MM format
    endTime?: string; // HH:MM format
  };
}

// Service implementation
const notificationService = {
  /**
   * Register device for push notifications
   */
  registerDevice: async (data: RegisterDeviceRequest): Promise<{ success: boolean }> => {
    if (USE_MOCK_API) {
      return mockNotificationService.registerDevice(data);
    }
    return post<{ success: boolean }>(
      ENDPOINTS.NOTIFICATIONS.DEVICES,
      data,
      withAuth()
    );
  },

  /**
   * Get notification settings
   */
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    if (USE_MOCK_API) {
      return mockNotificationService.getNotificationSettings();
    }
    return get<NotificationSettings>(
      ENDPOINTS.NOTIFICATIONS.SETTINGS,
      withAuth()
    );
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (
    settings: Partial<NotificationSettings>
  ): Promise<{ success: boolean; settings: NotificationSettings }> => {
    if (USE_MOCK_API) {
      return mockNotificationService.updateNotificationSettings(settings);
    }
    return put<{ success: boolean; settings: NotificationSettings }>(
      ENDPOINTS.NOTIFICATIONS.SETTINGS,
      settings,
      withAuth()
    );
  },
};

export default notificationService;