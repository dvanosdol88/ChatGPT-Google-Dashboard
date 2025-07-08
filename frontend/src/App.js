import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import ListManager from './components/ListManager';
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
    <div className="App">
      <header className="App-header">
        <h1>ChatGPT-Google Dashboard</h1>
        <div className="service-status">
          {healthStatus?.services && (
            <>
              <span className={`status-badge ${healthStatus.services.database === 'connected' ? 'connected' : 'disconnected'}`}>
                Database: {healthStatus.services.database}
              </span>
              <span className={`status-badge ${healthStatus.services.openai === 'configured' ? 'connected' : 'disconnected'}`}>
                OpenAI: {healthStatus.services.openai}
              </span>
              <span className={`status-badge ${healthStatus.services.google === 'configured' ? 'connected' : 'disconnected'}`}>
                Google: {healthStatus.services.google}
              </span>
            </>
          )}
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          📋 Tasks
        </button>
        <button
          className={`nav-button ${activeTab === 'lists' ? 'active' : ''}`}
          onClick={() => setActiveTab('lists')}
        >
          📝 Lists
        </button>
        <button
          className={`nav-button ${activeTab === 'google' ? 'active' : ''}`}
          onClick={() => setActiveTab('google')}
        >
          🔗 Google Services
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'tasks' && (
          <div className="tasks-section">
            <AddTaskForm onTaskAdded={handleTaskAdded} />
            <TaskList key={refreshTasks} />
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="lists-section">
            <ListManager />
          </div>
        )}

        {activeTab === 'google' && (
          <div className="google-section">
            <h2>Google Services Integration</h2>
            <p>Google Drive, Gmail, and Calendar integration coming soon!</p>
            <div className="google-status">
              {healthStatus?.services?.google === 'configured' ? (
                <p className="success">✅ Google API credentials configured</p>
              ) : (
                <p className="warning">⚠️ Google API credentials not configured</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
