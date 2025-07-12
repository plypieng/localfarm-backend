'use client';

import React, { useEffect, useRef } from 'react';
import ChatBubble from '@/components/ChatBubble'; // Assuming @/components maps to d:/Localfarm/localfarm-backend/components
import ChatInput from '@/components/ChatInput';   // Assuming @/components maps to d:/Localfarm/localfarm-backend/components
import { useChatStream } from '@/hooks/useChatStream'; // Assuming @/hooks maps to d:/Localfarm/localfarm-backend/hooks
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { messages, isLoading, error, sendMessage } = useChatStream();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to bottom every time messages update

  return (
    <div className={cn('flex flex-col h-screen bg-gray-50')}> 
      <header className="bg-green-700 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold text-center">LocalFarm AI Chat</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-100">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} /> {/* Anchor for scrolling */} 
        {error && (
          <div className="text-center text-red-500 p-2 bg-red-100 border border-red-500 rounded-md">
            <p>Error: {error}</p>
          </div>
        )}
      </main>

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
