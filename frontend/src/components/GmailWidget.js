import React, { useState, useEffect } from 'react';
import { 
  EmailWidget, 
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  EmailItem,
  ActionButton
} from './styled/WidgetStyles';
import { googleAPI } from '../api/api';

function GmailWidget() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await googleAPI.getGmailMessages();
      // Mock data for now - replace with actual API response handling
      const mockEmails = [
        {
          id: '1',
          sender: 'John Doe',
          subject: 'Meeting Tomorrow at 2pm',
          time: '10:30 AM',
          snippet: 'Hi, just confirming our meeting...'
        },
        {
          id: '2',
          sender: 'Jane Smith',
          subject: 'Project Update',
          time: '9:15 AM',
          snippet: 'The latest version has been deployed...'
        },
        {
          id: '3',
          sender: 'GitHub',
          subject: 'New pull request in ChatGPT-Dashboard',
          time: 'Yesterday',
          snippet: 'A new pull request has been opened...'
        }
      ];
      setEmails(response.data?.emails || mockEmails);
      setError(null);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Unable to fetch emails. Make sure Google API is configured.');
      // Use mock data as fallback
      setEmails([
        {
          id: '1',
          sender: 'System',
          subject: 'Gmail integration not configured',
          time: 'Now',
          snippet: 'Configure Google API credentials to see real emails.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = (email) => {
    // In a real implementation, this would open the email
    console.log('Email clicked:', email);
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
        ) : (
          <>
            {emails.map(email => (
              <EmailItem key={email.id} onClick={() => handleEmailClick(email)}>
                <div style={{ flex: 1 }}>
                  <div className="email-sender">{email.sender}</div>
                  <div className="email-subject">{email.subject}</div>
                  {email.snippet && (
                    <div style={{ 
                      fontSize: '0.85em', 
                      color: '#6c757d',
                      marginTop: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {email.snippet}
                    </div>
                  )}
                </div>
                <div className="email-time">{email.time}</div>
              </EmailItem>
            ))}
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <ActionButton 
                onClick={openGmail}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                View All Emails
              </ActionButton>
            </div>
          </>
        )}
      </WidgetContent>
    </EmailWidget>
  );
}

export default GmailWidget;