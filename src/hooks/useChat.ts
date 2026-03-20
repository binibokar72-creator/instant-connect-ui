import { useState, useMemo } from 'react';
import { Chat, User, Message, Story } from '../types';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera', avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/83b3126e-68ce-4626-8b16-77034640bc76/user-avatar-1-6870bde1-1774039529420.webp', status: 'online' },
  { id: 'u2', name: 'Sarah Chen', avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/83b3126e-68ce-4626-8b16-77034640bc76/user-avatar-2-12b35db2-1774039526410.webp', status: 'online' },
  { id: 'u3', name: 'Jordan Smith', avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/83b3126e-68ce-4626-8b16-77034640bc76/user-avatar-3-5f6ce59e-1774039526426.webp', status: 'away' },
  { id: 'u4', name: 'Emma Wilson', avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/83b3126e-68ce-4626-8b16-77034640bc76/user-avatar-4-8a609ca3-1774039526315.webp', status: 'offline' },
];

const MOCK_STORIES: Story[] = [
  { id: 's1', userId: 'u1', userName: 'Alex', userAvatar: MOCK_USERS[0].avatar, imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/83b3126e-68ce-4626-8b16-77034640bc76/story-img-1-6bcbec54-1774039525931.webp', timestamp: new Date() },
  { id: 's2', userId: 'u2', userName: 'Sarah', userAvatar: MOCK_USERS[1].avatar, imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/83b3126e-68ce-4626-8b16-77034640bc76/story-img-2-1a66c527-1774039531424.webp', timestamp: new Date() },
  { id: 's3', userId: 'u3', userName: 'Jordan', userAvatar: MOCK_USERS[2].avatar, imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/83b3126e-68ce-4626-8b16-77034640bc76/story-img-3-75aa4413-1774039536557.webp', timestamp: new Date() },
  { id: 's4', userId: 'u4', userName: 'Emma', userAvatar: MOCK_USERS[3].avatar, imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/83b3126e-68ce-4626-8b16-77034640bc76/story-img-4-9016118c-1774039526438.webp', timestamp: new Date() },
];

const INITIAL_CHATS: Chat[] = [
  {
    id: 'c1',
    type: 'direct',
    participants: [MOCK_USERS[0]],
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Hey, did you check the new designs?', type: 'text', timestamp: new Date(Date.now() - 3600000), isRead: true },
      { id: 'm2', senderId: 'me', text: 'Not yet, sending them over now!', type: 'text', timestamp: new Date(Date.now() - 1800000), isRead: true },
    ]
  },
  {
    id: 'c2',
    type: 'direct',
    participants: [MOCK_USERS[1]],
    messages: [
      { id: 'm3', senderId: 'u2', text: 'Meeting at 3 PM?', type: 'text', timestamp: new Date(Date.now() - 86400000), isRead: true },
    ]
  },
  {
    id: 'c3',
    type: 'group',
    name: 'Tech Design Team',
    groupAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop',
    participants: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2]],
    messages: [
      { id: 'm4', senderId: 'u3', text: 'Check out this screenshot', type: 'image', fileUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/83b3126e-68ce-4626-8b16-77034640bc76/story-img-4-9016118c-1774039526438.webp', timestamp: new Date(Date.now() - 500000), isRead: false },
    ]
  }
];

export function useChat() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(INITIAL_CHATS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'video' | 'voice' | null>(null);

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId), [chats, activeChatId]);

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    return chats.filter(chat => {
      const name = chat.type === 'direct' ? chat.participants[0].name : chat.name;
      return name?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [chats, searchQuery]);

  const sendMessage = (text: string, type: 'text' | 'image' | 'voice' | 'file' = 'text', extra?: Partial<Message>) => {
    if (!activeChatId) return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      text,
      type,
      timestamp: new Date(),
      isRead: false,
      ...extra
    };

    setChats(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));
  };

  const startCall = (type: 'video' | 'voice') => {
    setCallType(type);
    setIsCalling(true);
  };

  const endCall = () => {
    setIsCalling(false);
    setCallType(null);
  };

  return {
    chats: filteredChats,
    activeChat,
    setActiveChatId,
    sendMessage,
    searchQuery,
    setSearchQuery,
    stories: MOCK_STORIES,
    isCalling,
    callType,
    startCall,
    endCall,
    currentUser: { id: 'me', name: 'John Doe', avatar: '', status: 'online' } as User
  };
}