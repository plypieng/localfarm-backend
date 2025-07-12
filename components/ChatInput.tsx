import React, { useState, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils'; // Assuming @/lib maps to d:/Localfarm/localfarm-backend/lib

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
      event.preventDefault(); // Prevent newline in textarea
      handleSend();
    }
    // Ctrl+Enter or Shift+Enter will naturally create a newline due to textarea behavior
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-start space-x-3">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress} // Changed from onKeyPress to onKeyDown for better Enter key handling
          placeholder="Type your farming question here... (Ctrl+Enter for new line)"
          className={cn(
            'flex-1 p-3 border border-gray-300 rounded-lg resize-none min-h-[48px]',
            'focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow duration-150',
            'disabled:bg-gray-100 disabled:cursor-not-allowed'
          )}
          rows={1} // Start with 1 row, will auto-expand with content or newlines
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !inputMessage.trim()}
          className={cn(
            'px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-150',
            'bg-green-600 hover:bg-green-700',
            'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed'
          )}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
