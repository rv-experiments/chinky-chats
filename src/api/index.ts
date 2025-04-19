import apiClient, { apiService } from './apiClient';
import authApi from './authApi';
import userApi from './userApi';
import connectionApi from './connectionApi';
import messageApi from './messageApi';
import loveSparkApi from './loveSparkApi';
import presenceApi from './presenceApi';
import notificationApi from './notificationApi';
import websocketService from './websocketService';

// Export all API services
export {
  apiClient,
  apiService,
  authApi,
  userApi,
  connectionApi,
  messageApi,
  loveSparkApi,
  presenceApi,
  notificationApi,
  websocketService,
};

// Export types
export * from './authApi';
export * from './userApi';
export * from './connectionApi';
export * from './messageApi';
export * from './loveSparkApi';
export * from './presenceApi';
export * from './notificationApi';
export * from './websocketService';