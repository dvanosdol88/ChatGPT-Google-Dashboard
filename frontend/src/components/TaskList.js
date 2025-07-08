import React, { useState, useEffect } from 'react';
import { taskAPI } from '../api/api';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const status = filter === 'all' ? null : filter;
      const response = await taskAPI.getAll(status);
      setTasks(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await taskAPI.toggle(taskId);
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data.data : task
      ));
    } catch (err) {
      console.error('Error toggling task:', err);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskAPI.delete(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task');
    }
  };

  const handleEditTask = async (taskId, newTitle) => {
    try {
      const response = await taskAPI.update(taskId, { title: newTitle });
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data.data : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task');
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={fetchTasks} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="task-list-container">
      <div className="task-filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({taskCounts.all})
        </button>
        <button 
          className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({taskCounts.pending})
        </button>
        <button 
          className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({taskCounts.completed})
        </button>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            No tasks found. Create your first task!
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => handleToggleTask(task.id)}
              onDelete={() => handleDeleteTask(task.id)}
              onEdit={(newTitle) => handleEditTask(task.id, newTitle)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;