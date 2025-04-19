import { io, Socket } from 'socket.io-client';
import { ChatMessage, ConnectionStatus } from '../types/ChatTypes';
import { AuthService } from './AuthService';

// This would be your actual API endpoint in a real app
const API_URL = 'https://api.soullink-app.com';

export class ChatService {
  private static socket: Socket | null = null;
  private static connectionStatus: ConnectionStatus = {
    isOnline: false,
    isTyping: false
  };
  private static messageListeners: ((message: ChatMessage) => void)[] = [];
  private static statusListeners: ((status: ConnectionStatus) => void)[] = [];

  // Initialize socket connection
  static async initialize(): Promise<boolean> {
    try {
      const user = await AuthService.getCurrentUser();
      const partnerNumber = await AuthService.getPartnerNumber();
      
      if (!user || !partnerNumber) {
        return false;
      }
      
      // In a real app, you would connect to your actual server
      // For demo purposes, we'll simulate the connection
      this.simulateConnection(user.id, partnerNumber);
      
      return true;
    } catch (error) {
      console.error('Error initializing chat service:', error);
      return false;
    }
  }

  // Simulate socket connection for demo
  private static simulateConnection(userId: string, partnerNumber: string): void {
    // In a real app, this would be a real socket connection
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

  // Send a message
  static async sendMessage(text: string): Promise<ChatMessage | null> {
    try {
      const user = await AuthService.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create message object
      const message: ChatMessage = {
        id: 'msg_' + Date.now().toString(),
        text,
        sender: 'self',
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // In a real app, this would send the message to the server
      // For demo purposes, we'll just return the message
      
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
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
      // In a real app, this would send a request to the server
      // For demo purposes, we'll just return true
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }

  // Disconnect
  static disconnect(): void {
    // In a real app, this would disconnect the socket
    this.connectionStatus = {
      isOnline: false,
      isTyping: false
    };
    
    this.notifyStatusListeners();
    this.messageListeners = [];
    this.statusListeners = [];
  }
}