import React, { useState } from 'react';
import styled from 'styled-components';
import DocumentCapture from './DocumentCapture';
import DocumentSearch from './DocumentSearch';

const WidgetContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TabContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const TabHeader = styled.div`
  display: flex;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
`;

const Tab = styled.button`
  flex: 1;
  padding: 16px 24px;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#0066cc' : '#666'};
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: ${props => props.active ? '2px solid #0066cc' : '2px solid transparent'};
  margin-bottom: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(0, 0, 0, 0.03)'};
    color: ${props => props.active ? '#0066cc' : '#333'};
  }
`;

const TabContent = styled.div`
  padding: 24px;
  min-height: 400px;
`;

const FeatureCard = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  margin-bottom: 24px;
`;

const FeatureTitle = styled.h3`
  color: #004080;
  margin-bottom: 16px;
  font-size: 24px;
`;

const FeatureDescription = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 24px;
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 32px;
`;

const FeatureItem = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: left;
`;

const FeatureIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
`;

const FeatureItemTitle = styled.h4`
  color: #333;
  margin-bottom: 8px;
`;

const FeatureItemText = styled.p`
  color: #666;
  font-size: 14px;
`;

function DocumentsWidget() {
  const [activeTab, setActiveTab] = useState('capture');

  const features = [
    {
      icon: '📸',
      title: 'Smart Capture',
      description: 'Take a photo or upload any document'
    },
    {
      icon: '🤖',
      title: 'AI Processing',
      description: 'Automatic text extraction and classification'
    },
    {
      icon: '☁️',
      title: 'Cloud Storage',
      description: 'Secure storage in Google Drive folders'
    },
    {
      icon: '🔍',
      title: 'Easy Search',
      description: 'Find documents by type, date, or content'
    }
  ];

  return (
    <WidgetContainer>
      <FeatureCard>
        <FeatureTitle>📄 Document Management System</FeatureTitle>
        <FeatureDescription>
          Capture, organize, and search your documents with AI-powered assistance.
          All documents are securely stored in your Google Drive.
        </FeatureDescription>
        
        <FeatureList>
          {features.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureItemTitle>{feature.title}</FeatureItemTitle>
              <FeatureItemText>{feature.description}</FeatureItemText>
            </FeatureItem>
          ))}
        </FeatureList>
      </FeatureCard>

      <TabContainer>
        <TabHeader>
          <Tab 
            active={activeTab === 'capture'} 
            onClick={() => setActiveTab('capture')}
          >
            <span>📸</span>
            Capture Document
          </Tab>
          <Tab 
            active={activeTab === 'search'} 
            onClick={() => setActiveTab('search')}
          >
            <span>🔍</span>
            Search Documents
          </Tab>
        </TabHeader>
        
        <TabContent>
          {activeTab === 'capture' ? (
            <DocumentCapture />
          ) : (
            <DocumentSearch />
          )}
        </TabContent>
      </TabContainer>
    </WidgetContainer>
  );
}

export default DocumentsWidget;