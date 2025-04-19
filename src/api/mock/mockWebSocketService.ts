/**
 * Mock WebSocket Service
 * 
 * Provides mock implementations of WebSocket functionality for development.
 */

import { WS_EVENTS } from '../config';

// Types
interface MockWebSocketMessage {
  type: string;
  data: any;
}

// Mock WebSocket service
class MockWebSocketService {
  private connected = false;
  private messageHandlers: Record<string, ((data: any) => void)[]> = {};
  private parentService: any = null;
  private mockMessageInterval: NodeJS.Timeout | null = null;
  private connectionId: string | null = null;

  /**
   * Initialize mock service with parent service
   */
  initialize(parentService: any): void {
    this.parentService = parentService;
    
    // Initialize event handlers
    Object.values(WS_EVENTS).forEach(eventType => {
      this.messageHandlers[eventType] = [];
    });
  }

  /**
   * Connect to mock WebSocket
   */
  connect(connectionId?: string): Promise<boolean> {
    return new Promise(resolve => {
      // Simulate connection delay
      setTimeout(() => {
        this.connected = true;
        this.connectionId = connectionId || 'connection-123';
        
        // Start sending mock messages
        this.startMockMessages();
        
        resolve(true);
      }, 500);
    });
  }

  /**
   * Disconnect from mock WebSocket
   */
  disconnect(): void {
    this.connected = false;
    
    // Stop sending mock messages
    if (this.mockMessageInterval) {
      clearInterval(this.mockMessageInterval);
      this.mockMessageInterval = null;
    }
  }

  /**
   * Send message to mock WebSocket
   */
  send(type: string, data: any): boolean {
    if (!this.connected) {
      return false;
    }
    
    console.log('Mock WebSocket sending message:', { type, data });
    
    // For typing status, simulate partner response
    if (type === WS_EVENTS.TYPING_STATUS) {
      this.simulatePartnerResponse(data);
    }
    
    return true;
  }

  /**
   * Check if mock WebSocket is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Start sending periodic mock messages
   */
  private startMockMessages(): void {
    // Clear any existing interval
    if (this.mockMessageInterval) {
      clearInterval(this.mockMessageInterval);
    }
    
    // Send mock messages every 10-30 seconds
    this.mockMessageInterval = setInterval(() => {
      if (!this.connected) {
        return;
      }
      
      // Randomly select a message type to send
      const messageTypes = [
        this.createPartnerPresenceMessage,
        this.createNewMessageMessage,
      ];
      
      const randomMessageCreator = messageTypes[Math.floor(Math.random() * messageTypes.length)];
      const message = randomMessageCreator.call(this);
      
      // Send to parent service
      if (this.parentService && message) {
        this.parentService.handleMessage(message);
      }
    }, Math.random() * 20000 + 10000); // 10-30 seconds
  }

  /**
   * Simulate partner response to user actions
   */
  private simulatePartnerResponse(data: any): void {
    if (!this.connected || !this.parentService) {
      return;
    }
    
    // If user is typing, simulate partner typing after a delay
    if (data.isTyping) {
      setTimeout(() => {
        const typingMessage = {
          type: WS_EVENTS.TYPING_STATUS,
          data: {
            userId: 'user-456', // Partner ID
            isTyping: true,
            connectionId: this.connectionId,
          },
        };
        
        this.parentService.handleMessage(typingMessage);
        
        // After a few seconds, stop typing and maybe send a message
        setTimeout(() => {
          // Stop typing
          const stopTypingMessage = {
            type: WS_EVENTS.TYPING_STATUS,
            data: {
              userId: 'user-456', // Partner ID
              isTyping: false,
              connectionId: this.connectionId,
            },
          };
          
          this.parentService.handleMessage(stopTypingMessage);
          
          // 50% chance to send a message
          if (Math.random() > 0.5) {
            setTimeout(() => {
              const newMessage = this.createNewMessageMessage();
              this.parentService.handleMessage(newMessage);
            }, 1000);
          }
        }, Math.random() * 3000 + 2000); // 2-5 seconds of typing
      }, Math.random() * 2000 + 1000); // 1-3 second delay before partner starts typing
    }
  }

  /**
   * Create mock partner presence message
   */
  private createPartnerPresenceMessage(): MockWebSocketMessage {
    const statuses = ['online', 'offline', 'away'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      type: WS_EVENTS.PARTNER_PRESENCE,
      data: {
        userId: 'user-456', // Partner ID
        status: randomStatus,
        lastSeen: new Date().toISOString(),
      },
    };
  }

  /**
   * Create mock new message
   */
  private createNewMessageMessage(): MockWebSocketMessage {
    const responses = [
      'Hey there! How are you doing today?',
      'I was just thinking about you! ❤️',
      'Miss you so much!',
      'Can't wait to see you again.',
      'What are you up to?',
      'Just wanted to say I love you!',
      'Sending you a virtual hug right now.',
      'Remember that time we went to the beach? That was amazing!',
      'You're the best thing that's ever happened to me.',
      'Just checking in. Hope you're having a great day!',
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      type: WS_EVENTS.NEW_MESSAGE,
      data: {
        id: `message-${Date.now()}`,
        connectionId: this.connectionId || 'connection-123',
        senderId: 'user-456', // Partner ID
        content: randomResponse,
        type: 'text',
        status: 'sent',
        createdAt: new Date().toISOString(),
      },
    };
  }
}

export const mockWebSocketService = new MockWebSocketService();