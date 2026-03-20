import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, Video, MoreVertical, Paperclip, Send, 
  Mic, Image as ImageIcon, File, Smile, X, Check, CheckCheck, MessageSquare 
} from 'lucide-react';
import { Chat, Message, User } from '../types';
import { UserAvatar } from './ui/UserAvatar';
import { cn, formatTime } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindowProps {
  chat: Chat | undefined;
  onSendMessage: (text: string, type?: any, extra?: any) => void;
  onStartCall: (type: 'video' | 'voice') => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onSendMessage, onStartCall }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <div className="bg-primary/10 p-6 rounded-full inline-block animate-bounce-slow">
            <MessageSquare size={48} className="text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold">Your Messages</p>
            <p className="text-muted-foreground max-w-[280px]">Select a chat to start messaging or create a new conversation.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isGroup = chat.type === 'group';
  const title = isGroup ? chat.name : chat.participants[0].name;
  const avatar = isGroup ? chat.groupAvatar : chat.participants[0].avatar;
  const statusText = isGroup ? `${chat.participants.length} members` : chat.participants[0].status;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f7f9] dark:bg-neutral-900 relative">
      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <UserAvatar src={avatar} fallback={title || ''} className="h-10 w-10 shadow-sm" />
          <div className="cursor-pointer">
            <h2 className="font-bold text-sm hover:text-primary transition-colors">{title}</h2>
            <p className="text-[11px] text-muted-foreground capitalize flex items-center gap-1">
              {statusText === 'online' && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
              {statusText}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onStartCall('voice')} className="p-2 hover:bg-muted rounded-full transition-colors text-primary">
            <Phone size={20} />
          </button>
          <button onClick={() => onStartCall('video')} className="p-2 hover:bg-muted rounded-full transition-colors text-primary">
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
        style={{ 
          backgroundImage: 'radial-gradient(circle, #e2e8f0 1.5px, transparent 1.5px)', 
          backgroundSize: '24px 24px' 
        }}
      >
        <div className="flex justify-center mb-6">
          <span className="bg-muted/50 text-[10px] text-muted-foreground px-3 py-1 rounded-full uppercase tracking-wider font-semibold">Today</span>
        </div>
        
        {chat.messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          const sender = isGroup ? chat.participants.find(p => p.id === msg.senderId) : chat.participants[0];

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={msg.id}
              className={cn(
                "flex items-end gap-2",
                isMe ? "flex-row-reverse" : "flex-row"
              )}
            >
              {!isMe && isGroup && (
                <UserAvatar src={sender?.avatar} fallback={sender?.name || ''} className="h-8 w-8 mb-1" />
              )}
              
              <div className={cn(
                "max-w-[80%] group relative flex flex-col",
                isMe ? "items-end" : "items-start"
              )}>
                {isGroup && !isMe && (
                  <span className="text-[10px] font-bold text-primary ml-1 mb-1 block">
                    {sender?.name}
                  </span>
                )}
                
                <div className={cn(
                  "px-3.5 py-2.5 rounded-2xl shadow-sm text-sm relative transition-all",
                  isMe 
                    ? "bg-[#3390ec] text-white rounded-br-none" 
                    : "bg-background border rounded-bl-none"
                )}>
                  {msg.type === 'text' && <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                  {msg.type === 'image' && (
                    <div className="space-y-2 -mx-1 -my-1">
                      <img src={msg.fileUrl} alt="sent" className="rounded-xl max-h-72 w-full object-cover shadow-sm" />
                      {msg.text && <p className="p-1">{msg.text}</p>}
                    </div>
                  )}
                  {msg.type === 'voice' && (
                    <div className="flex items-center gap-3 min-w-[180px] py-1">
                      <button className={cn(
                        "rounded-full p-2.5 transition-colors",
                        isMe ? "bg-white/20 hover:bg-white/30" : "bg-primary/10 hover:bg-primary/20"
                      )}>
                        <Send size={18} className="rotate-90 fill-current" />
                      </button>
                      <div className="flex-1 space-y-1">
                        <div className={cn(
                          "h-1 rounded-full relative overflow-hidden",
                          isMe ? "bg-white/30" : "bg-primary/20"
                        )}>
                           <div className={cn("absolute inset-0 w-1/3", isMe ? "bg-white" : "bg-primary")} />
                        </div>
                        <div className="flex justify-between items-center text-[10px] opacity-70">
                          <span>0:02 / {msg.duration || '0:12'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className={cn(
                    "flex items-center justify-end gap-1 mt-1 text-[9px] font-medium uppercase",
                    isMe ? "text-white/80" : "text-muted-foreground/80"
                  )}>
                    <span>{formatTime(msg.timestamp)}</span>
                    {isMe && (msg.isRead ? <CheckCheck size={12} className="text-white" /> : <Check size={12} />)}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input Area */}
      <footer className="p-4 bg-background/90 backdrop-blur-md border-t">
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-2.5 hover:bg-muted rounded-full transition-colors text-muted-foreground">
              <Smile size={24} />
            </button>
            <button className="p-2.5 hover:bg-muted rounded-full transition-colors text-muted-foreground">
              <Paperclip size={24} />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Write a message..."
              className="w-full bg-muted/50 border-none rounded-2xl py-3 px-5 text-[15px] focus:ring-2 ring-primary/10 transition-all outline-none"
            />
          </div>

          <AnimatePresence mode="wait">
            {input.trim() ? (
              <motion.button
                key="send"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={handleSend}
                className="p-3 bg-[#3390ec] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Send size={22} className="ml-0.5" />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={() => {
                   setIsRecording(false);
                   onSendMessage('', 'voice', { duration: '0:05' });
                }}
                className={cn(
                  "p-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95",
                  isRecording ? "bg-red-500 text-white animate-pulse" : "bg-[#3390ec] text-white"
                )}
              >
                <Mic size={22} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </div>
  );
};