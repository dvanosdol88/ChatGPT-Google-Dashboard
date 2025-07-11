import express from 'express';
import multer from 'multer';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import { Readable } from 'stream';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
  }
});

// OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials if refresh token exists
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
}

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// OCR endpoint - Extract text from image
router.post('/ocr', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image data provided' 
      });
    }
    
    // Remove data URL prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Preprocess image for better OCR results
    const processedBuffer = await sharp(buffer)
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();
    
    // Perform OCR using Tesseract.js
    const { data: { text } } = await Tesseract.recognize(
      processedBuffer,
      'eng',
      {
        logger: m => console.log('OCR Progress:', m)
      }
    );
    
    // Extract keywords and determine document type
    const keywords = extractKeywords(text);
    const documentType = determineDocumentType(text, keywords);
    
    res.json({
      success: true,
      text: text.trim(),
      keywords,
      documentType,
      confidence: 0.85 // Placeholder confidence score
    });
    
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process image' 
    });
  }
});

// Get folder suggestions based on document type
router.get('/folders', async (req, res) => {
  try {
    const { documentType, keywords } = req.query;
    
    // Get all folders from Google Drive
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id, name)',
      orderBy: 'name'
    });
    
    const folders = response.data.files || [];
    
    // Add suggestions based on document type
    const suggestedFolders = folders.map(folder => {
      const suggestion = getSuggestionScore(folder.name, documentType, keywords);
      return {
        id: folder.id,
        name: folder.name,
        suggestion: suggestion.reason,
        score: suggestion.score
      };
    });
    
    // Sort by suggestion score
    suggestedFolders.sort((a, b) => b.score - a.score);
    
    // Return top 5 suggestions
    res.json({
      success: true,
      folders: suggestedFolders.slice(0, 5)
    });
    
  } catch (error) {
    console.error('Folder Suggestion Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get folder suggestions' 
    });
  }
});

// Upload document to Google Drive
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { folderId, ocrText, metadata } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file provided' 
      });
    }
    
    // Prepare file metadata
    const fileMetadata = {
      name: `Scan_${new Date().toISOString().split('T')[0]}_${Date.now()}.jpg`,
      parents: folderId ? [folderId] : []
    };
    
    // Add OCR text as description if available
    if (ocrText) {
      fileMetadata.description = `OCR Text: ${ocrText.substring(0, 1000)}...`;
    }
    
    // Create file in Google Drive
    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.mimetype,
        body: Readable.from(file.buffer)
      },
      fields: 'id, name, webViewLink'
    });
    
    // Get folder name for response
    let folderName = 'My Drive';
    if (folderId) {
      try {
        const folderResponse = await drive.files.get({
          fileId: folderId,
          fields: 'name'
        });
        folderName = folderResponse.data.name;
      } catch (err) {
        console.warn('Could not get folder name:', err);
      }
    }
    
    res.json({
      success: true,
      fileId: driveResponse.data.id,
      fileName: driveResponse.data.name,
      webViewLink: driveResponse.data.webViewLink,
      folderName,
      message: 'Document uploaded successfully!'
    });
    
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload document' 
    });
  }
});

// Helper function to extract keywords from text
function extractKeywords(text) {
  // Simple keyword extraction - can be enhanced with NLP libraries
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));
  
  // Count word frequency
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // Return top keywords
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// Helper function to determine document type
function determineDocumentType(text, keywords) {
  const textLower = text.toLowerCase();
  
  // Check for specific document types
  if (textLower.includes('invoice') || textLower.includes('bill') || textLower.includes('payment')) {
    return 'invoice';
  }
  if (textLower.includes('receipt') || textLower.includes('purchase') || textLower.includes('transaction')) {
    return 'receipt';
  }
  if (textLower.includes('contract') || textLower.includes('agreement') || textLower.includes('terms')) {
    return 'contract';
  }
  if (textLower.includes('report') || textLower.includes('analysis') || textLower.includes('summary')) {
    return 'report';
  }
  if (textLower.includes('letter') || textLower.includes('dear') || textLower.includes('sincerely')) {
    return 'letter';
  }
  
  return 'document'; // Default type
}

// Helper function to get folder suggestion score
function getSuggestionScore(folderName, documentType, keywords) {
  const folderLower = folderName.toLowerCase();
  let score = 0;
  let reason = '';
  
  // Check for document type match
  if (folderLower.includes(documentType)) {
    score += 50;
    reason = `Matches ${documentType} type`;
  }
  
  // Check for keyword matches
  if (keywords) {
    const keywordArray = keywords.split(',');
    const matches = keywordArray.filter(keyword => 
      folderLower.includes(keyword.toLowerCase())
    );
    
    if (matches.length > 0) {
      score += matches.length * 10;
      reason = reason ? `${reason}, contains keywords` : 'Contains keywords';
    }
  }
  
  // Check for common folder patterns
  if (folderLower.includes('scan') || folderLower.includes('document')) {
    score += 5;
    reason = reason || 'General document folder';
  }
  
  return { score, reason: reason || 'General folder' };
}

export default router;