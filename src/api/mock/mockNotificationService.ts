/**
 * Mock Notification Service
 * 
 * Provides mock implementations of notification service methods for development.
 */

import {
  RegisterDeviceRequest,
  NotificationSettings,
} from '../notificationService';

// Mock notification settings
let mockNotificationSettings: NotificationSettings = {
  messageNotifications: true,
  presenceNotifications: true,
  connectionRequestNotifications: true,
  soundEnabled: true,
  vibrationEnabled: true,
  doNotDisturb: {
    enabled: false,
  },
};

export const mockNotificationService = {
  registerDevice: async (
    data: RegisterDeviceRequest
  ): Promise<{ success: boolean }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would register the device on the server
    return {
      success: true,
    };
  },

  getNotificationSettings: async (): Promise<NotificationSettings> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { ...mockNotificationSettings };
  },

  updateNotificationSettings: async (
    settings: Partial<NotificationSettings>
  ): Promise<{ success: boolean; settings: NotificationSettings }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update mock settings
    mockNotificationSettings = {
      ...mockNotificationSettings,
      ...settings,
      doNotDisturb: {
        ...mockNotificationSettings.doNotDisturb,
        ...(settings.doNotDisturb || {}),
      },
    };
    
    return {
      success: true,
      settings: { ...mockNotificationSettings },
    };
  },
};