// Enhanced AIAssistantWidget Component
// Changes:
// - Replaced all styled-components with Tailwind CSS for a modern, consistent UI.
// - Created a fully functional chat interface with distinct user/AI message bubbles.
// - Added full dark mode support (`dark:*` classes).
// - Implemented accessibility best practices (ARIA roles, focus rings, keyboard navigation).
// - Included a typing indicator and auto-scrolling for a better user experience.
// - Added smooth transitions for hover and focus states.

import React, { useState, useEffect, useRef } from 'react';

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-3">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
  </div>
);

function AIAssistantWidget() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! How can I assist you today?', time: '10:30 AM' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `This is a simulated response to: "${userMessage.text}"`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, aiResponse]);
    }, 2000);
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 h-full flex flex-col transition-shadow duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700" aria-labelledby="ai-assistant-widget-title">
      <header className="flex items-center justify-between mb-4">
        <h2 id="ai-assistant-widget-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
          AI Assistant
        </h2>
        <span className="text-2xl" role="img" aria-label="Robot icon">🤖</span>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px] pr-2 -mr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.map((message) => (
          message.sender === 'ai' ? (
            <div key={message.id} className="flex gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">AI</div>
              <div className="flex flex-col items-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2">{message.time}</span>
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex gap-3 justify-end">
              <div className="flex flex-col items-end">
                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 mr-2">{message.time}</span>
              </div>
            </div>
          )
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">AI</div>
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="
              flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-blue-500 focus:outline-none
            "
            placeholder="Ask anything..."
            aria-label="Chat input"
          />
          <button 
            type="submit" 
            className="
              px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm 
              hover:bg-blue-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              disabled:bg-blue-400 disabled:cursor-not-allowed
            "
            disabled={isTyping}
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}

export default AIAssistantWidget;