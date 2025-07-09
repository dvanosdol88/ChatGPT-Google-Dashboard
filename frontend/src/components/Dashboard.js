import React from 'react';
import { DashboardGrid } from './styled/WidgetStyles';
import TasksWidget from './TasksWidget';
import GmailWidget from './GmailWidget';
import GoogleDriveWidget from './GoogleDriveWidget';
import AIAssistantWidget from './AIAssistantWidget';
import MyListsWidget from './MyListsWidget';
import CalendarWidget from './CalendarWidget';

function Dashboard({ healthStatus, refreshTasks, onTaskAdded }) {
  return (
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
      <AIAssistantWidget healthStatus={healthStatus} />
      <MyListsWidget />
      <GoogleDriveWidget />
    </DashboardGrid>
  );
}

export default Dashboard;