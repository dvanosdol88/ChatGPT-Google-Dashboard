import React, { useState } from 'react';
import { 
  WidgetContainer,
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  ActionButton
} from './styled/WidgetStyles';
import styled from 'styled-components';
import CameraCapture from './capture/CameraCapture';

const CameraButton = styled(ActionButton)`
  width: 100%;
  justify-content: center;
  padding: 15px;
  font-size: 16px;
  margin-bottom: 10px;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const RecentCapture = styled.div`
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 14px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #5f6368;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f1f3f4;
  }
`;

function CameraWidget() {
  const [showCapture, setShowCapture] = useState(false);
  const [lastCapture, setLastCapture] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);

  const handleCapture = (imageData) => {
    setLastCapture({
      image: imageData,
      timestamp: new Date().toLocaleString()
    });
  };

  const handleUploadComplete = (uploadData) => {
    setRecentUploads(prev => [{
      ...uploadData,
      timestamp: new Date().toLocaleString()
    }, ...prev.slice(0, 2)]); // Keep last 3 uploads
    setShowCapture(false);
  };

  return (
    <>
      <WidgetContainer>
        <WidgetHeader>
          <WidgetTitle>Document Scanner</WidgetTitle>
          <WidgetIcon>📸</WidgetIcon>
        </WidgetHeader>
        <WidgetContent>
          <CameraButton onClick={() => setShowCapture(true)}>
            📷 Scan Document
          </CameraButton>
          
          {lastCapture && (
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>
                Last Capture:
              </h4>
              <PreviewImage 
                src={lastCapture.image} 
                alt="Last captured document"
              />
              <small style={{ color: '#5f6368' }}>
                {lastCapture.timestamp}
              </small>
            </div>
          )}
          
          {recentUploads.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>
                Recent Uploads:
              </h4>
              {recentUploads.map((upload, index) => (
                <RecentCapture key={index}>
                  <div style={{ fontWeight: '500' }}>{upload.fileName}</div>
                  <small style={{ color: '#5f6368' }}>
                    📁 {upload.folderName} • {upload.timestamp}
                  </small>
                </RecentCapture>
              ))}
            </div>
          )}
        </WidgetContent>
      </WidgetContainer>
      
      {showCapture && (
        <Modal onClick={() => setShowCapture(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowCapture(false)}>
              ×
            </CloseButton>
            <CameraCapture 
              onCapture={handleCapture}
              onUploadComplete={handleUploadComplete}
            />
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default CameraWidget;