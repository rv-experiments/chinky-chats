import apiClient from './apiClient';

// Types
export interface RegisterDeviceRequest {
  deviceToken: string;
  platform: 'ios' | 'android';
}

export interface RegisterDeviceResponse {
  success: boolean;
  message?: string;
}

export interface NotificationSettings {
  partnerOnline: boolean;
  messages: boolean;
  connectionRequests: boolean;
  dailyReminders: boolean;
}

export interface UpdateSettingsResponse {
  success: boolean;
  settings?: NotificationSettings;
  message?: string;
}

export interface GetSettingsResponse {
  success: boolean;
  settings: NotificationSettings;
  message?: string;
}

// Notification API service
export const notificationApi = {
  // Register device for push notifications
  async registerDevice(data: RegisterDeviceRequest): Promise<RegisterDeviceResponse> {
    return apiClient.post<RegisterDeviceResponse>('/notification/device', data);
  },

  // Update notification settings
  async updateSettings(settings: NotificationSettings): Promise<UpdateSettingsResponse> {
    return apiClient.put<UpdateSettingsResponse>('/notification/settings', settings);
  },

  // Get notification settings
  async getSettings(): Promise<GetSettingsResponse> {
    return apiClient.get<GetSettingsResponse>('/notification/settings');
  },

  // Unregister device
  async unregisterDevice(deviceToken: string): Promise<{ success: boolean; message?: string }> {
    return apiClient.delete<{ success: boolean; message?: string }>(`/notification/device/${deviceToken}`);
  },

  // Send test notification
  async sendTestNotification(): Promise<{ success: boolean; message?: string }> {
    return apiClient.post<{ success: boolean; message?: string }>('/notification/test');
  }
};

export default notificationApi;