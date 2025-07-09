import styled from 'styled-components';

// Dashboard Container
export const DashboardContainer = styled.div`
  background-color: #f5f7fa;
  min-height: 100vh;
`;

// Dashboard Header
export const DashboardHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

// Dashboard Title
export const DashboardTitle = styled.h1`
  font-size: 1.5em;
  color: #0A1828;
  margin: 0;
  font-weight: 600;
`;

// ChatGPT Link
export const ChatGPTLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #004080, #0066cc);
  color: white;
  text-decoration: none;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 64, 128, 0.3);
  }
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

// Dashboard Grid Layout
export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 0 20px 20px 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 10px 10px 10px;
    gap: 15px;
  }
`;

// Base Widget Container
export const Widget = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 64, 128, 0.1);
  will-change: transform;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 64, 128, 0.15);
    border-color: rgba(0, 64, 128, 0.3);
  }

  /* Animation on mount */
  animation: fadeIn 0.3s ease-out;
`;

// Widget Header
export const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid transparent;
  background: linear-gradient(90deg, rgba(0, 64, 128, 0.1) 0%, transparent 100%);
  border-radius: 8px;
  padding: 8px 12px;
`;

// Widget Title
export const WidgetTitle = styled.h3`
  font-size: 1em;
  font-weight: 600;
  color: #0A1828;
  margin: 0;
`;

// Widget Icon
export const WidgetIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #004080, #0066cc);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
`;

// Widget Content
export const WidgetContent = styled.div`
  flex: 1;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 64, 128, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(0, 64, 128, 0.5);
    }
  }
`;

// Specific Widget Variants
export const EmailWidget = styled(Widget)`
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

export const DriveWidget = styled(Widget)`
  grid-column: span 2;
  grid-row: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
    grid-row: span 1;
  }
`;

// Drive Files Container
export const DriveFiles = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

// Drive Item
export const DriveItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 64, 128, 0.05);
    padding-left: 15px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

// List Item (for tasks, lists, etc.)
export const ListItem = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  background: rgba(0, 64, 128, 0.02);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background: rgba(0, 64, 128, 0.05);
    border-color: rgba(0, 64, 128, 0.1);
    transform: translateX(5px);
  }
`;

// Button Style
export const ActionButton = styled.button`
  background: linear-gradient(135deg, #004080, #0066cc);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 64, 128, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Input Style
export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(0, 64, 128, 0.2);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 64, 128, 0.1);
  }
`;

// Email Item
export const EmailItem = styled(ListItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .email-sender {
    font-weight: 600;
    color: #0A1828;
  }
  
  .email-subject {
    color: #6c757d;
    font-size: 0.9em;
    margin-top: 4px;
  }
  
  .email-time {
    color: #6c757d;
    font-size: 0.85em;
    flex-shrink: 0;
    margin-left: 12px;
  }
`;

// AI Assistant specific styles
export const AIAssistantWidget = styled(Widget)`
  grid-column: span 2;
  grid-row: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
    grid-row: span 1;
  }
`;

export const ChatContainer = styled.div`
  flex: 1;
  background: #f8f8f8;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  overflow-y: auto;
  max-height: 400px;
`;

export const ChatInputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #004080;
  }
`;

export const SendButton = styled.button`
  width: 50px;
  height: 50px;
  background: #004080;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 20px;

  &:hover {
    background: #0A1828;
    transform: scale(1.1);
  }
`;

// Calendar Widget specific
export const CalendarWidget = styled(Widget)`
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

// Lists Widget
export const ListsWidget = styled(Widget)`
  min-height: 300px;
`;