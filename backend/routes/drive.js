import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_API_CREDENTIALS || '{}'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

// Fetch file content from Google Drive
async function fetchDriveFileContent(fileId) {
  try {
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const res = await drive.files.get({
      fileId: fileId,
      alt: 'media'
    }, { responseType: 'stream' });

    let content = '';
    return new Promise((resolve, reject) => {
      res.data
        .on('data', chunk => content += chunk)
        .on('end', () => resolve(content))
        .on('error', err => reject(err));
    });
  } catch (error) {
    console.error('Error fetching file from Drive:', error);
    throw error;
  }
}

// GET /api/google/drive/work-tasks
router.get('/work-tasks', async (req, res) => {
  try {
    // You'll need to set these file IDs in your environment variables
    const fileId = process.env.DRIVE_WORK_TASKS_FILE_ID;
    if (!fileId) {
      return res.status(400).json({ error: 'Work tasks file ID not configured' });
    }
    
    const content = await fetchDriveFileContent(fileId);
    res.send(content);
  } catch (err) {
    console.error('Failed to fetch work tasks:', err);
    res.status(500).json({ error: 'Failed to fetch work tasks' });
  }
});

// GET /api/google/drive/personal-tasks
router.get('/personal-tasks', async (req, res) => {
  try {
    const fileId = process.env.DRIVE_PERSONAL_TASKS_FILE_ID;
    if (!fileId) {
      return res.status(400).json({ error: 'Personal tasks file ID not configured' });
    }
    
    const content = await fetchDriveFileContent(fileId);
    res.send(content);
  } catch (err) {
    console.error('Failed to fetch personal tasks:', err);
    res.status(500).json({ error: 'Failed to fetch personal tasks' });
  }
});

// GET /api/google/drive/lists/:listName
router.get('/lists/:listName', async (req, res) => {
  try {
    const { listName } = req.params;
    // Map list names to file IDs (you can store these in env vars)
    const listFileIds = {
      'shopping': process.env.DRIVE_SHOPPING_LIST_FILE_ID,
      'reading': process.env.DRIVE_READING_LIST_FILE_ID,
      'projects': process.env.DRIVE_PROJECTS_LIST_FILE_ID
    };
    
    const fileId = listFileIds[listName];
    if (!fileId) {
      return res.status(400).json({ error: `List '${listName}' not configured` });
    }
    
    const content = await fetchDriveFileContent(fileId);
    res.send(content);
  } catch (err) {
    console.error(`Failed to fetch ${req.params.listName} list:`, err);
    res.status(500).json({ error: `Failed to fetch ${req.params.listName} list` });
  }
});

export default router;