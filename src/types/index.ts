export type MessageType = 'text' | 'image' | 'voice' | 'file';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  type: MessageType;
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
  duration?: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  type: 'direct' | 'group';
  name?: string;
  groupAvatar?: string;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  timestamp: Date;
}