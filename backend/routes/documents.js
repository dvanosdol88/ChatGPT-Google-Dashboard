import express from 'express';
import { google } from 'googleapis';
import multer from 'multer';
import { Readable } from 'stream';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Google Drive client
function getDriveClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  return google.drive({ version: 'v3', auth });
}

// Document type to folder mapping
const DOCUMENT_FOLDERS = {
  bill: 'Bills',
  insurance: 'Insurance',
  policy: 'Policies',
  receipt: 'Receipts',
  contract: 'Contracts',
  tax: 'Tax Documents',
  medical: 'Medical Records',
  other: 'Other Documents'
};

// Get or create folder in Google Drive
async function getOrCreateFolder(drive, folderName, parentId = null) {
  try {
    // Search for existing folder
    const query = parentId 
      ? `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`
      : `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    if (response.data.files.length > 0) {
      return response.data.files[0].id;
    }

    // Create new folder
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId && { parents: [parentId] })
    };

    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id'
    });

    return folder.data.id;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

// Store document in Google Drive
router.post('/store', upload.single('image'), async (req, res) => {
  try {
    const drive = getDriveClient();
    const { metadata } = req.body;
    const parsedMetadata = JSON.parse(metadata);
    
    // Get or create main Documents folder
    const documentsFolderId = await getOrCreateFolder(drive, 'Documents');
    
    // Get or create document type folder
    const folderName = DOCUMENT_FOLDERS[parsedMetadata.type] || DOCUMENT_FOLDERS.other;
    const typeFolderId = await getOrCreateFolder(drive, folderName, documentsFolderId);
    
    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const referenceId = parsedMetadata.reference_id || `doc_${Date.now()}`;
    const filename = `${referenceId}_${timestamp}.jpg`;
    
    // Upload image to Drive
    const fileMetadata = {
      name: filename,
      parents: [typeFolderId]
    };
    
    const media = {
      mimeType: req.file.mimetype,
      body: Readable.from(req.file.buffer)
    };
    
    const uploadedFile = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink'
    });
    
    // Create metadata JSON file
    const metadataContent = {
      ...parsedMetadata,
      fileId: uploadedFile.data.id,
      fileName: filename,
      uploadDate: new Date().toISOString(),
      webViewLink: uploadedFile.data.webViewLink,
      webContentLink: uploadedFile.data.webContentLink
    };
    
    const metadataFilename = `${referenceId}_metadata.json`;
    const metadataMedia = {
      mimeType: 'application/json',
      body: Readable.from(JSON.stringify(metadataContent, null, 2))
    };
    
    await drive.files.create({
      requestBody: {
        name: metadataFilename,
        parents: [typeFolderId]
      },
      media: metadataMedia,
      fields: 'id'
    });
    
    res.json({
      success: true,
      fileId: uploadedFile.data.id,
      webViewLink: uploadedFile.data.webViewLink,
      metadata: metadataContent
    });
    
  } catch (error) {
    console.error('Error storing document:', error);
    res.status(500).json({ error: 'Failed to store document' });
  }
});

// Search documents
router.get('/search', async (req, res) => {
  try {
    const drive = getDriveClient();
    const { query, type, startDate, endDate } = req.query;
    
    // Build search query
    let searchQuery = "mimeType != 'application/vnd.google-apps.folder' and trashed = false";
    
    if (query) {
      searchQuery += ` and fullText contains '${query}'`;
    }
    
    if (type && DOCUMENT_FOLDERS[type]) {
      // Search within specific document type folder
      const documentsFolderId = await getOrCreateFolder(drive, 'Documents');
      const typeFolderId = await getOrCreateFolder(drive, DOCUMENT_FOLDERS[type], documentsFolderId);
      searchQuery += ` and '${typeFolderId}' in parents`;
    }
    
    // Execute search
    const response = await drive.files.list({
      q: searchQuery,
      fields: 'files(id, name, webViewLink, modifiedTime, parents)',
      orderBy: 'modifiedTime desc',
      pageSize: 50
    });
    
    // Filter by date if provided
    let files = response.data.files;
    if (startDate || endDate) {
      files = files.filter(file => {
        const fileDate = new Date(file.modifiedTime);
        if (startDate && fileDate < new Date(startDate)) return false;
        if (endDate && fileDate > new Date(endDate)) return false;
        return true;
      });
    }
    
    // Get metadata for each file
    const results = [];
    for (const file of files) {
      if (file.name.endsWith('_metadata.json')) {
        try {
          const metadataResponse = await drive.files.get({
            fileId: file.id,
            alt: 'media'
          });
          results.push(metadataResponse.data);
        } catch (error) {
          console.error('Error fetching metadata:', error);
        }
      }
    }
    
    res.json({ results });
    
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({ error: 'Failed to search documents' });
  }
});

// Get document by ID
router.get('/:fileId', async (req, res) => {
  try {
    const drive = getDriveClient();
    const { fileId } = req.params;
    
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, webViewLink, webContentLink, modifiedTime'
    });
    
    res.json(file.data);
    
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

export default router;