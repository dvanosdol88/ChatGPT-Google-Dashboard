# ChatGPT-Google Dashboard

A comprehensive dashboard integrating ChatGPT with Google services (Drive, Gmail, Calendar) for seamless task and document management.

## Features

- **Google Drive Integration**: Store and manage tasks/lists in Google Drive
- **Gmail Integration**: Access and manage emails
- **Google Calendar Integration**: View and manage calendar events  
- **ChatGPT Integration**: AI-powered task generation and assistance
- **PostgreSQL Database**: Persistent task storage on Render
- **File Upload & Vision API**: Analyze images and documents

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL (Sequelize ORM)
- **Frontend**: React (to be implemented)
- **APIs**: OpenAI API, Google APIs (Drive, Gmail, Calendar)
- **Deployment**: Render

## Setup Instructions

### Prerequisites

1. Node.js (v18 or higher)
2. PostgreSQL database on Render
3. Google Cloud Platform project with APIs enabled
4. OpenAI API key

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with required variables:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_API_CREDENTIALS=path_to_google_credentials.json
   DATABASE_URL=your_render_postgresql_url
   PORT=5000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Health & Status
- `GET /api/health` - Health check with service status

### Task Management
- `GET /api/tasks` - Get all tasks (query: ?status=pending|completed)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/bulk` - Create multiple tasks

### List Management
- `GET /api/lists` - Get all lists with items
- `GET /api/lists/:id` - Get single list with items
- `POST /api/lists` - Create new list
- `DELETE /api/lists/:id` - Delete list
- `POST /api/lists/:id/items` - Add item to list
- `PATCH /api/lists/:listId/items/:itemId` - Update list item
- `PATCH /api/lists/:listId/items/:itemId/toggle` - Toggle item checked
- `DELETE /api/lists/:listId/items/:itemId` - Delete list item

### AI Integration
- `POST /api/ai/generate-task` - Generate single task with AI
- `POST /api/ai/generate-tasks` - Generate multiple tasks
- `POST /api/ai/analyze-image` - Analyze image with Vision API

### Google Services
- `GET /api/google/drive/files` - List Google Drive files
- `GET /api/google/gmail/messages` - List Gmail messages
- `GET /api/google/calendar/events` - List calendar events
- `POST /api/upload-analyze` - Upload and analyze files

## Database Schema

Tasks table:
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('pending', 'completed')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development Status

### ✅ Completed
- [x] Initial backend setup with Express
- [x] PostgreSQL database integration with Sequelize
- [x] Database models (Tasks, Lists, ListItems)
- [x] CRUD endpoints for tasks
- [x] CRUD endpoints for lists and list items
- [x] Google APIs integration structure
- [x] OpenAI task generation endpoints
- [x] File upload configuration with Multer
- [x] Environment variables setup
- [x] API documentation
- [x] Frontend React components (TaskList, TaskItem, AddTaskForm)
- [x] List management components (ListManager, ListDetail)
- [x] API client with axios
- [x] Service health monitoring
- [x] AI-powered task generation UI
- [x] Responsive design with CSS

### 🚧 In Progress
- [ ] Google OAuth implementation
- [ ] Full deployment to Render

### 📋 Next Steps
- [ ] Implement Google Drive sync for tasks
- [ ] Add authentication middleware
- [ ] Deploy to Render with PostgreSQL
- [ ] Add real-time updates with WebSockets

## Contributing

Please ensure all PRs include appropriate tests and documentation updates.