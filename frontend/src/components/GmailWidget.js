import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  EmailWidget, 
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  EmailItem,
  ActionButton
} from './styled/WidgetStyles';
import axios from 'axios';

// Additional styled components for email display
const EmailListContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
`;

const StyledEmailItem = styled(EmailItem)`
  position: relative;
  padding-left: ${props => props.isUnread ? '20px' : '16px'};
  
  ${props => props.isUnread && `
    &::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      background: #0066cc;
      border-radius: 50%;
    }
  `}
  
  ${props => props.isImportant && `
    .email-sender {
      &::after {
        content: '⭐';
        margin-left: 6px;
        font-size: 0.9em;
      }
    }
  `}
`;

const EmailSender = styled.div`
  font-weight: ${props => props.isUnread ? '600' : '400'};
  color: #333;
  margin-bottom: 2px;
`;

const EmailSubject = styled.div`
  font-weight: ${props => props.isUnread ? '500' : '400'};
  color: ${props => props.isUnread ? '#000' : '#555'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmailSnippet = styled.div`
  font-size: 0.85em;
  color: #6c757d;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmailTime = styled.div`
  font-size: 0.85em;
  color: #999;
  white-space: nowrap;
  margin-left: 12px;
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

function GmailWidget() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get('/api/google/gmail/messages');
      
      if (response.data && response.data.messages) {
        // Format the emails for display
        const formattedEmails = response.data.messages.map(email => {
          // Format timestamp
          const date = new Date(email.timestamp);
          const now = new Date();
          const diffMs = now - date;
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          let timeDisplay;
          if (diffMins < 60) {
            timeDisplay = diffMins <= 1 ? 'Just now' : `${diffMins} mins ago`;
          } else if (diffHours < 24) {
            timeDisplay = diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
          } else if (diffDays < 7) {
            timeDisplay = diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
          } else {
            timeDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
          
          return {
            id: email.id,
            sender: email.senderName || email.senderEmail,
            subject: email.subject,
            time: timeDisplay,
            snippet: email.snippet,
            isUnread: email.isUnread,
            isImportant: email.isImportant
          };
        });
        
        setEmails(formattedEmails);
        setError(null);
      } else {
        // No emails found
        setEmails([]);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Unable to fetch emails. Make sure Google API is configured.');
      // Use mock data as fallback
      setEmails([
        {
          id: '1',
          sender: 'System',
          subject: 'Gmail integration pending',
          time: 'Now',
          snippet: 'Configure Google OAuth credentials to see real emails.',
          isUnread: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = async (email) => {
    // Open email in Gmail
    window.open(`https://mail.google.com/mail/u/0/#inbox/${email.id}`, '_blank');
    
    // Mark as read if unread
    if (email.isUnread) {
      try {
        await axios.post(`/api/google/gmail/messages/${email.id}/markRead`);
        // Update local state
        setEmails(prevEmails => 
          prevEmails.map(e => 
            e.id === email.id ? { ...e, isUnread: false } : e
          )
        );
      } catch (error) {
        console.error('Error marking email as read:', error);
      }
    }
  };

  const openGmail = () => {
    window.open('https://mail.google.com', '_blank');
  };

  return (
    <EmailWidget>
      <WidgetHeader>
        <WidgetTitle>Gmail</WidgetTitle>
        <WidgetIcon>📧</WidgetIcon>
      </WidgetHeader>
      <WidgetContent>
        {loading ? (
          <p>Loading emails...</p>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#6c757d', marginBottom: '15px' }}>{error}</p>
            <ActionButton onClick={openGmail} style={{ fontSize: '14px' }}>
              Open Gmail
            </ActionButton>
          </div>
        ) : emails.length === 0 ? (
          <EmptyState>
            <div className="icon">📭</div>
            <h4>No emails found</h4>
            <p>Your inbox is empty or no emails match the criteria</p>
            <ActionButton 
              onClick={openGmail}
              style={{ fontSize: '13px', padding: '8px 16px', marginTop: '16px' }}
            >
              Open Gmail
            </ActionButton>
          </EmptyState>
        ) : (
          <>
            <EmailListContainer>
              {emails.map(email => (
                <StyledEmailItem 
                  key={email.id} 
                  onClick={() => handleEmailClick(email)}
                  isUnread={email.isUnread}
                  isImportant={email.isImportant}
                >
                  <div style={{ flex: 1 }}>
                    <EmailSender 
                      className="email-sender" 
                      isUnread={email.isUnread}
                    >
                      {email.sender}
                    </EmailSender>
                    <EmailSubject isUnread={email.isUnread}>
                      {email.subject}
                    </EmailSubject>
                    {email.snippet && (
                      <EmailSnippet>
                        {email.snippet}
                      </EmailSnippet>
                    )}
                  </div>
                  <EmailTime>{email.time}</EmailTime>
                </StyledEmailItem>
              ))}
            </EmailListContainer>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <ActionButton 
                onClick={openGmail}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                View All in Gmail
              </ActionButton>
            </div>
          </>
        )}
      </WidgetContent>
    </EmailWidget>
  );
}

export default GmailWidget;