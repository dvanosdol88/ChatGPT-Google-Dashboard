// Enhanced DocumentsWidget Component
// Changes:
// - Created a new component from scratch based on requirements, using only Tailwind CSS.
// - Implemented a clean, modern document list with file-type icons.
// - Added full dark mode support (`dark:*` classes).
// - Implemented accessibility best practices (semantic HTML, ARIA roles, focus rings, keyboard navigation).
// - Included helper functions for formatting file size and determining icons.
// - Added smooth transitions for hover and focus states.

import React, { useState, useEffect } from 'react';

const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf': return '📄'; // PDF
    case 'docx':
    case 'doc': return '📝'; // Word Document
    case 'xlsx':
    case 'xls': return '📊'; // Excel Sheet
    case 'pptx':
    case 'ppt': return '📊'; // PowerPoint
    case 'gsheet': return '📊'; // Google Sheet
    case 'gdoc': return '📝'; // Google Doc
    case 'gslides': return '📊'; // Google Slides
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif': return '🖼️'; // Image
    default: return '📁'; // Generic File
  }
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

function DocumentsWidget() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock fetching documents
    const fetchDocuments = () => {
      setLoading(true);
      try {
        const mockDocs = [
          { id: 1, name: 'Q3 Financial Report.xlsx', type: 'spreadsheet', size: 2450000, modified: '2 hours ago', url: '#' },
          { id: 2, name: 'Project Phoenix Presentation.pptx', type: 'presentation', size: 5600000, modified: 'Yesterday', url: '#' },
          { id: 3, name: 'User_Interview_Notes.gdoc', type: 'document', size: 120000, modified: '3 days ago', url: '#' },
          { id: 4, name: 'Final_Contract.pdf', type: 'pdf', size: 850000, modified: 'Last week', url: '#' },
        ];
        setDocuments(mockDocs);
      } catch (err) {
        setError('Failed to load documents.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleDocClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 h-full flex flex-col transition-shadow duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700" aria-labelledby="documents-widget-title">
      <header className="flex items-center justify-between mb-4">
        <h2 id="documents-widget-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Recent Documents
        </h2>
        <span className="text-2xl" role="img" aria-label="Folder icon">📂</span>
      </header>

      <div className="flex-grow flex flex-col min-h-0">
        {loading ? (
          <p role="status" className="text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading documents...</p>
        ) : error ? (
          <div role="alert" className="text-center text-red-600 dark:text-red-400">{error}</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 flex-grow flex flex-col items-center justify-center">
            <div className="text-5xl opacity-50 mb-3" aria-hidden="true">📁</div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No documents</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your documents will appear here</p>
          </div>
        ) : (
          <div role="list" className="flex-grow overflow-y-auto -mr-3 pr-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {documents.map((doc) => (
              <div
                key={doc.id}
                role="listitem"
                onClick={() => handleDocClick(doc.url)}
                onKeyPress={(e) => e.key === 'Enter' && handleDocClick(doc.url)}
                tabIndex="0"
                aria-label={`Document: ${doc.name}, Size: ${formatBytes(doc.size)}, Modified: ${doc.modified}`}
                className="flex items-center gap-4 p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <div className="text-2xl" aria-hidden="true">{getFileIcon(doc.name)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{doc.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatBytes(doc.size)} • {doc.modified}
                  </p>
                </div>
                {/* Optional: Add action buttons here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DocumentsWidget;