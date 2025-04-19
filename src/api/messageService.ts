/**
 * Message Service
 * 
 * Handles messaging between connected users.
 */

import { ENDPOINTS } from './config';
import { get, post, withAuth } from './httpClient';
import { mockMessageService } from './mock/mockMessageService';
import { USE_MOCK_API } from './config';

// Types
export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video';
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  readAt?: string;
}

export interface GetMessagesResponse {
  messages: Message[];
  hasMore: boolean;
}

export interface SendMessageRequest {
  connectionId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video';
}

export interface SendMessageResponse {
  success: boolean;
  message: Message;
}

export interface TypingStatusResponse {
  isTyping: boolean;
  userId: string;
  timestamp: string;
}

// Service implementation
const messageService = {
  /**
   * Get conversation messages
   */
  getMessages: async (
    connectionId: string,
    limit: number = 50,
    before?: string
  ): Promise<GetMessagesResponse> => {
    if (USE_MOCK_API) {
      return mockMessageService.getMessages(connectionId, limit, before);
    }
    
    let endpoint = `${ENDPOINTS.MESSAGES.BASE}/${connectionId}?limit=${limit}`;
    if (before) {
      endpoint += `&before=${before}`;
    }
    
    return get<GetMessagesResponse>(endpoint, withAuth());
  },

  /**
   * Send a message
   */
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    if (USE_MOCK_API) {
      return mockMessageService.sendMessage(data);
    }
    return post<SendMessageResponse>(ENDPOINTS.MESSAGES.BASE, data, withAuth());
  },

  /**
   * Mark message as read
   */
  markAsRead: async (messageId: string): Promise<{ success: boolean }> => {
    if (USE_MOCK_API) {
      return mockMessageService.markAsRead(messageId);
    }
    return post<{ success: boolean }>(
      ENDPOINTS.MESSAGES.READ.replace('{messageId}', messageId),
      {},
      withAuth()
    );
  },

  /**
   * Get typing status
   */
  getTypingStatus: async (connectionId: string): Promise<TypingStatusResponse> => {
    if (USE_MOCK_API) {
      return mockMessageService.getTypingStatus(connectionId);
    }
    return get<TypingStatusResponse>(
      `${ENDPOINTS.MESSAGES.TYPING}/${connectionId}`,
      withAuth()
    );
  },

  /**
   * Set typing status
   */
  setTypingStatus: async (
    connectionId: string,
    isTyping: boolean
  ): Promise<{ success: boolean }> => {
    if (USE_MOCK_API) {
      return mockMessageService.setTypingStatus(connectionId, isTyping);
    }
    return post<{ success: boolean }>(
      `${ENDPOINTS.MESSAGES.TYPING}/${connectionId}`,
      { isTyping },
      withAuth()
    );
  },
};

export default messageService;