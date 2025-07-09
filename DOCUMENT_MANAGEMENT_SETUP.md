# 📄 Document Management System Setup Guide

## Overview

The Document Management System allows you to capture documents using ChatGPT's camera functionality, extract text and metadata using AI, and organize them in Google Drive folders automatically.

## Features

- **📸 Smart Capture**: Take photos or upload documents directly
- **🤖 AI Processing**: Automatic text extraction and document classification
- **☁️ Organized Storage**: Documents are automatically organized in Google Drive folders by type
- **🔍 Powerful Search**: Find documents by type, date, content, or metadata

## Setup Instructions

### 1. Backend Configuration

The backend is already configured with the document routes. Make sure your backend server has the following endpoints:

- `POST /api/documents/store` - Upload and store documents
- `GET /api/documents/search` - Search documents
- `GET /api/documents/:fileId` - Get specific document

### 2. Google Drive Setup

The system will automatically create the following folder structure in your Google Drive:

```
Documents/
├── Bills/
├── Insurance/
├── Policies/
├── Receipts/
├── Contracts/
├── Tax Documents/
├── Medical Records/
└── Other Documents/
```

### 3. Environment Variables

Add these to your Render backend environment variables if not already present:

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

### 4. Usage Workflow

#### Capturing Documents

1. Click on the **Document Capture** tab
2. Either:
   - Drag and drop a document image
   - Click to select from your device
   - Use ChatGPT mobile app to take a photo
3. The system will display a preview
4. Fill in the metadata:
   - Document Type (automatically organizes into folders)
   - Date
   - Reference ID (auto-generated or custom)
   - Amount (for bills/receipts)
   - Notes
5. Click **Upload to Drive**

#### Searching Documents

1. Click on the **Document Search** tab
2. Enter search terms or use filters:
   - Search by content
   - Filter by document type
   - Filter by date range
3. Click **Search**
4. Results show with metadata and direct Drive links

### 5. ChatGPT Integration

When using ChatGPT to capture documents:

1. **Mobile App**: Use the camera feature to capture documents
2. **Prompt Example**: 
   ```
   "I'm uploading a photo of my insurance policy. Please extract the key information."
   ```
3. ChatGPT will:
   - Extract text using vision capabilities
   - Identify document type
   - Extract key metadata (dates, amounts, reference numbers)
   - Return structured JSON for storage

### 6. API Integration

The system uses these ChatGPT functions:

```javascript
// Function definition for ChatGPT
{
  "name": "storeDocument",
  "description": "Store a document in Google Drive with metadata",
  "parameters": {
    "type": "object",
    "properties": {
      "metadata": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "date": { "type": "string" },
          "reference_id": { "type": "string" },
          "amount": { "type": "string" },
          "notes": { "type": "string" },
          "text": { "type": "string" }
        }
      },
      "image_url": { "type": "string" }
    }
  }
}
```

## Security Considerations

- All documents are stored in your personal Google Drive
- API credentials are securely stored in environment variables
- Documents are only accessible with proper authentication
- No document content is stored in the database, only in Drive

## Troubleshooting

### "Failed to store document" Error
- Check Google Drive API credentials
- Ensure refresh token is valid
- Verify API quota hasn't been exceeded

### Documents not appearing in search
- Metadata files must be properly created
- Allow time for Drive indexing
- Check folder permissions

### Image upload issues
- Maximum file size: 10MB
- Supported formats: JPG, PNG, PDF
- Ensure stable internet connection

## Future Enhancements

- [ ] Batch document upload
- [ ] OCR improvement with Google Cloud Vision API
- [ ] Automatic expense categorization
- [ ] Document expiration reminders
- [ ] Integration with accounting software

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure Google Drive API is enabled in Google Cloud Console
4. Check Drive storage quota