import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../utils/gemini';
import { FiSend, FiUser } from 'react-icons/fi';
import { AiOutlineLoading3Quarters, AiOutlineRobot } from 'react-icons/ai';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      // Get AI response
      const response = await getGeminiResponse(userMessage);
      setMessages(prev => [...prev, { type: 'ai', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AiOutlineRobot className="text-2xl text-purple-400" />
            <h1 className="text-xl font-semibold text-white">AI Assistant</h1>
          </div>
          {/* <div className="text-xs text-gray-400">Powered by Gemini</div> */}
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 scroll-style">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <AiOutlineRobot className="text-6xl mx-auto mb-4 text-purple-400" />
              <p className="text-lg">How can I assist you today?</p>
              <p className="text-sm mt-2">Ask me anything...</p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 flex items-start space-x-3 ${
                message.type === 'user'
                  ? 'bg-purple-600 text-white'
                  : message.type === 'error'
                  ? 'bg-red-900 text-red-100'
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}
            >
              {message.type !== 'user' && (
                <div className="flex-shrink-0 mt-1">
                  <AiOutlineRobot className="text-lg text-purple-400" />
                </div>
              )}
              <div className="prose prose-sm prose-invert">
                {message.content}
              </div>
              {message.type === 'user' && (
                <div className="flex-shrink-0 mt-1">
                  <FiUser className="text-lg text-purple-300" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 shadow-md rounded-lg p-4 max-w-[80%] flex items-center space-x-3">
              <AiOutlineRobot className="text-lg text-purple-400" />
              <AiOutlineLoading3Quarters className="animate-spin text-purple-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-700 p-4 bg-gray-800"
      >
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`rounded-lg px-6 py-3 flex items-center justify-center ${
              isLoading || !input.trim()
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white transition-colors duration-200`}
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <FiSend />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface; 