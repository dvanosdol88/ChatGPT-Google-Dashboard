import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Widget, 
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  ActionButton 
} from './styled/WidgetStyles';
import axios from 'axios';

function TasksWidget({ type }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasksFromDrive();
  }, [type]);

  const fetchTasksFromDrive = async () => {
    try {
      const endpoint = type === 'work' 
        ? '/api/google/drive/work-tasks'
        : '/api/google/drive/personal-tasks';
      
      const response = await axios.get(endpoint);
      setContent(response.data);
      setError(null);
    } catch (error) {
      console.error(`Error fetching ${type} tasks:`, error);
      
      // Fallback content if Drive is not configured
      const fallbackContent = type === 'work' 
        ? `# Work Tasks\n\n- Configure Google Drive integration\n- Set DRIVE_WORK_TASKS_FILE_ID in environment\n- Create a markdown file in Google Drive with your tasks`
        : `# Personal Tasks\n\n- Configure Google Drive integration\n- Set DRIVE_PERSONAL_TASKS_FILE_ID in environment\n- Create a markdown file in Google Drive with your tasks`;
      
      setContent(fallbackContent);
      setError('Using fallback content. Configure Google Drive to see real tasks.');
    } finally {
      setLoading(false);
    }
  };

  const openInDrive = () => {
    window.open('https://drive.google.com', '_blank');
  };

  return (
    <Widget>
      <WidgetHeader>
        <WidgetTitle>{type === 'work' ? 'Work Tasks' : 'Personal Tasks'}</WidgetTitle>
        <WidgetIcon>{type === 'work' ? '💼' : '🏃'}</WidgetIcon>
      </WidgetHeader>
      <WidgetContent>
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <>
            <div className="markdown-content" style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#0A1828'
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
    </Widget>
  );
}

export default TasksWidget;