// Enhanced AddTaskForm Component
// Changes:
// - Created a new component from scratch based on requirements, using only Tailwind CSS.
// - Replaced all potential styled-components with accessible, modern Tailwind-styled elements.
// - Implemented independent loading states for each button action.
// - Added full dark mode support (`dark:` classes).
// - Included smooth transitions for hover and focus states.

import React, { useState } from 'react';
import { taskAPI, aiAPI } from '../api/api';

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
);

function AddTaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState({
    add: false,
    generateOne: false,
    generateMultiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || loading.add) return;

    try {
      setLoading(prev => ({ ...prev, add: true }));
      const response = await taskAPI.create({ title: title.trim() });
      setTitle('');
      onTaskAdded(response.data.data);
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task');
    } finally {
      setLoading(prev => ({ ...prev, add: false }));
    }
  };

  const handleGenerateTask = async () => {
    try {
      setLoading(prev => ({ ...prev, generateOne: true }));
      const response = await aiAPI.generateTask({
        prompt: 'Generate a productive task for today',
        category: 'productivity'
      });
      
      if (response.data.data) {
        onTaskAdded(response.data.data);
      }
    } catch (err) {
      console.error('Error generating task:', err);
      alert('Failed to generate task with AI');
    } finally {
      setLoading(prev => ({ ...prev, generateOne: false }));
    }
  };

  const handleGenerateMultipleTasks = async () => {
    try {
      setLoading(prev => ({ ...prev, generateMultiple: true }));
      const count = prompt('How many tasks would you like to generate? (1-10)', '3');
      
      if (!count || isNaN(count) || count < 1 || count > 10) {
        setLoading(prev => ({ ...prev, generateMultiple: false }));
        return;
      }

      const response = await aiAPI.generateTasks({
        count: parseInt(count),
        category: 'daily productivity',
        timeframe: 'today'
      });
      
      if (response.data.data) {
        response.data.data.forEach(task => onTaskAdded(task));
      }
    } catch (err) {
      console.error('Error generating tasks:', err);
      alert('Failed to generate tasks with AI');
    } finally {
      setLoading(prev => ({ ...prev, generateMultiple: false }));
    }
  };

  const isAnyLoading = Object.values(loading).some(Boolean);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-title" className="sr-only">Add a new task</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            disabled={isAnyLoading}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            type="submit" 
            disabled={!title.trim() || isAnyLoading} 
            className="flex-1 sm:flex-initial flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          >
            {loading.add ? <LoadingSpinner /> : 'Add Task'}
          </button>

          <div className="flex gap-2 flex-1 sm:flex-initial">
            <button 
              type="button"
              onClick={handleGenerateTask}
              disabled={isAnyLoading}
              title="Generate a single task with AI"
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
            >
              {loading.generateOne ? (
                <LoadingSpinner />
              ) : (
                <>
                  <span role="img" aria-label="robot" className="text-lg">🤖</span>
                  <span className="hidden sm:inline">Generate Task</span>
                  <span className="sm:hidden">AI</span>
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={handleGenerateMultipleTasks}
              disabled={isAnyLoading}
              title="Generate multiple tasks with AI"
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
            >
              {loading.generateMultiple ? (
                <LoadingSpinner />
              ) : (
                <>
                  <span role="img" aria-label="sparkles" className="text-lg">✨</span>
                  <span className="hidden sm:inline">Generate Multiple</span>
                  <span className="sm:hidden">AI+</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddTaskForm;