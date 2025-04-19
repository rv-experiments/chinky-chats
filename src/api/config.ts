/**
 * API Configuration
 * 
 * This file contains configuration for API endpoints and settings.
 */

export const API_CONFIG = {
  BASE_URL: 'https://api.soullink.app/v1',
  WEBSOCKET_URL: 'wss://api.soullink.app/v1/ws',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// For development, we can use mock API
export const USE_MOCK_API = true;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // User Management
  USERS: {
    ME: '/users/me',
    BY_PHONE: '/users/phone',
    CONTACTS: '/users/contacts',
  },
  
  // Connection Management
  CONNECTIONS: {
    REQUEST: '/connections/request',
    ACCEPT: '/connections/accept',
    REJECT: '/connections/reject',
    STATUS: '/connections/status',
    PARTNER: '/connections/partner',
  },
  
  // Messaging
  MESSAGES: {
    BASE: '/messages',
    READ: '/messages/{messageId}/read',
    TYPING: '/messages/typing',
  },
  
  // Love Sparks
  LOVE_SPARKS: {
    BASE: '/lovesparks',
    RATE: '/lovesparks/{sparkId}/rate',
  },
  
  // Presence
  PRESENCE: {
    BASE: '/presence',
    PARTNER: '/presence/partner',
  },
  
  // Notifications
  NOTIFICATIONS: {
    DEVICES: '/notifications/devices',
    SETTINGS: '/notifications/settings',
  },
};

// WebSocket Event Types
export const WS_EVENTS = {
  CONNECTION_STATUS: 'connection_status',
  PARTNER_PRESENCE: 'partner_presence',
  NEW_MESSAGE: 'new_message',
  MESSAGE_STATUS: 'message_status',
  TYPING_STATUS: 'typing_status',
  CONNECTION_REQUEST: 'connection_request',
  CONNECTION_UPDATE: 'connection_update',
};