import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ListsWidget,
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  ActionButton
} from './styled/WidgetStyles';
import axios from 'axios';

function MyListsWidget() {
  const [content, setContent] = useState('');
  const [selectedList, setSelectedList] = useState('shopping');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Available lists - you can expand this
  const availableLists = [
    { id: 'shopping', name: 'Shopping List', icon: '🛒' },
    { id: 'reading', name: 'Reading List', icon: '📚' },
    { id: 'projects', name: 'Projects', icon: '🚀' }
  ];

  useEffect(() => {
    fetchListFromDrive();
  }, [selectedList]);

  const fetchListFromDrive = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/google/drive/lists/${selectedList}`);
      setContent(response.data);
      setError(null);
    } catch (error) {
      console.error(`Error fetching ${selectedList} list:`, error);
      
      // Fallback content
      const fallbackContent = `# ${availableLists.find(l => l.id === selectedList)?.name || 'List'}\n\n- Configure Google Drive integration\n- Set DRIVE_${selectedList.toUpperCase()}_LIST_FILE_ID in environment\n- Create a markdown file in Google Drive with your list items`;
      
      setContent(fallbackContent);
      setError('Using fallback content. Configure Google Drive to see real lists.');
    } finally {
      setLoading(false);
    }
  };

  const openInDrive = () => {
    window.open('https://drive.google.com', '_blank');
  };

  return (
    <ListsWidget>
      <WidgetHeader>
        <WidgetTitle>My Lists</WidgetTitle>
        <WidgetIcon>📝</WidgetIcon>
      </WidgetHeader>
      <WidgetContent>
        {/* List selector */}
        <div style={{ marginBottom: '15px' }}>
          <select
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 64, 128, 0.2)',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            {availableLists.map(list => (
              <option key={list.id} value={list.id}>
                {list.icon} {list.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading list...</p>
        ) : (
          <>
            <div className="markdown-content" style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#0A1828',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
            
            {error && (
              <div style={{ 
                marginTop: '15px', 
                padding: '10px', 
                background: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#6c757d'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <ActionButton 
                onClick={openInDrive}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Edit in Google Drive
              </ActionButton>
            </div>
          </>
        )}
      </WidgetContent>
    </ListsWidget>
  );
}

export default MyListsWidget;