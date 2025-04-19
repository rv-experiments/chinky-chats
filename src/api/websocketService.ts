import { io, Socket } from 'socket.io-client';
import { EventEmitter } from 'events';
import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// WebSocket event types
export enum WebSocketEventType {
  PARTNER_PRESENCE = 'partner_presence',
  NEW_MESSAGE = 'new_message',
  MESSAGE_STATUS = 'message_status',
  TYPING_STATUS = 'typing_status',
  CONNECTION_REQUEST = 'connection_request',
  CONNECTION_ACCEPTED = 'connection_accepted',
  CONNECTION_REJECTED = 'connection_rejected',
  CONNECTION_REMOVED = 'connection_removed',
}

// WebSocket service class
class WebSocketService {
  private socket: Socket | null = null;
  private eventEmitter: EventEmitter;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 2000; // Start with 2 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting: boolean = false;

  constructor() {
    this.eventEmitter = new EventEmitter();
    // Increase max listeners to avoid memory leak warnings
    this.eventEmitter.setMaxListeners(20);
  }

  // Connect to WebSocket server
  async connect(): Promise<boolean> {
    if (this.socket?.connected) {
      return true;
    }

    if (this.isConnecting) {
      return new Promise<boolean>((resolve) => {
        const checkConnection = () => {
          if (this.socket?.connected) {
            resolve(true);
          } else if (!this.isConnecting) {
            resolve(false);
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    this.isConnecting = true;

    try {
      // Get access token for authentication
      const token = await AsyncStorage.getItem('soullink_access_token');
      
      if (!token) {
        console.error('No access token available for WebSocket connection');
        this.isConnecting = false;
        return false;
      }
      
      // Create socket connection
      this.socket = io(`${API_BASE_URL}/socket`, {
        auth: {
          token
        },
        transports: ['websocket'],
        reconnection: false, // We'll handle reconnection manually
      });
      
      // Set up event listeners
      this.setupSocketListeners();
      
      // Wait for connection
      return new Promise<boolean>((resolve) => {
        if (!this.socket) {
          this.isConnecting = false;
          resolve(false);
          return;
        }
        
        // Set timeout for connection
        const timeout = setTimeout(() => {
          this.isConnecting = false;
          resolve(false);
        }, 10000);
        
        // Handle successful connection
        this.socket.on('connect', () => {
          clearTimeout(timeout);
          this.reconnectAttempts = 0;
          this.reconnectDelay = 2000;
          this.isConnecting = false;
          resolve(true);
        });
        
        // Handle connection error
        this.socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          console.error('WebSocket connection error:', error);
          this.isConnecting = false;
          resolve(false);
          
          // Try to reconnect
          this.attemptReconnect();
        });
      });
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.isConnecting = false;
      return false;
    }
  }

  // Set up socket event listeners
  private setupSocketListeners(): void {
    if (!this.socket) return;
    
    // Handle disconnection
    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      
      // Try to reconnect if not intentionally disconnected
      if (reason !== 'io client disconnect') {
        this.attemptReconnect();
      }
    });
    
    // Handle errors
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    // Handle reconnection
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts');
    });
    
    // Handle events from server
    Object.values(WebSocketEventType).forEach(eventType => {
      this.socket?.on(eventType, (data) => {
        this.eventEmitter.emit(eventType, data);
      });
    });
  }

  // Attempt to reconnect
  private attemptReconnect(): void {
    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    // Check if we've exceeded max attempts
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }
    
    // Increment attempts and increase delay (exponential backoff)
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1), 60000);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    // Set timer for reconnection
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      
      // Close existing socket if any
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      
      // Try to connect again
      await this.connect();
    }, delay);
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    // Clear any reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    // Close socket if connected
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    // Reset reconnect attempts
    this.reconnectAttempts = 0;
  }

  // Check if connected
  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  // Subscribe to an event
  on<T>(event: WebSocketEventType | string, listener: (data: T) => void): () => void {
    this.eventEmitter.on(event, listener);
    
    // Return unsubscribe function
    return () => {
      this.eventEmitter.off(event, listener);
    };
  }

  // Emit an event
  emit<T>(event: string, data: T): void {
    if (!this.socket?.connected) {
      console.warn('Cannot emit event, socket not connected:', event);
      return;
    }
    
    this.socket.emit(event, data);
  }
}

// Create and export singleton instance
export const websocketService = new WebSocketService();

export default websocketService;