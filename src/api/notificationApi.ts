import { apiService } from './apiClient';

// Types
export interface RegisterDeviceRequest {
  deviceToken: string;
  platform: 'android' | 'ios';
}

export interface NotificationSettings {
  partnerOnline: boolean;
  messages: boolean;
  connectionRequests: boolean;
  dailyReminders: boolean;
}

// Notification API service
const notificationApi = {
  // Register device for push notifications
  registerDevice: async (data: RegisterDeviceRequest): Promise<{ success: boolean; deviceId: string }> => {
    return apiService.post<{ success: boolean; deviceId: string }>('/notifications/devices', data);
  },
  
  // Update notification settings
  updateSettings: async (settings: NotificationSettings): Promise<{ success: boolean; settings: NotificationSettings }> => {
    return apiService.put<{ success: boolean; settings: NotificationSettings }>('/notifications/settings', settings);
  },
  
  // Get notification settings
  getSettings: async (): Promise<{ settings: NotificationSettings }> => {
    return apiService.get<{ settings: NotificationSettings }>('/notifications/settings');
  },
};

export default notificationApi;