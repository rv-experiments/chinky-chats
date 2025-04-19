import { apiService } from './apiClient';

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

export interface TypingStatusResponse {
  isTyping: boolean;
  userId: string;
  timestamp: string;
}

export interface SetTypingRequest {
  isTyping: boolean;
}

// Message API service
const messageApi = {
  // Get conversation messages
  getMessages: async (connectionId: string, limit = 50, before?: string): Promise<GetMessagesResponse> => {
    let url = `/messages/${connectionId}?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }
    return apiService.get<GetMessagesResponse>(url);
  },
  
  // Send message
  sendMessage: async (data: SendMessageRequest): Promise<{ success: boolean; message: Message }> => {
    return apiService.post<{ success: boolean; message: Message }>('/messages', data);
  },
  
  // Mark message as read
  markAsRead: async (messageId: string): Promise<{ success: boolean }> => {
    return apiService.post<{ success: boolean }>(`/messages/${messageId}/read`);
  },
  
  // Get typing status
  getTypingStatus: async (connectionId: string): Promise<TypingStatusResponse> => {
    return apiService.get<TypingStatusResponse>(`/messages/typing/${connectionId}`);
  },
  
  // Set typing status
  setTypingStatus: async (connectionId: string, data: SetTypingRequest): Promise<{ success: boolean }> => {
    return apiService.post<{ success: boolean }>(`/messages/typing/${connectionId}`, data);
  },
};

export default messageApi;