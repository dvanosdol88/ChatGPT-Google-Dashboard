import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  DriveWidget, 
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  ActionButton
} from './styled/WidgetStyles';
import { googleAPI } from '../api/api'; // Import googleAPI

// Styled components for Drive files display
const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background: #e9ecef;
    border-color: rgba(0, 102, 204, 0.2);
    transform: translateX(4px);
  }
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 24px;
  
  img {
    width: 32px;
    height: 32px;
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
`;

const FileMetadata = styled.div`
  font-size: 0.8em;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MetadataItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  
  .icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  
  &::after {
    content: '';
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #0066cc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// File type icons mapping
const FILE_TYPE_ICONS = {
  document: '📄',
  spreadsheet: '📊',
  presentation: '📊',
  pdf: '📕',
  image: '🖼️',
  video: '🎥',
  audio: '🎵',
  folder: '📁',
  default: '📎'
};

// Get appropriate icon for Google Workspace files
const getGoogleIcon = (mimeType) => {
  if (mimeType.includes('google-apps.document')) return '📝';
  if (mimeType.includes('google-apps.spreadsheet')) return '📊';
  if (mimeType.includes('google-apps.presentation')) return '📊';
  if (mimeType.includes('google-apps.form')) return '📋';
  if (mimeType.includes('google-apps.drawing')) return '🎨';
  return null;
};

function GoogleDriveWidget() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentFiles();
  }, []);

  const fetchRecentFiles = async () => {
    try {
      // Use googleAPI for the call
      const response = await googleAPI.getDriveFiles();
      
      if (response.data && response.data.files) {
        setFiles(response.data.files);
        setError(null);
      } else {
        setFiles([]);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching Drive files:', error);
      setError('Unable to fetch files. Make sure Google Drive API is configured.');
      
      // Mock data as fallback
      setFiles([
        {
          id: '1',
          name: 'Sample Document.docx',
          fileType: 'document',
          modifiedTime: new Date().toISOString(),
          size: '245 KB',
          owner: 'You',
          webViewLink: '#'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleFileClick = (file) => {
    if (file.webViewLink && file.webViewLink !== '#') {
      window.open(file.webViewLink, '_blank');
    }
  };

  const openDrive = () => {
    window.open('https://drive.google.com', '_blank');
  };

  const getFileIcon = (file) => {
    // Check for Google Workspace specific icons
    const googleIcon = getGoogleIcon(file.mimeType);
    if (googleIcon) return googleIcon;
    
    // Use file type icons
    return FILE_TYPE_ICONS[file.fileType] || FILE_TYPE_ICONS.default;
  };

  return (
    <DriveWidget>
      <WidgetHeader>
        <WidgetTitle>Recent Files</WidgetTitle>
        <WidgetIcon>📁</WidgetIcon>
      </WidgetHeader>
      <WidgetContent>
        {loading ? (
          <LoadingContainer />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#6c757d', marginBottom: '15px' }}>{error}</p>
            <ActionButton onClick={openDrive} style={{ fontSize: '14px' }}>
              Open Google Drive
            </ActionButton>
          </div>
        ) : files.length === 0 ? (
          <EmptyState>
            <div className="icon">📂</div>
            <h4>No recent files</h4>
            <p>Your Drive is empty or no files were modified recently</p>
            <ActionButton 
              onClick={openDrive}
              style={{ fontSize: '13px', padding: '8px 16px', marginTop: '16px' }}
            >
              Open Google Drive
            </ActionButton>
          </EmptyState>
        ) : (
          <>
            <FilesList>
              {files.map(file => (
                <FileItem key={file.id} onClick={() => handleFileClick(file)}>
                  <FileIcon>
                    {file.iconLink && file.iconLink.startsWith('http') ? (
                      <img src={file.iconLink} alt="" />
                    ) : (
                      <span>{getFileIcon(file)}</span>
                    )}
                  </FileIcon>
                  <FileInfo>
                    <FileName title={file.name}>{file.name}</FileName>
                    <FileMetadata>
                      <MetadataItem>
                        <span>🕐</span>
                        {formatDate(file.modifiedTime)}
                      </MetadataItem>
                      <MetadataItem>
                        <span>📏</span>
                        {file.size}
                      </MetadataItem>
                      {file.owner && (
                        <MetadataItem>
                          <span>👤</span>
                          {file.owner}
                        </MetadataItem>
                      )}
                    </FileMetadata>
                  </FileInfo>
                </FileItem>
              ))}
            </FilesList>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <ActionButton 
                onClick={openDrive}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                View All Files
              </ActionButton>
            </div>
          </>
        )}
      </WidgetContent>
    </DriveWidget>
  );
}

export default GoogleDriveWidget;