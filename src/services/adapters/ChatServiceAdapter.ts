import { ChatMessage, ConnectionStatus } from '../../types/ChatTypes';
import { AuthService } from './AuthServiceAdapter';
import { messageApi, websocketService, connectionApi } from '../../api';
import { WebSocketEventType } from '../../api/websocketService';

/**
 * Adapter class that maintains the existing ChatService interface
 * while using the new API implementation under the hood
 */
export class ChatService {
  private static connectionStatus: ConnectionStatus = {
    isOnline: false,
    isTyping: false
  };
  private static messageListeners: ((message: ChatMessage) => void)[] = [];
  private static statusListeners: ((status: ConnectionStatus) => void)[] = [];
  private static connectionId: string | null = null;

  // Initialize socket connection
  static async initialize(): Promise<boolean> {
    try {
      const user = await AuthService.getCurrentUser();
      const partnerNumber = await AuthService.getPartnerNumber();
      
      if (!user || !partnerNumber) {
        return false;
      }
      
      // Get connection with partner
      try {
        const partner = await connectionApi.getPartner();
        this.connectionId = partner.connectionId;
        
        // Set initial connection status
        this.connectionStatus = {
          isOnline: partner.status === 'online',
          lastActive: partner.lastSeen,
          isTyping: false
        };
        
        // Notify status listeners
        this.notifyStatusListeners();
        
        // Connect to WebSocket
        await websocketService.connect();
        
        // Set up WebSocket event listeners
        this.setupWebSocketListeners();
        
        return true;
      } catch (error) {
        console.error('Error getting partner connection:', error);
        
        // For demo purposes, simulate connection
        this.simulateConnection(user.id, partnerNumber);
        return true;
      }
    } catch (error) {
      console.error('Error initializing chat service:', error);
      return false;
    }
  }

  // Simulate socket connection for demo
  private static simulateConnection(userId: string, partnerNumber: string): void {
    console.log(`Simulating connection for user ${userId} with partner ${partnerNumber}`);
    
    // Set connection status to online
    this.connectionStatus = {
      isOnline: true,
      isTyping: false
    };
    
    // Notify listeners
    this.notifyStatusListeners();
    
    // Simulate receiving messages occasionally
    setInterval(() => {
      if (Math.random() > 0.7) {
        const simulatedMessage: ChatMessage = {
          id: 'msg_' + Date.now().toString(),
          text: 'This is a simulated message from your partner',
          sender: 'partner',
          timestamp: new Date().toISOString(),
          read: false
        };
        
        this.notifyMessageListeners(simulatedMessage);
      }
    }, 30000); // Every 30 seconds
    
    // Simulate partner typing occasionally
    setInterval(() => {
      if (Math.random() > 0.8) {
        this.connectionStatus.isTyping = true;
        this.notifyStatusListeners();
        
        // Stop typing after a few seconds
        setTimeout(() => {
          this.connectionStatus.isTyping = false;
          this.notifyStatusListeners();
        }, 3000);
      }
    }, 20000); // Every 20 seconds
    
    // Simulate partner going offline occasionally
    setInterval(() => {
      if (Math.random() > 0.9) {
        this.connectionStatus.isOnline = false;
        this.notifyStatusListeners();
        
        // Come back online after a while
        setTimeout(() => {
          this.connectionStatus.isOnline = true;
          this.notifyStatusListeners();
        }, 60000 + Math.random() * 120000); // Between 1-3 minutes
      }
    }, 300000); // Every 5 minutes
  }

  // Set up WebSocket event listeners
  private static setupWebSocketListeners(): void {
    // Partner presence updates
    websocketService.on<{ userId: string; status: string; timestamp: string }>('partner_presence', (data) => {
      this.connectionStatus.isOnline = data.status === 'online';
      this.connectionStatus.lastActive = data.timestamp;
      this.notifyStatusListeners();
    });
    
    // New messages
    websocketService.on<{ message: any }>('new_message', (data) => {
      // Convert API message to app ChatMessage type
      const chatMessage: ChatMessage = {
        id: data.message.id,
        text: data.message.content,
        sender: data.message.senderId === AuthService.getCurrentUser().then(user => user?.id) ? 'self' : 'partner',
        timestamp: data.message.createdAt,
        read: data.message.status === 'read',
      };
      
      this.notifyMessageListeners(chatMessage);
    });
    
    // Typing status
    websocketService.on<{ connectionId: string; userId: string; isTyping: boolean }>('typing_status', (data) => {
      if (this.connectionId === data.connectionId) {
        this.connectionStatus.isTyping = data.isTyping;
        this.notifyStatusListeners();
      }
    });
    
    // Message status updates
    websocketService.on<{ messageId: string; status: string }>('message_status', (data) => {
      // This would update the message status in a real app
      // For demo purposes, we'll just log it
      console.log(`Message ${data.messageId} status updated to ${data.status}`);
    });
  }

  // Send a message
  static async sendMessage(text: string): Promise<ChatMessage | null> {
    try {
      const user = await AuthService.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      if (!this.connectionId) {
        // For demo purposes, create a fake message
        const message: ChatMessage = {
          id: 'msg_' + Date.now().toString(),
          text,
          sender: 'self',
          timestamp: new Date().toISOString(),
          read: false
        };
        
        return message;
      }
      
      // Send message via API
      const response = await messageApi.sendMessage({
        connectionId: this.connectionId,
        content: text,
        type: 'text'
      });
      
      if (response.success) {
        // Convert API message to app ChatMessage type
        const chatMessage: ChatMessage = {
          id: response.message.id,
          text: response.message.content,
          sender: 'self',
          timestamp: response.message.createdAt,
          read: response.message.status === 'read',
        };
        
        return chatMessage;
      }
      
      throw new Error('Failed to send message');
    } catch (error) {
      console.error('Error sending message:', error);
      
      // For demo purposes, return a fake message even if API fails
      const message: ChatMessage = {
        id: 'msg_' + Date.now().toString(),
        text,
        sender: 'self',
        timestamp: new Date().toISOString(),
        read: false
      };
      
      return message;
    }
  }

  // Get connection status
  static getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // Add message listener
  static addMessageListener(listener: (message: ChatMessage) => void): void {
    this.messageListeners.push(listener);
  }

  // Remove message listener
  static removeMessageListener(listener: (message: ChatMessage) => void): void {
    const index = this.messageListeners.indexOf(listener);
    if (index !== -1) {
      this.messageListeners.splice(index, 1);
    }
  }

  // Add status listener
  static addStatusListener(listener: (status: ConnectionStatus) => void): void {
    this.statusListeners.push(listener);
  }

  // Remove status listener
  static removeStatusListener(listener: (status: ConnectionStatus) => void): void {
    const index = this.statusListeners.indexOf(listener);
    if (index !== -1) {
      this.statusListeners.splice(index, 1);
    }
  }

  // Notify message listeners
  private static notifyMessageListeners(message: ChatMessage): void {
    this.messageListeners.forEach(listener => listener(message));
  }

  // Notify status listeners
  private static notifyStatusListeners(): void {
    this.statusListeners.forEach(listener => listener(this.connectionStatus));
  }

  // Mark message as read
  static async markAsRead(messageId: string): Promise<boolean> {
    try {
      // Call API to mark message as read
      const response = await messageApi.markAsRead(messageId);
      return response.success;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }

  // Set typing status
  static async setTypingStatus(isTyping: boolean): Promise<boolean> {
    try {
      if (!this.connectionId) {
        return false;
      }
      
      // Call API to set typing status
      const response = await messageApi.setTypingStatus(this.connectionId, { isTyping });
      return response.success;
    } catch (error) {
      console.error('Error setting typing status:', error);
      return false;
    }
  }

  // Disconnect
  static disconnect(): void {
    // Disconnect WebSocket
    websocketService.disconnect();
    
    // Reset connection status
    this.connectionStatus = {
      isOnline: false,
      isTyping: false
    };
    
    // Notify listeners
    this.notifyStatusListeners();
    
    // Clear listeners
    this.messageListeners = [];
    this.statusListeners = [];
    
    // Clear connection ID
    this.connectionId = null;
  }
}