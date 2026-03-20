import React from 'react';
import { cn } from '../../lib/utils';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  fallback: string;
  status?: 'online' | 'offline' | 'away';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, alt, className, fallback, status }) => {
  return (
    <div className={cn("relative inline-block", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover border border-border"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-semibold uppercase">
          {fallback.substring(0, 2)}
        </div>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
            status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );
};