import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not found');
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://openrouter.ai',
          'X-Title': 'HeritageAR Chatbot'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo:free',
          messages: [
            {
              role: 'system',
              content: 'You are a knowledgeable assistant specializing in historical sites, cultural heritage, and archaeology. When asked about historical sites, provide accurate and concise information about their history, architecture, cultural significance, and interesting facts. Focus on being informative while keeping responses clear and engaging.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      let data;
      try {
        const responseData = await response.text();
        console.log('Raw API Response:', responseData);
        data = JSON.parse(responseData);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Failed to parse API response');
      }

      if (!response.ok) {
        console.error('OpenRouter API Error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        if (response.status === 404) {
          throw new Error('Model not available. Please try again later.');
        } else if (response.status === 402) {
          throw new Error('Usage limit exceeded. Please try again later.');
        }
        throw new Error(data.error?.message || `API request failed: ${response.status}`);
      }

      if (data.choices?.[0]?.message?.content) {
        const assistantMessage = data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('ChatBot error:', error);
      let errorMessage = 'An error occurred while processing your request.';
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the AI service. Please check your internet connection.';
      } else if (error.message.includes('API request failed: 404')) {
        errorMessage = 'The AI service is currently unavailable. Please try again later.';
      } else if (error.message.includes('API request failed: 429')) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error.message.includes('Usage limit exceeded')) {
        errorMessage = 'We are experiencing high demand. Please try again in a few minutes.';
      }
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I apologize, but ${errorMessage}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 p-4 bg-accent rounded-full shadow-lg hover:bg-accent/90 transition-colors z-50"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-heritage-900/95 backdrop-blur-sm border border-heritage-800/30 rounded-2xl shadow-xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-heritage-800/30 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Heritage Guide</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-heritage-800/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-heritage-300" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-accent text-white ml-4'
                        : 'bg-heritage-800/50 text-heritage-100 mr-4'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-heritage-800/50 text-heritage-100 p-3 rounded-2xl">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-heritage-800/30">
              <div className="flex items-end space-x-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about historical sites..."
                  className="flex-1 bg-heritage-800/50 text-heritage-100 rounded-lg p-3 min-h-[44px] max-h-32 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-3 bg-accent rounded-lg text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot; 