// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://chatgpt-dashboard-backend.onrender.com/api'  // Backend URL
    : 'http://localhost:5000/api');

// Debug logging
console.log('API Configuration:', {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: API_BASE_URL
});

// API Endpoints
export const API_ENDPOINTS = {
  // Health
  health: '/health',
  
  // Tasks
  tasks: '/tasks',
  task: (id) => `/tasks/${id}`,
  toggleTask: (id) => `/tasks/${id}/toggle`,
  bulkTasks: '/tasks/bulk',
  
  // Lists
  lists: '/lists',
  list: (id) => `/lists/${id}`,
  listItems: (listId) => `/lists/${listId}/items`,
  listItem: (listId, itemId) => `/lists/${listId}/items/${itemId}`,
  toggleListItem: (listId, itemId) => `/lists/${listId}/items/${itemId}/toggle`,
  
  // AI
  generateTask: '/ai/generate-task',
  generateTasks: '/ai/generate-tasks',
  analyzeImage: '/ai/analyze-image',
  
  // Google Services
  driveFiles: '/google/drive/files',
  gmailMessages: '/google/gmail/messages',
  calendarEvents: '/google/calendar/events',
  uploadAnalyze: '/upload-analyze'
};// Force rebuild: Thu Jul 10 12:25:51 EDT 2025
