import React from 'react';
import { Search, Menu, Settings, MessageSquare, Phone, Globe, Archive, Lock } from 'lucide-react';
import { Chat, User } from '../types';
import { UserAvatar } from './ui/UserAvatar';
import { cn, formatTime } from '../lib/utils';
import { StoriesBar } from './StoriesBar';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  stories: any[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  chats, 
  activeChatId, 
  onSelectChat, 
  searchQuery, 
  onSearchChange,
  stories
}) => {
  return (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Top Header */}
      <div className="p-4 space-y-4 bg-background z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-muted rounded-full transition-colors">
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">B2</h1>
              <div className="flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full uppercase tracking-tighter">
                <Lock size={8} className="mr-1" />
                Secure
              </div>
            </div>
          </div>
          <button className="p-2.5 hover:bg-muted rounded-full transition-colors">
            <Settings size={22} />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search for chats or people..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-muted/60 border-none rounded-2xl py-2.5 pl-11 pr-4 text-[14px] focus:ring-2 ring-primary/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Stories */}
      <div className="border-b">
        <StoriesBar stories={stories} />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex px-4 py-3 gap-6 text-[13px] font-semibold border-b">
          <button className="relative pb-3 text-primary transition-all after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary">
            All Chats
          </button>
          <button className="pb-3 text-muted-foreground hover:text-foreground transition-all">
            Groups
          </button>
          <button className="pb-3 text-muted-foreground hover:text-foreground transition-all">
            Channels
          </button>
        </div>

        <div className="py-2">
          {chats.map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const isGroup = chat.type === 'group';
            const title = isGroup ? chat.name : chat.participants[0].name;
            const avatar = isGroup ? chat.groupAvatar : chat.participants[0].avatar;
            const status = isGroup ? undefined : chat.participants[0].status;

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 transition-all hover:bg-muted/50 text-left relative",
                  activeChatId === chat.id && "bg-primary/5 after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-1 after:bg-primary"
                )}
              >
                <div className="relative">
                  <UserAvatar 
                    src={avatar} 
                    fallback={title || '?'} 
                    status={status}
                    className="h-[52px] w-[52px] shrink-0 shadow-sm" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={cn(
                      "font-bold truncate text-[15px]",
                      activeChatId === chat.id ? "text-primary" : "text-foreground"
                    )}>
                      {title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">
                      {lastMessage ? formatTime(lastMessage.timestamp) : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-[13px] text-muted-foreground truncate leading-tight">
                      {lastMessage?.senderId === 'me' && <span className="text-primary font-medium mr-1">You:</span>}
                      {lastMessage?.type === 'text' ? lastMessage.text : 
                       lastMessage?.type === 'image' ? 'Sent a photo' :
                       lastMessage?.type === 'voice' ? 'Voice message' : 'Sent a file'}
                    </p>
                    {!lastMessage?.isRead && lastMessage?.senderId !== 'me' && (
                      <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-primary text-[10px] text-white rounded-full font-bold shadow-md shadow-primary/20">
                        1
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="p-2 border-t flex justify-around bg-muted/20 backdrop-blur-md">
        <button className="p-2 flex flex-col items-center gap-1.5 text-primary transition-transform active:scale-90">
          <MessageSquare size={22} />
          <span className="text-[10px] font-medium">Chats</span>
        </button>
        <button className="p-2 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-transform active:scale-90">
          <Phone size={22} />
          <span className="text-[10px] font-medium">Calls</span>
        </button>
        <button className="p-2 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-transform active:scale-90">
          <Globe size={22} />
          <span className="text-[10px] font-medium">Feed</span>
        </button>
      </div>
    </div>
  );
};