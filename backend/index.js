import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { google } from 'googleapis';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Import models and routes
import { sequelize, syncDatabase } from './models/index.js';
import taskRoutes from './routes/tasks.js';
import listRoutes from './routes/lists.js';
import aiRoutes from './routes/ai.js';
import driveRoutes from './routes/drive.js';
import documentsRoutes from './routes/documents.js';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Test database connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    // Sync database models (create tables if not exist)
    return syncDatabase();
  })
  .catch(err => console.error('Unable to connect to database:', err));

// OpenAI client initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Google OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials if available
if (process.env.GOOGLE_API_CREDENTIALS) {
  // For service account authentication
  process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_API_CREDENTIALS;
}

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/google/drive', driveRoutes);
app.use('/api/documents', documentsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      database: sequelize.connectionManager.pool ? 'connected' : 'disconnected',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      google: process.env.GOOGLE_API_CREDENTIALS ? 'configured' : 'not configured'
    }
  });
});

// Google Drive endpoints
app.get('/api/google/drive/files', async (req, res) => {
  try {
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const response = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name, mimeType, modifiedTime)'
    });
    res.json(response.data);
  } catch (error) {
    console.error('Drive API error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// File upload with Vision API integration
app.post('/api/upload-analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Here you would integrate with OpenAI Vision API
    // For now, returning file info
    res.json({
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      analysis: 'Vision API integration pending'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

// Gmail integration endpoint
app.get('/api/google/gmail/messages', async (req, res) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10
    });
    res.json(response.data);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Calendar integration endpoint
app.get('/api/google/calendar/events', async (req, res) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    });
    res.json(response.data);
  } catch (error) {
    console.error('Calendar API error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});