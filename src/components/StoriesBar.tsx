import React, { useState } from 'react';
import { Story } from '../types';
import { UserAvatar } from './ui/UserAvatar';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoriesBarProps {
  stories: Story[];
}

export const StoriesBar: React.FC<StoriesBarProps> = ({ stories }) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <>
      <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-2 px-4 no-scrollbar">
        <div className="flex flex-col items-center gap-1.5 min-w-[64px] cursor-pointer group">
          <div className="relative">
            <div className="h-16 w-16 border-2 border-dashed border-muted-foreground/30 p-1 rounded-full group-hover:border-primary transition-colors">
              <UserAvatar 
                fallback="JD" 
                className="h-full w-full"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-0.5 border-2 border-background shadow-sm shadow-primary/40 group-hover:scale-110 transition-transform">
              <Plus size={14} strokeWidth={3} />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">My Story</span>
        </div>

        {stories.map((story) => (
          <motion.button
            key={story.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedStory(story)}
            className="flex flex-col items-center gap-1.5 min-w-[64px]"
          >
            <div className="rounded-full p-0.5 border-2 border-primary/60 ring-2 ring-background ring-offset-0 bg-gradient-to-tr from-primary to-blue-300">
              <UserAvatar 
                src={story.userAvatar} 
                fallback={story.userName} 
                className="h-14 w-14 border border-background shadow-sm"
              />
            </div>
            <span className="text-[11px] font-semibold truncate w-16 text-center text-foreground/80 group-hover:text-primary transition-colors">
              {story.userName}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8"
          >
            <button 
              onClick={() => setSelectedStory(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-20"
            >
              <X size={24} />
            </button>

            <div className="relative w-full max-w-[450px] aspect-[9/16] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between gap-3 bg-gradient-to-b from-black/60 to-transparent z-10">
                <div className="flex items-center gap-3">
                  <UserAvatar src={selectedStory.userAvatar} fallback={selectedStory.userName} className="h-10 w-10 border-2 border-white/20" />
                  <div className="text-white">
                    <p className="font-bold text-sm">{selectedStory.userName}</p>
                    <p className="text-[10px] opacity-70">Recently</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full h-full">
                <img 
                  src={selectedStory.imageUrl} 
                  alt="story" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                    <input 
                      type="text" 
                      placeholder="Send a message..." 
                      className="flex-1 bg-white/10 border-none rounded-full py-2.5 px-5 text-sm text-white placeholder:text-white/50 focus:ring-1 ring-white/30 outline-none"
                    />
                    <button className="p-2.5 bg-primary rounded-full text-white">
                       <Plus size={20} className="rotate-45" />
                    </button>
                 </div>
              </div>

              {/* Progress bars */}
              <div className="absolute top-2 left-4 right-4 flex gap-1 z-20">
                <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    onAnimationComplete={() => setSelectedStory(null)}
                    className="h-full bg-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};