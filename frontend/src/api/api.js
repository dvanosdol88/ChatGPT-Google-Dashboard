import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for authentication (future use)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Task API
export const taskAPI = {
  getAll: (status) => {
    const params = status ? { status } : {};
    return apiClient.get(API_ENDPOINTS.tasks, { params });
  },
  
  getById: (id) => apiClient.get(API_ENDPOINTS.task(id)),
  
  create: (task) => apiClient.post(API_ENDPOINTS.tasks, task),
  
  update: (id, updates) => apiClient.patch(API_ENDPOINTS.task(id), updates),
  
  toggle: (id) => apiClient.patch(API_ENDPOINTS.toggleTask(id)),
  
  delete: (id) => apiClient.delete(API_ENDPOINTS.task(id)),
  
  createBulk: (tasks) => apiClient.post(API_ENDPOINTS.bulkTasks, { tasks })
};

// List API
export const listAPI = {
  getAll: () => apiClient.get(API_ENDPOINTS.lists),
  
  getById: (id) => apiClient.get(API_ENDPOINTS.list(id)),
  
  create: (list) => apiClient.post(API_ENDPOINTS.lists, list),
  
  delete: (id) => apiClient.delete(API_ENDPOINTS.list(id)),
  
  addItem: (listId, item) => apiClient.post(API_ENDPOINTS.listItems(listId), item),
  
  updateItem: (listId, itemId, updates) => 
    apiClient.patch(API_ENDPOINTS.listItem(listId, itemId), updates),
  
  toggleItem: (listId, itemId) => 
    apiClient.patch(API_ENDPOINTS.toggleListItem(listId, itemId)),
  
  deleteItem: (listId, itemId) => 
    apiClient.delete(API_ENDPOINTS.listItem(listId, itemId))
};

// AI API
export const aiAPI = {
  generateTask: (params) => apiClient.post(API_ENDPOINTS.generateTask, params),
  
  generateTasks: (params) => apiClient.post(API_ENDPOINTS.generateTasks, params),
  
  analyzeImage: (imageUrl, prompt) => 
    apiClient.post(API_ENDPOINTS.analyzeImage, { imageUrl, prompt })
};

// Google Services API
export const googleAPI = {
  getDriveFiles: () => apiClient.get(API_ENDPOINTS.driveFiles),
  
  getGmailMessages: () => apiClient.get(API_ENDPOINTS.gmailMessages),
  
  getCalendarEvents: () => apiClient.get(API_ENDPOINTS.calendarEvents),
  
  uploadAndAnalyze: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(API_ENDPOINTS.uploadAnalyze, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Camera capture endpoints
  captureOCR: (data) => apiClient.post(API_ENDPOINTS.captureOCR, data),
  
  getCaptureFolders: (params) => apiClient.get(API_ENDPOINTS.captureFolders, { params }),
  
  uploadCapture: (formData, config = {}) => {
    return apiClient.post(API_ENDPOINTS.captureUpload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    });
  }
};

// Health check
export const healthCheck = () => apiClient.get(API_ENDPOINTS.health);

export default apiClient;