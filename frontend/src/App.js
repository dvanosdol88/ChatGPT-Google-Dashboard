import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { healthCheck } from './api/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [refreshTasks, setRefreshTasks] = useState(0);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await healthCheck();
      setHealthStatus(response.data);
    } catch (err) {
      console.error('Health check failed:', err);
      setHealthStatus({
        status: 'error',
        message: 'Failed to connect to backend'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    // Trigger task list refresh
    setRefreshTasks(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <h2>Loading ChatGPT-Google Dashboard...</h2>
      </div>
    );
  }

  if (healthStatus?.status === 'error') {
    return (
      <div className="app-error">
        <h2>Connection Error</h2>
        <p>{healthStatus.message}</p>
        <p>Make sure the backend server is running on port 5000</p>
        <button onClick={checkHealth}>Retry</button>
      </div>
    );
  }

  return (
    <Dashboard
      healthStatus={healthStatus}
      refreshTasks={refreshTasks}
      onTaskAdded={handleTaskAdded}
    />
  );
}

export default App;
// Force rebuild Thu Jul 10 14:02:11 EDT 2025
