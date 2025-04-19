export interface ChatMessage {
  id: string;
  text: string;
  sender: 'self' | 'partner';
  timestamp: string;
  read: boolean;
  replyTo?: string; // ID of the message being replied to
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'video' | 'file';
  url: string;
  thumbnail?: string;
  name?: string;
  size?: number;
}

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
  status?: string;
  lastSeen?: string;
}

export interface ConnectionStatus {
  isOnline: boolean;
  lastActive?: string;
  isTyping: boolean;
}

export interface LoveSpark {
  id: string;
  text: string;
  category: 'flirty' | 'thoughtful' | 'playful' | 'spiritual';
  usedCount: number;
  lastUsed?: string;
}