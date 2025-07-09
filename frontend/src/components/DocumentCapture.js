import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const CaptureContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
`;

const Title = styled.h2`
  color: #004080;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UploadArea = styled.div`
  border: 2px dashed rgba(0, 64, 128, 0.3);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragging ? 'rgba(0, 102, 204, 0.05)' : '#fafbfc'};

  &:hover {
    border-color: #0066cc;
    background: rgba(0, 102, 204, 0.05);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const UploadText = styled.p`
  color: #6c757d;
  font-size: 16px;
  margin-bottom: 8px;
`;

const FileTypes = styled.p`
  color: #999;
  font-size: 14px;
`;

const PreviewContainer = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
`;

const ImagePreview = styled.img`
  max-width: 300px;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MetadataForm = styled.div`
  flex: 1;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' ? '#0066cc' : '#6c757d'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#0052a3' : '#5a6268'};
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const ProcessingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ProcessingCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066cc;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
  border: 1px solid #c3e6cb;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
  border: 1px solid #f5c6cb;
`;

function DocumentCapture() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [metadata, setMetadata] = useState({
    type: 'other',
    date: new Date().toISOString().split('T')[0],
    reference_id: '',
    amount: '',
    notes: ''
  });

  const fileInputRef = useRef(null);

  const documentTypes = [
    { value: 'bill', label: '💵 Bill' },
    { value: 'insurance', label: '🏥 Insurance' },
    { value: 'policy', label: '📋 Policy' },
    { value: 'receipt', label: '🧾 Receipt' },
    { value: 'contract', label: '📄 Contract' },
    { value: 'tax', label: '📊 Tax Document' },
    { value: 'medical', label: '⚕️ Medical Record' },
    { value: 'other', label: '📁 Other' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSuccessMessage('');
    setErrorMessage('');
    
    // Auto-generate reference ID
    const timestamp = Date.now();
    setMetadata(prev => ({
      ...prev,
      reference_id: `DOC_${timestamp}`
    }));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleMetadataChange = (field, value) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const processDocument = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingStep('Analyzing document with AI...');
    setErrorMessage('');
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('metadata', JSON.stringify({
        ...metadata,
        text: extractedText
      }));

      setProcessingStep('Uploading to Google Drive...');
      
      // Upload document
      const response = await axios.post('/api/documents/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsProcessing(false);
      setSuccessMessage(`Document successfully stored! View it on Google Drive: ${response.data.webViewLink}`);
      
      // Reset form after successful upload
      setTimeout(() => {
        resetForm();
      }, 3000);
      
    } catch (error) {
      console.error('Error processing document:', error);
      setIsProcessing(false);
      setErrorMessage('Failed to process document. Please try again.');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedText('');
    setMetadata({
      type: 'other',
      date: new Date().toISOString().split('T')[0],
      reference_id: '',
      amount: '',
      notes: ''
    });
    setSuccessMessage('');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <CaptureContainer>
        <Title>
          <span>📸</span>
          Document Capture
        </Title>
        
        {!selectedFile ? (
          <UploadArea
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon>📷</Icon>
            <UploadText>
              Drag & drop your document here or click to select
            </UploadText>
            <FileTypes>
              Supports: JPG, PNG, PDF (max 10MB)
            </FileTypes>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileInputChange}
            />
          </UploadArea>
        ) : (
          <>
            <PreviewContainer>
              <ImagePreview src={previewUrl} alt="Document preview" />
              
              <MetadataForm>
                <h3 style={{ marginBottom: '16px', color: '#004080' }}>Document Details</h3>
                
                <FormGroup>
                  <Label>Document Type</Label>
                  <Select
                    value={metadata.type}
                    onChange={(e) => handleMetadataChange('type', e.target.value)}
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={metadata.date}
                    onChange={(e) => handleMetadataChange('date', e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Reference ID</Label>
                  <Input
                    type="text"
                    value={metadata.reference_id}
                    onChange={(e) => handleMetadataChange('reference_id', e.target.value)}
                    placeholder="e.g., INV-12345"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Amount (if applicable)</Label>
                  <Input
                    type="text"
                    value={metadata.amount}
                    onChange={(e) => handleMetadataChange('amount', e.target.value)}
                    placeholder="e.g., $123.45"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Notes</Label>
                  <TextArea
                    value={metadata.notes}
                    onChange={(e) => handleMetadataChange('notes', e.target.value)}
                    placeholder="Add any additional notes..."
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button variant="primary" onClick={processDocument}>
                    Upload to Drive
                  </Button>
                  <Button variant="secondary" onClick={resetForm}>
                    Cancel
                  </Button>
                </ButtonGroup>
              </MetadataForm>
            </PreviewContainer>
          </>
        )}

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </CaptureContainer>

      {isProcessing && (
        <ProcessingOverlay>
          <ProcessingCard>
            <Spinner />
            <h3>{processingStep}</h3>
            <p style={{ color: '#6c757d', marginTop: '12px' }}>
              Please wait while we process your document...
            </p>
          </ProcessingCard>
        </ProcessingOverlay>
      )}
    </>
  );
}

export default DocumentCapture;