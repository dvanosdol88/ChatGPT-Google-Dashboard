import React, { useState, useEffect } from 'react';
import { 
  DriveWidget, 
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  DriveFiles,
  DriveItem,
  ActionButton
} from './styled/WidgetStyles';
import { googleAPI } from '../api/api';

function GoogleDriveWidget() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDriveFiles();
  }, []);

  const fetchDriveFiles = async () => {
    try {
      const response = await googleAPI.getDriveFiles();
      // Mock data for now - replace with actual API response
      const mockFiles = [
        {
          id: '1',
          name: 'Dashboard Design.fig',
          type: 'figma',
          modifiedTime: '2024-01-09',
          webViewLink: '#',
          iconLink: '🎨'
        },
        {
          id: '2',
          name: 'Project Roadmap.docx',
          type: 'document',
          modifiedTime: '2024-01-08',
          webViewLink: '#',
          iconLink: '📄'
        },
        {
          id: '3',
          name: 'Budget 2024.xlsx',
          type: 'spreadsheet',
          modifiedTime: '2024-01-07',
          webViewLink: '#',
          iconLink: '📊'
        },
        {
          id: '4',
          name: 'Meeting Notes',
          type: 'folder',
          modifiedTime: '2024-01-06',
          webViewLink: '#',
          iconLink: '📁'
        },
        {
          id: '5',
          name: 'Architecture Diagram.png',
          type: 'image',
          modifiedTime: '2024-01-05',
          webViewLink: '#',
          iconLink: '🖼️'
        }
      ];
      setFiles(response.data?.files || mockFiles);
      setError(null);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Unable to fetch files. Make sure Google API is configured.');
      // Use mock data as fallback
      setFiles([
        {
          id: '1',
          name: 'Google Drive not connected',
          type: 'info',
          modifiedTime: 'Configure API',
          webViewLink: '#',
          iconLink: '⚠️'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = (file) => {
    if (file.webViewLink && file.webViewLink !== '#') {
      window.open(file.webViewLink, '_blank');
    } else {
      console.log('File clicked:', file);
    }
  };

  const openDrive = () => {
    window.open('https://drive.google.com', '_blank');
  };

  const getFileIcon = (file) => {
    if (file.iconLink && file.iconLink.startsWith('http')) {
      return <img src={file.iconLink} alt="" style={{ width: '20px', height: '20px' }} />;
    }
    return <span style={{ fontSize: '20px' }}>{file.iconLink || '📄'}</span>;
  };

  return (
    <DriveWidget>
      <WidgetHeader>
        <WidgetTitle>Google Drive</WidgetTitle>
        <WidgetIcon>📁</WidgetIcon>
      </WidgetHeader>
      <WidgetContent>
        {loading ? (
          <p>Loading files...</p>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#6c757d', marginBottom: '15px' }}>{error}</p>
            <ActionButton onClick={openDrive} style={{ fontSize: '14px' }}>
              Open Google Drive
            </ActionButton>
          </div>
        ) : (
          <>
            <DriveFiles>
              {files.map(file => (
                <DriveItem key={file.id} onClick={() => handleFileClick(file)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getFileIcon(file)}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{file.name}</div>
                      <div style={{ fontSize: '0.85em', color: '#6c757d' }}>
                        {file.modifiedTime}
                      </div>
                    </div>
                  </div>
                </DriveItem>
              ))}
            </DriveFiles>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <ActionButton 
                onClick={openDrive}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Open Drive
              </ActionButton>
            </div>
          </>
        )}
      </WidgetContent>
    </DriveWidget>
  );
}

export default GoogleDriveWidget;