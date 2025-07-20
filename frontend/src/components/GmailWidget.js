// Enhanced GmailWidget Component
// Changes:
// - Replaced all styled-components with Tailwind CSS classes for a modern, consistent UI.
// - Added full dark mode support (`dark:*` classes).
// - Implemented accessibility best practices (semantic HTML, ARIA roles, focus rings, keyboard navigation).
// - Added a custom-styled scrollbar using Tailwind utilities.
// - Implemented conditional styling for unread/important emails and hover states.

import React, { useState, useEffect } from 'react';
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
      // Use googleAPI for the call
      const response = await googleAPI.getGmailMessages();
      
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
        // Update local state optimistically
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
    <section 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 h-full flex flex-col transition-shadow duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700" 
      aria-labelledby="gmail-widget-title"
    >
      <header className="flex items-center justify-between mb-4">
        <h2 id="gmail-widget-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Gmail
        </h2>
        <span className="text-2xl" role="img" aria-label="Email icon">📧</span>
      </header>

      <div className="flex-grow flex flex-col min-h-0">
        {loading ? (
          <p role="status" className="text-gray-500 dark:text-gray-400 animate-pulse">
            Loading emails...
          </p>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={openGmail}
              aria-label="Open Gmail in new tab"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              Open Gmail
            </button>
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-10 flex-grow flex flex-col items-center justify-center">
            <div className="text-5xl opacity-50 mb-3" aria-hidden="true">📭</div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No emails found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your inbox is empty or no emails match the criteria</p>
            <button
              onClick={openGmail}
              aria-label="Open Gmail in new tab"
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              Open Gmail
            </button>
          </div>
        ) : (
          <>
            <div 
              role="list" 
              className="flex-grow max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 -mr-2 pr-2"
            >
              {emails.map((email) => (
                <div
                  key={email.id}
                  role="listitem"
                  onClick={() => handleEmailClick(email)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEmailClick(email)}
                  tabIndex="0"
                  aria-label={`Email from ${email.sender}. Subject: ${email.subject}. ${email.isUnread ? 'Unread.' : ''} ${email.isImportant ? 'Important.' : ''} Received ${email.time}.`}
                  className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                >
                  <div className={`relative ${email.isUnread ? 'pl-4' : ''}`}>
                    {email.isUnread && (
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" 
                        aria-hidden="true" 
                      />
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex-grow min-w-0">
                        <p className={`truncate text-sm ${email.isUnread ? 'font-semibold text-gray-900 dark:text-gray-100' : 'font-normal text-gray-600 dark:text-gray-400'}`}>
                          {email.sender}
                          {email.isImportant && (
                            <span className="ml-1" role="img" aria-label="Important">⭐</span>
                          )}
                        </p>
                        <p className={`truncate text-sm mt-1 ${email.isUnread ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}>
                          {email.subject}
                        </p>
                        {email.snippet && (
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {email.snippet}
                          </p>
                        )}
                      </div>
                      <p className={`flex-shrink-0 ml-3 text-xs whitespace-nowrap ${email.isUnread ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                        {email.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
              <button
                onClick={openGmail}
                aria-label="View all emails in Gmail"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              >
                View All in Gmail
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default GmailWidget;