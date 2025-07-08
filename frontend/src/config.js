// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
};