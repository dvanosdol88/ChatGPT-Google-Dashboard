import express from 'express';
import { google } from 'googleapis';

const router = express.Router();

// Initialize OAuth2 client
function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Set credentials if we have a refresh token
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
  }

  return oauth2Client;
}

// Helper function to decode base64url
function decodeBase64Url(data) {
  // Replace URL-safe characters with standard base64 characters
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  // Decode base64
  return Buffer.from(base64, 'base64').toString('utf-8');
}

// Helper function to extract email body from payload
function extractEmailBody(payload) {
  let body = '';
  
  // Check if the payload has parts
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body.data) {
        body = decodeBase64Url(part.body.data);
        break;
      } else if (part.mimeType === 'text/html' && part.body.data && !body) {
        // Use HTML as fallback if no plain text
        body = decodeBase64Url(part.body.data);
        // Simple HTML stripping
        body = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      } else if (part.parts) {
        // Recursively check nested parts
        body = extractEmailBody(part);
        if (body) break;
      }
    }
  } else if (payload.body && payload.body.data) {
    body = decodeBase64Url(payload.body.data);
  }
  
  return body;
}

// Helper function to extract header value
function getHeaderValue(headers, name) {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : '';
}

// Get list of recent emails with full details
router.get('/messages', async (req, res) => {
  try {
    const auth = getOAuth2Client();
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Step 1: Get list of message IDs
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
      q: 'is:unread OR is:important', // Get unread or important emails
      orderBy: 'internalDate desc'
    });
    
    if (!listResponse.data.messages || listResponse.data.messages.length === 0) {
      return res.json({ messages: [] });
    }
    
    // Step 2: Fetch full details for each message
    const messagePromises = listResponse.data.messages.map(async (message) => {
      try {
        const messageResponse = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });
        
        const msg = messageResponse.data;
        const payload = msg.payload;
        const headers = payload.headers || [];
        
        // Extract email details
        const from = getHeaderValue(headers, 'From');
        const subject = getHeaderValue(headers, 'Subject');
        const date = getHeaderValue(headers, 'Date');
        const body = extractEmailBody(payload);
        
        // Create a snippet from the body
        const snippet = body.substring(0, 150).trim() + (body.length > 150 ? '...' : '');
        
        // Parse sender name and email
        const fromMatch = from.match(/^(.*?)\s*<(.+?)>$/);
        const senderName = fromMatch ? fromMatch[1].replace(/"/g, '') : from;
        const senderEmail = fromMatch ? fromMatch[2] : from;
        
        return {
          id: msg.id,
          threadId: msg.threadId,
          from: from,
          senderName: senderName,
          senderEmail: senderEmail,
          subject: subject || '(No subject)',
          snippet: snippet || msg.snippet,
          date: date,
          timestamp: parseInt(msg.internalDate),
          isUnread: msg.labelIds && msg.labelIds.includes('UNREAD'),
          isImportant: msg.labelIds && msg.labelIds.includes('IMPORTANT'),
          labels: msg.labelIds || []
        };
      } catch (error) {
        console.error(`Error fetching message ${message.id}:`, error);
        return null;
      }
    });
    
    const messages = await Promise.all(messagePromises);
    const validMessages = messages.filter(msg => msg !== null);
    
    res.json({ 
      messages: validMessages,
      resultSizeEstimate: listResponse.data.resultSizeEstimate
    });
    
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch messages',
      details: error.message 
    });
  }
});

// Mark email as read
router.post('/messages/:messageId/markRead', async (req, res) => {
  try {
    const auth = getOAuth2Client();
    const gmail = google.gmail({ version: 'v1', auth });
    const { messageId } = req.params;
    
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// Get single email details
router.get('/messages/:messageId', async (req, res) => {
  try {
    const auth = getOAuth2Client();
    const gmail = google.gmail({ version: 'v1', auth });
    const { messageId } = req.params;
    
    const messageResponse = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full'
    });
    
    const msg = messageResponse.data;
    const payload = msg.payload;
    const headers = payload.headers || [];
    
    // Extract full email body
    const body = extractEmailBody(payload);
    
    res.json({
      id: msg.id,
      threadId: msg.threadId,
      from: getHeaderValue(headers, 'From'),
      to: getHeaderValue(headers, 'To'),
      subject: getHeaderValue(headers, 'Subject'),
      date: getHeaderValue(headers, 'Date'),
      body: body,
      labels: msg.labelIds || []
    });
    
  } catch (error) {
    console.error('Error fetching message details:', error);
    res.status(500).json({ error: 'Failed to fetch message details' });
  }
});

export default router;