import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2, Users } from 'lucide-react';
import { User } from '../types';
import { UserAvatar } from './ui/UserAvatar';

interface VideoCallOverlayProps {
  user: User | undefined;
  type: 'video' | 'voice' | null;
  onEnd: () => void;
}

export const VideoCallOverlay: React.FC<VideoCallOverlayProps> = ({ user, type, onEnd }) => {
  if (!type || !user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col text-white"
    >
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-8 right-8 flex gap-4">
          <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <Maximize2 size={24} />
          </button>
          <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <Users size={24} />
          </button>
        </div>

        <div className="space-y-6 flex flex-col items-center">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              borderColor: ['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.5)', 'rgba(59, 130, 246, 0.2)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-2 border-4 rounded-full"
          >
            <UserAvatar src={user.avatar} fallback={user.name} className="h-40 w-40" />
          </motion.div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
            <p className="text-blue-400 font-medium tracking-widest animate-pulse">
              {type === 'video' ? 'VIDEO CALLING...' : 'VOICE CALLING...'}
            </p>
          </div>
        </div>

        {type === 'video' && (
          <div className="absolute bottom-32 right-8 w-48 h-64 bg-gray-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
               <VideoOff size={32} className="text-white/20" />
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="text-[10px] font-bold bg-black/50 px-2 py-0.5 rounded uppercase">You</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-12 flex items-center justify-center gap-8">
        <button className="p-5 bg-white/10 rounded-full hover:bg-white/20 transition-colors group">
          <MicOff size={28} className="group-hover:scale-110 transition-transform" />
        </button>
        <button className="p-5 bg-white/10 rounded-full hover:bg-white/20 transition-colors group">
          <VideoOff size={28} className="group-hover:scale-110 transition-transform" />
        </button>
        <button 
          onClick={onEnd}
          className="p-6 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-red-500/40 group"
        >
          <PhoneOff size={32} className="group-hover:rotate-[135deg] transition-transform duration-300" />
        </button>
      </div>
    </motion.div>
  );
};