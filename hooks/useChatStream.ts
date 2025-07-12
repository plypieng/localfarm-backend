import { useState, useEffect, useCallback } from 'react';
import { type ChatMessage } from '@/components/ChatBubble'; // Assuming @/components maps to d:/Localfarm/localfarm-backend/components

// Define the shape of messages in the history for API communication
interface ApiHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial chat history
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat/history');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch chat history');
        }
        const historyData = await response.json() as ChatMessage[];
        // Ensure createdAt is a Date object if it's a string
        const formattedHistory = historyData.map(msg => ({
          ...msg,
          createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
        }));
        setMessages(formattedHistory);
      } catch (err: any) {
        console.error('Error fetching history:', err);
        setError(err.message || 'An unknown error occurred while fetching history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const sendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput.trim(),
      createdAt: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsLoading(true);
    setError(null);

    // Prepare history for the API (last N messages, excluding the system prompt if any)
    const historyForApi: ApiHistoryMessage[] = messages
      .slice(-10) // Send last 10 messages as history context
      .map(msg => ({ role: msg.role, content: msg.content }));

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput.trim(), history: historyForApi }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown API error' }));
        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';
      const assistantMessageId = (Date.now() + 1).toString();

      // Add a placeholder for the assistant's message to update in real-time
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '▋', // Placeholder for streaming, e.g., a blinking cursor or ellipsis
          createdAt: new Date(),
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedResponse + '▋' } // Append chunk and cursor
              : msg
          )
        );
      }
      
      // Final update to remove cursor/placeholder from assistant message
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: accumulatedResponse.trim() } 
            : msg
        )
      );

    } catch (err: any) {
      console.error('Error sending message or streaming response:', err);
      setError(err.message || 'An unknown error occurred.');
      // Optionally add an error message to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${err.message || 'Please try again.'}`,
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]); // Include messages in dependency array for historyForApi

  return { messages, isLoading, error, sendMessage };
}
