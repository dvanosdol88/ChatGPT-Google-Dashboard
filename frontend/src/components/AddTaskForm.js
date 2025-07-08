import React, { useState } from 'react';
import { taskAPI, aiAPI } from '../api/api';
import './AddTaskForm.css';

const AddTaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      setLoading(true);
      const response = await taskAPI.create({ title: title.trim() });
      setTitle('');
      onTaskAdded(response.data.data);
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTask = async () => {
    try {
      setAiLoading(true);
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
      setAiLoading(false);
    }
  };

  const handleGenerateMultipleTasks = async () => {
    try {
      setAiLoading(true);
      const count = prompt('How many tasks would you like to generate? (1-10)', '3');
      
      if (!count || isNaN(count) || count < 1 || count > 10) {
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
      setAiLoading(false);
    }
  };

  return (
    <div className="add-task-form-container">
      <form onSubmit={handleSubmit} className="add-task-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="task-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="add-button"
          disabled={loading || !title.trim()}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      <div className="ai-actions">
        <button
          onClick={handleGenerateTask}
          className="ai-button"
          disabled={aiLoading}
          title="Generate a single task with AI"
        >
          {aiLoading ? '🤔' : '🤖'} Generate Task
        </button>
        <button
          onClick={handleGenerateMultipleTasks}
          className="ai-button"
          disabled={aiLoading}
          title="Generate multiple tasks with AI"
        >
          {aiLoading ? '🤔' : '🤖'} Generate Multiple
        </button>
      </div>
    </div>
  );
};

export default AddTaskForm;