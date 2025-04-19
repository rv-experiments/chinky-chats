import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventEmitter } from 'events';

// WebSocket event types
export type WebSocketEventType = 
  | 'connection_status'
  | 'partner_presence'
  | 'new_message'
  | 'message_status'
  | 'typing_status'
  | 'connection_request'
  | 'connection_update';

// WebSocket event data types
export interface WebSocketEvent<T = any> {
  type: WebSocketEventType;
  data: T;
}

// WebSocket service class
class WebSocketService {
  private socket: WebSocket | null = null;
  private eventEmitter = new EventEmitter();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  
  // Connect to WebSocket server
  public async connect(): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }
    
    this.isConnecting = true;
    
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      this.socket = new WebSocket(`wss://api.soullink.app/v1/ws?token=${token}`);
      
      this.socket.onopen = this.handleOpen;
      this.socket.onmessage = this.handleMessage;
      this.socket.onclose = this.handleClose;
      this.socket.onerror = this.handleError;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }
  
  // Disconnect from WebSocket server
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.reconnectAttempts = 0;
  }
  
  // Send message to WebSocket server
  public send(event: WebSocketEvent): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(event));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', event);
      this.connect(); // Try to reconnect
    }
  }
  
  // Subscribe to WebSocket events
  public on<T>(eventType: WebSocketEventType, listener: (data: T) => void): void {
    this.eventEmitter.on(eventType, listener);
  }
  
  // Unsubscribe from WebSocket events
  public off<T>(eventType: WebSocketEventType, listener: (data: T) => void): void {
    this.eventEmitter.off(eventType, listener);
  }
  
  // Handle WebSocket open event
  private handleOpen = (): void => {
    console.log('WebSocket connected');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    
    // Emit connection status event
    this.eventEmitter.emit('connection_status', { status: 'connected' });
  };
  
  // Handle WebSocket message event
  private handleMessage = (event: MessageEvent): void => {
    try {
      const wsEvent: WebSocketEvent = JSON.parse(event.data);
      
      if (wsEvent && wsEvent.type) {
        this.eventEmitter.emit(wsEvent.type, wsEvent.data);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };
  
  // Handle WebSocket close event
  private handleClose = (event: CloseEvent): void => {
    console.log('WebSocket disconnected:', event.code, event.reason);
    this.isConnecting = false;
    this.socket = null;
    
    // Emit connection status event
    this.eventEmitter.emit('connection_status', { status: 'disconnected' });
    
    // Attempt to reconnect if not closed cleanly
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
  };
  
  // Handle WebSocket error event
  private handleError = (error: Event): void => {
    console.error('WebSocket error:', error);
    this.isConnecting = false;
  };
  
  // Attempt to reconnect to WebSocket server
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnect attempts reached');
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;