import apiClient from './apiClient';

// Types
export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'file';
  status: 'sent' | 'delivered' | 'read';
  replyToId?: string;
  attachments?: {
    id: string;
    type: 'image' | 'audio' | 'video' | 'file';
    url: string;
    thumbnail?: string;
    name?: string;
    size?: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  connectionId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'file';
  replyToId?: string;
  attachments?: {
    type: 'image' | 'audio' | 'video' | 'file';
    url: string;
    thumbnail?: string;
    name?: string;
    size?: number;
  }[];
}

export interface SendMessageResponse {
  success: boolean;
  message: Message;
}

export interface GetMessagesResponse {
  success: boolean;
  messages: Message[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface MarkAsReadResponse {
  success: boolean;
  message?: string;
}

export interface TypingStatusRequest {
  isTyping: boolean;
}

export interface TypingStatusResponse {
  success: boolean;
  message?: string;
}

// Message API service
export const messageApi = {
  // Send message
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    return apiClient.post<SendMessageResponse>('/message/send', data);
  },

  // Get messages
  async getMessages(connectionId: string, cursor?: string, limit: number = 20): Promise<GetMessagesResponse> {
    const params: Record<string, string | number> = { limit };
    if (cursor) {
      params.cursor = cursor;
    }
    
    return apiClient.get<GetMessagesResponse>(`/message/${connectionId}`, { params });
  },

  // Mark message as read
  async markAsRead(messageId: string): Promise<MarkAsReadResponse> {
    return apiClient.post<MarkAsReadResponse>(`/message/${messageId}/read`);
  },

  // Set typing status
  async setTypingStatus(connectionId: string, data: TypingStatusRequest): Promise<TypingStatusResponse> {
    return apiClient.post<TypingStatusResponse>(`/message/${connectionId}/typing`, data);
  },

  // Upload attachment
  async uploadAttachment(file: FormData): Promise<{ success: boolean; url?: string; thumbnail?: string; message?: string }> {
    return apiClient.post<{ success: boolean; url?: string; thumbnail?: string; message?: string }>(
      '/message/attachment',
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Delete message
  async deleteMessage(messageId: string): Promise<{ success: boolean; message?: string }> {
    return apiClient.delete<{ success: boolean; message?: string }>(`/message/${messageId}`);
  }
};

export default messageApi;