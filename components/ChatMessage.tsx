
import React from 'react';
import { UserIcon } from './Icons';

export interface ChatMessageProps {
  isSender: boolean;
  translatedText: string;
  originalText?: string;
  avatarUrl?: string;
  theme?: 'light' | 'dark';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ isSender, translatedText, originalText, avatarUrl, theme = 'light' }) => {
  const bubbleClasses = isSender
    ? 'bg-blue-600 text-white rounded-t-xl rounded-bl-xl'
    : theme === 'dark'
    ? 'bg-gray-700 text-gray-200 rounded-t-xl rounded-br-xl'
    : 'bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl';
  
  const containerClasses = isSender ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex items-end gap-2.5 ${containerClasses}`}>
      {!isSender && (
         <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {avatarUrl ? (
                <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
                <UserIcon className="w-4 h-4 text-white" />
            )}
        </div>
      )}
      <div className={`max-w-[80%] px-4 py-3 rounded-xl ${bubbleClasses}`}>
        <p className="text-sm font-medium leading-snug">{translatedText}</p>
        {originalText && (
          <p className="text-xs opacity-75 mt-1 leading-snug">{originalText}</p>
        )}
      </div>
    </div>
  );
};
