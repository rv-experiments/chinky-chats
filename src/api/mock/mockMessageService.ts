/**
 * Mock Message Service
 * 
 * Provides mock implementations of message service methods for development.
 */

import {
  Message,
  GetMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  TypingStatusResponse,
} from '../messageService';

// Mock messages
const mockMessages: Message[] = [
  {
    id: 'message-1',
    connectionId: 'connection-123',
    senderId: 'user-123',
    content: 'Hey there!',
    type: 'text',
    status: 'read',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    readAt: new Date(Date.now() - 3590000).toISOString(), // 59 minutes 50 seconds ago
  },
  {
    id: 'message-2',
    connectionId: 'connection-123',
    senderId: 'user-456',
    content: 'Hi! How are you?',
    type: 'text',
    status: 'read',
    createdAt: new Date(Date.now() - 3540000).toISOString(), // 59 minutes ago
    readAt: new Date(Date.now() - 3530000).toISOString(), // 58 minutes 50 seconds ago
  },
  {
    id: 'message-3',
    connectionId: 'connection-123',
    senderId: 'user-123',
    content: 'I\'m doing great! Just thinking about you.',
    type: 'text',
    status: 'read',
    createdAt: new Date(Date.now() - 3480000).toISOString(), // 58 minutes ago
    readAt: new Date(Date.now() - 3470000).toISOString(), // 57 minutes 50 seconds ago
  },
  {
    id: 'message-4',
    connectionId: 'connection-123',
    senderId: 'user-456',
    content: 'That\'s so sweet! I was just about to message you.',
    type: 'text',
    status: 'read',
    createdAt: new Date(Date.now() - 3420000).toISOString(), // 57 minutes ago
    readAt: new Date(Date.now() - 3410000).toISOString(), // 56 minutes 50 seconds ago
  },
  {
    id: 'message-5',
    connectionId: 'connection-123',
    senderId: 'user-123',
    content: 'Great minds think alike! 😊',
    type: 'text',
    status: 'read',
    createdAt: new Date(Date.now() - 3360000).toISOString(), // 56 minutes ago
    readAt: new Date(Date.now() - 3350000).toISOString(), // 55 minutes 50 seconds ago
  },
];

// Mock typing status
let mockTypingStatus = {
  isTyping: false,
  userId: 'user-456',
  timestamp: new Date().toISOString(),
};

export const mockMessageService = {
  getMessages: async (
    connectionId: string,
    limit: number = 50,
    before?: string
  ): Promise<GetMessagesResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter messages by connectionId
    let filteredMessages = mockMessages.filter(
      message => message.connectionId === connectionId
    );
    
    // If 'before' is provided, filter messages
    if (before) {
      const beforeIndex = filteredMessages.findIndex(message => message.id === before);
      if (beforeIndex !== -1) {
        filteredMessages = filteredMessages.slice(0, beforeIndex);
      }
    }
    
    // Apply limit
    filteredMessages = filteredMessages.slice(0, limit);
    
    return {
      messages: filteredMessages,
      hasMore: false, // For simplicity, always return false
    };
  },

  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a new message
    const newMessage: Message = {
      id: `message-${Date.now()}`,
      connectionId: data.connectionId,
      senderId: 'user-123', // Current user
      content: data.content,
      type: data.type,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };
    
    // Add to mock messages (in a real app, this would be handled by the server)
    mockMessages.push(newMessage);
    
    return {
      success: true,
      message: newMessage,
    };
  },

  markAsRead: async (messageId: string): Promise<{ success: boolean }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the message and mark as read
    const messageIndex = mockMessages.findIndex(message => message.id === messageId);
    if (messageIndex !== -1) {
      mockMessages[messageIndex] = {
        ...mockMessages[messageIndex],
        status: 'read',
        readAt: new Date().toISOString(),
      };
    }
    
    return {
      success: true,
    };
  },

  getTypingStatus: async (connectionId: string): Promise<TypingStatusResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return { ...mockTypingStatus };
  },

  setTypingStatus: async (
    connectionId: string,
    isTyping: boolean
  ): Promise<{ success: boolean }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Update mock typing status
    mockTypingStatus = {
      isTyping,
      userId: 'user-123', // Current user
      timestamp: new Date().toISOString(),
    };
    
    return {
      success: true,
    };
  },
};