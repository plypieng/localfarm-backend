import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils'; // Assuming @/lib maps to d:/Localfarm/localfarm-backend/lib

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date | string; // Can be Date object or ISO string
}

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const formatTimestamp = (timestamp: Date | string | undefined): string => {
    if (!timestamp) return '';
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-3 text-sm',
          isUser
            ? 'bg-green-600 text-white rounded-tr-none'
            : 'bg-gray-200 text-gray-800 rounded-tl-none',
          'shadow-md'
        )}
      >
        <div className="prose prose-sm text-inherit">
          <ReactMarkdown
            components={{
              // Customize Markdown rendering if needed
              // e.g., to open links in a new tab
              a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {message.createdAt && (
          <p className={cn('text-xs mt-1 opacity-70', isUser ? 'text-right' : 'text-left')}>
            {formatTimestamp(message.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
