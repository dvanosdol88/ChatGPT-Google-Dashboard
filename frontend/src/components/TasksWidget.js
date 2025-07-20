// C:\Users\david\projects-master\ChatGPT-Google-Dashboard\frontend\src\components\TasksWidget.js

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

/**
 * Enhanced TasksWidget Component
 * - Replaced all styled-components with Tailwind CSS classes for a modern, consistent UI.
 * - Added full dark mode support (`dark:*` classes).
 * - Implemented accessibility best practices (semantic HTML, ARIA roles, focus rings).
 * - Used @tailwindcss/typography (`prose` class) for clean markdown rendering.
 * - Added smooth transitions for hover and focus states.
 */
function TasksWidget({ type }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasksFromDrive();
  }, [type]);

  const fetchTasksFromDrive = async () => {
    setLoading(true);
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 h-full flex flex-col transition-shadow duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {type === 'work' ? 'Work Tasks' : 'Personal Tasks'}
        </h2>
        <span className="text-2xl" role="img" aria-label={type === 'work' ? 'Briefcase icon' : 'Runner icon'}>
          {type === 'work' ? '💼' : '🏃'}
        </span>
      </header>

      <div className="mt-4 flex-grow flex flex-col">
        {loading ? (
          <p role="status" className="text-gray-500 dark:text-gray-400 animate-pulse">
            Loading tasks...
          </p>
        ) : (
          <div className="flex flex-col justify-between h-full">
            {/* Use the 'prose' class from @tailwindcss/typography for well-styled markdown */}
            <article className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </article>

            {error && (
              <div 
                role="alert"
                className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg text-xs text-yellow-700 dark:text-yellow-300"
              >
                {error}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
              <button
                onClick={openInDrive}
                aria-label="Edit tasks in Google Drive"
                className="
                  px-4 py-2 bg-blue-600 text-white text-sm font-semibold 
                  rounded-md shadow-sm transition-all duration-200
                  hover:bg-blue-700 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  focus:ring-blue-500 dark:focus:ring-offset-gray-800
                "
              >
                Edit in Google Drive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksWidget;