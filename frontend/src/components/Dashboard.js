import React from 'react';
import { 
  DashboardContainer,
  DashboardHeader,
  DashboardTitle,
  ChatGPTLink,
  DashboardGrid 
} from './styled/WidgetStyles';
import TasksWidget from './TasksWidget';
import GmailWidget from './GmailWidget';
import GoogleDriveWidget from './GoogleDriveWidget';
import MyListsWidget from './MyListsWidget';
import CalendarWidget from './CalendarWidget';
import DocumentsWidget from './DocumentsWidget';

function Dashboard({ healthStatus, refreshTasks, onTaskAdded }) {
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>ChatGPT-Google Dashboard</DashboardTitle>
        <ChatGPTLink 
          href="https://chat.openai.com" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.2819 9.8211C22.2819 5.9411 19.2619 2.7711 15.5219 2.7711C14.7119 2.7711 13.9319 2.9311 13.2119 3.2211C12.2119 1.8911 10.6419 1.0011 8.87195 1.0011C6.12195 1.0011 3.87195 3.2411 3.87195 6.0011C3.87195 6.3411 3.90195 6.6611 3.96195 6.9811C1.79195 7.8311 0.281952 10.0011 0.281952 12.5011C0.281952 15.8111 2.97195 18.5011 6.28195 18.5011C6.41195 18.5011 6.54195 18.5011 6.66195 18.4811C7.66195 20.2611 9.57195 21.5011 11.7819 21.5011C13.9319 21.5011 15.8019 20.3311 16.8219 18.6311C17.2219 18.7211 17.6319 18.7711 18.0619 18.7711C21.3719 18.7711 24.0619 16.0811 24.0619 12.7711C24.0619 11.2311 23.4319 9.8411 22.4219 8.8211C22.3719 9.1511 22.3219 9.4811 22.2819 9.8211Z" fill="white"/>
          </svg>
          Open ChatGPT
        </ChatGPTLink>
      </DashboardHeader>
      <DashboardGrid>
        <GmailWidget />
        <CalendarWidget />
        <TasksWidget 
          type="work" 
          refreshTasks={refreshTasks}
          onTaskAdded={onTaskAdded}
        />
        <TasksWidget 
          type="personal"
          refreshTasks={refreshTasks}
          onTaskAdded={onTaskAdded}
        />
        <MyListsWidget />
        <GoogleDriveWidget />
      </DashboardGrid>
      <div style={{ marginTop: '24px' }}>
        <DocumentsWidget />
      </div>
    </DashboardContainer>
  );
}

export default Dashboard;