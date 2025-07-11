import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { googleAPI } from '../../api/api';

const CaptureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  display: ${props => props.hidden ? 'none' : 'block'};
`;

const Canvas = styled.canvas`
  width: 100%;
  height: auto;
  display: ${props => props.hidden ? 'none' : 'block'};
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CaptureButton = styled(Button)`
  background: #4285f4;
  color: white;
  
  &:hover:not(:disabled) {
    background: #3367d6;
  }
`;

const RetakeButton = styled(Button)`
  background: #f1f3f4;
  color: #5f6368;
  
  &:hover:not(:disabled) {
    background: #e8eaed;
  }
`;

const UploadButton = styled(Button)`
  background: #34a853;
  color: white;
  
  &:hover:not(:disabled) {
    background: #2e9444;
  }
`;

const StatusMessage = styled.div`
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
  width: 100%;
  
  &.success {
    background: #e6f4ea;
    color: #1e8e3e;
  }
  
  &.error {
    background: #fce8e6;
    color: #d33b27;
  }
  
  &.info {
    background: #e8f0fe;
    color: #1967d2;
  }
`;

const OCRPreview = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e8eaed;
`;

const OCRText = styled.pre`
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 10px 0;
  max-height: 200px;
  overflow-y: auto;
`;

const FolderSuggestions = styled.div`
  margin-top: 15px;
`;

const FolderOption = styled.label`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: white;
  border: 1px solid #e8eaed;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    border-color: #4285f4;
  }
  
  input {
    margin-right: 10px;
  }
`;

function CameraCapture({ onCapture, onUploadComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [folderSuggestions, setFolderSuggestions] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCaptured(false);
      setStatus(null);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setStatus({
        type: 'error',
        message: 'Unable to access camera. Please check permissions.'
      });
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0);
    
    // Convert to base64
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImageData(dataUrl);
    setCaptured(true);
    
    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Trigger OCR
    performOCR(dataUrl);
    
    if (onCapture) {
      onCapture(dataUrl);
    }
  };

  const retake = () => {
    setCaptured(false);
    setImageData(null);
    setOcrText('');
    setFolderSuggestions([]);
    setSelectedFolder('');
    startCamera();
  };

  const performOCR = async (imageDataUrl) => {
    setLoading(true);
    setStatus({ type: 'info', message: 'Extracting text from image...' });
    
    try {
      // Call backend OCR endpoint
      const response = await googleAPI.captureOCR({
        image: imageDataUrl
      });
      
      if (response.data.success) {
        setOcrText(response.data.text);
        
        // Get folder suggestions based on extracted text
        const folderResponse = await googleAPI.getCaptureFolders({
          documentType: response.data.documentType,
          keywords: response.data.keywords?.join(',')
        });
        
        if (folderResponse.data.folders) {
          setFolderSuggestions(folderResponse.data.folders);
          if (folderResponse.data.folders.length > 0) {
            setSelectedFolder(folderResponse.data.folders[0].id);
          }
        }
        
        setStatus({ type: 'success', message: 'Text extracted successfully!' });
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setStatus({ 
        type: 'error', 
        message: 'Failed to extract text. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadToGoogleDrive = async () => {
    if (!imageData || !selectedFolder) {
      setStatus({ 
        type: 'error', 
        message: 'Please select a folder for upload.' 
      });
      return;
    }
    
    setLoading(true);
    setStatus({ type: 'info', message: 'Uploading to Google Drive...' });
    
    try {
      // Create form data
      const formData = new FormData();
      
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      formData.append('file', blob, `scan_${Date.now()}.jpg`);
      formData.append('folderId', selectedFolder);
      formData.append('ocrText', ocrText);
      formData.append('metadata', JSON.stringify({
        capturedAt: new Date().toISOString(),
        source: 'ChatGPT Dashboard Camera'
      }));
      
      // Upload to backend
      const uploadResponse = await googleAPI.uploadCapture(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setStatus({ 
            type: 'info', 
            message: `Uploading... ${percentCompleted}%` 
          });
        }
      });
      
      if (uploadResponse.data.success) {
        setStatus({ 
          type: 'success', 
          message: 'Document uploaded successfully!' 
        });
        
        if (onUploadComplete) {
          onUploadComplete(uploadResponse.data);
        }
        
        // Reset after successful upload
        setTimeout(() => {
          retake();
        }, 2000);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      setStatus({ 
        type: 'error', 
        message: 'Failed to upload document. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CaptureContainer>
      <h2>📸 Document Capture</h2>
      
      <VideoContainer>
        <Video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          hidden={captured}
        />
        <Canvas 
          ref={canvasRef} 
          hidden={!captured}
        />
      </VideoContainer>
      
      <Controls>
        {!captured ? (
          <CaptureButton onClick={captureImage} disabled={!stream}>
            📷 Capture Document
          </CaptureButton>
        ) : (
          <>
            <RetakeButton onClick={retake} disabled={loading}>
              🔄 Retake
            </RetakeButton>
            <UploadButton 
              onClick={uploadToGoogleDrive} 
              disabled={loading || !selectedFolder}
            >
              ☁️ Upload to Drive
            </UploadButton>
          </>
        )}
      </Controls>
      
      {status && (
        <StatusMessage className={status.type}>
          {status.message}
        </StatusMessage>
      )}
      
      {ocrText && (
        <OCRPreview>
          <h4>📝 Extracted Text:</h4>
          <OCRText>{ocrText}</OCRText>
        </OCRPreview>
      )}
      
      {folderSuggestions.length > 0 && (
        <FolderSuggestions>
          <h4>📁 Select Destination Folder:</h4>
          {folderSuggestions.map(folder => (
            <FolderOption key={folder.id}>
              <input
                type="radio"
                name="folder"
                value={folder.id}
                checked={selectedFolder === folder.id}
                onChange={(e) => setSelectedFolder(e.target.value)}
              />
              <span>{folder.name}</span>
              {folder.suggestion && (
                <small style={{ marginLeft: '10px', color: '#5f6368' }}>
                  ({folder.suggestion})
                </small>
              )}
            </FolderOption>
          ))}
        </FolderSuggestions>
      )}
    </CaptureContainer>
  );
}

export default CameraCapture;