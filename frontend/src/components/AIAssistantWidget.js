import React, { useState, useRef, useEffect } from 'react';
import { 
  AIAssistantWidget as StyledWidget,
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  ChatContainer,
  ChatInputContainer,
  ChatInput,
  SendButton
} from './styled/WidgetStyles';
import { aiAPI } from '../api/api';

function AIAssistantWidget({ healthStatus }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Use the generateTask endpoint to get AI response
      const response = await aiAPI.generateTask({ 
        prompt: inputValue,
        count: 1 
      });

      const aiResponse = {
        id: Date.now() + 1,
        text: response.data.tasks?.[0] || response.data.message || "I'm here to help! You can ask me to generate tasks, organize your schedule, or help with productivity tips.",
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: healthStatus?.services?.openai === 'configured' 
          ? "I encountered an error processing your request. Please try again."
          : "AI service is not configured. Please add your OpenAI API key to enable this feature.",
        sender: 'ai'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isAIConfigured = healthStatus?.services?.openai === 'configured';

  return (
    <StyledWidget>
      <WidgetHeader>
        <WidgetTitle>
          AI Assistant 
          <span style={{ 
            marginLeft: '8px',
            fontSize: '10px',
            color: isAIConfigured ? '#28a745' : '#dc3545'
          }}>
            ●
          </span>
        </WidgetTitle>
        <WidgetIcon>🤖</WidgetIcon>
      </WidgetHeader>
      <WidgetContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <ChatContainer ref={chatContainerRef}>
          {messages.map(message => (
            <div
              key={message.id}
              style={{
                marginBottom: '12px',
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  backgroundColor: message.sender === 'user' ? '#004080' : '#e9ecef',
                  color: message.sender === 'user' ? 'white' : '#0A1828',
                  wordWrap: 'break-word'
                }}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                padding: '10px 15px',
                borderRadius: '15px',
                backgroundColor: '#e9ecef',
                color: '#6c757d'
              }}>
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </ChatContainer>
        <ChatInputContainer>
          <ChatInput
            type="text"
            placeholder={isAIConfigured ? "Ask me anything..." : "Configure OpenAI API to enable"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isAIConfigured || isLoading}
          />
          <SendButton 
            onClick={sendMessage}
            disabled={!isAIConfigured || isLoading || !inputValue.trim()}
          >
            ➤
          </SendButton>
        </ChatInputContainer>
      </WidgetContent>
    </StyledWidget>
  );
}

export default AIAssistantWidget;