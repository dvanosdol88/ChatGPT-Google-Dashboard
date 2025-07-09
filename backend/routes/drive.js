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

// Initialize OAuth2 client for user-specific access
function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
  }

  return oauth2Client;
}

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

// GET /api/google/drive/recent-files
router.get('/recent-files', async (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // Query for 5 most recently modified files
    const response = await drive.files.list({
      pageSize: 5,
      orderBy: 'modifiedTime desc',
      fields: 'files(id, name, modifiedTime, mimeType, iconLink, webViewLink, size, owners, createdTime)',
      q: "trashed = false and mimeType != 'application/vnd.google-apps.folder'", // Exclude folders and trashed files
      spaces: 'drive'
    });
    
    if (!response.data.files || response.data.files.length === 0) {
      return res.json({ files: [] });
    }
    
    // Format the files for frontend display
    const formattedFiles = response.data.files.map(file => {
      // Determine file type category
      let fileType = 'document';
      const mimeType = file.mimeType;
      
      if (mimeType.includes('spreadsheet')) {
        fileType = 'spreadsheet';
      } else if (mimeType.includes('presentation')) {
        fileType = 'presentation';
      } else if (mimeType.includes('image')) {
        fileType = 'image';
      } else if (mimeType.includes('video')) {
        fileType = 'video';
      } else if (mimeType.includes('audio')) {
        fileType = 'audio';
      } else if (mimeType.includes('pdf')) {
        fileType = 'pdf';
      } else if (mimeType.includes('folder')) {
        fileType = 'folder';
      }
      
      // Format file size
      const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown size';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
      };
      
      return {
        id: file.id,
        name: file.name,
        modifiedTime: file.modifiedTime,
        createdTime: file.createdTime,
        mimeType: file.mimeType,
        fileType: fileType,
        iconLink: file.iconLink,
        webViewLink: file.webViewLink,
        size: formatFileSize(file.size),
        owner: file.owners && file.owners[0] ? file.owners[0].displayName : 'Unknown'
      };
    });
    
    res.json({ 
      files: formattedFiles,
      totalFiles: response.data.files.length 
    });
    
  } catch (error) {
    console.error('Error fetching recent files:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent files',
      details: error.message 
    });
  }
});

export default router;