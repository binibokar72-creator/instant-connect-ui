import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { VideoCallOverlay } from './components/VideoCallOverlay';
import { useChat } from './hooks/useChat';
import { Toaster, toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from './lib/utils';
import './App.css';

function App() {
  const { 
    chats, 
    activeChat, 
    setActiveChatId, 
    sendMessage, 
    searchQuery, 
    setSearchQuery,
    stories,
    isCalling,
    callType,
    startCall,
    endCall
  } = useChat();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    document.title = 'B2';
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleSendMessage = (text: string, type: any = 'text', extra: any = {}) => {
    sendMessage(text, type, extra);
    if (type === 'text') {
      toast.success('Message sent securely');
    } else if (type === 'voice') {
      toast.info('Voice note sent');
    }
  };

  const activeUser = activeChat?.type === 'direct' ? activeChat.participants[0] : (activeChat?.participants[0]);

  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden font-sans antialiased text-foreground">
      {/* Sidebar - Hidden on mobile if chat is open */}
      <div className={cn(
        "h-full flex-shrink-0 border-r transition-all duration-300",
        isMobile ? (showChat ? "w-0 overflow-hidden" : "w-full") : "w-[400px]"
      )}>
        <Sidebar 
          chats={chats} 
          activeChatId={activeChat?.id || null} 
          onSelectChat={handleSelectChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          stories={stories}
        />
      </div>
      
      {/* Main Chat Area */}
      <main className={cn(
        "flex-1 h-full min-w-0 flex flex-col transition-all duration-300",
        isMobile && !showChat ? "hidden" : "flex"
      )}>
        {isMobile && showChat && (
          <div className="bg-background border-b p-2 flex items-center z-20">
            <button 
              onClick={() => setShowChat(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors flex items-center gap-1 text-primary"
            >
              <ChevronLeft size={24} />
              <span className="font-medium">Back</span>
            </button>
          </div>
        )}
        <ChatWindow 
          chat={activeChat} 
          onSendMessage={handleSendMessage}
          onStartCall={startCall}
        />
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {isCalling && (
          <VideoCallOverlay 
            user={activeUser} 
            type={callType} 
            onEnd={endCall} 
          />
        )}
      </AnimatePresence>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;