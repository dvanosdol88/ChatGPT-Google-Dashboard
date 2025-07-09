import React, { useState, useEffect } from 'react';
import { 
  Widget, 
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  ListItem,
  StyledInput,
  ActionButton 
} from './styled/WidgetStyles';
import { taskAPI, aiAPI } from '../api/api';

function TasksWidget({ type, refreshTasks, onTaskAdded }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [refreshTasks]);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      // Filter tasks based on type (you might want to add a 'type' field to your task model)
      const filteredTasks = response.data.tasks || [];
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await taskAPI.create({ 
          title: newTask,
          type: type // Add type field to distinguish work/personal
        });
        setTasks([...tasks, response.data.task]);
        setNewTask('');
        onTaskAdded(response.data.task);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const toggleTask = async (task) => {
    try {
      await taskAPI.toggle(task.id);
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const generateAITask = async () => {
    setGeneratingAI(true);
    try {
      const prompt = type === 'work' 
        ? 'Generate a professional work task'
        : 'Generate a personal development or lifestyle task';
      
      const response = await aiAPI.generateTask({ prompt, count: 1 });
      if (response.data.tasks && response.data.tasks.length > 0) {
        const aiTask = response.data.tasks[0];
        setNewTask(aiTask);
      }
    } catch (error) {
      console.error('Error generating AI task:', error);
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <Widget>
      <WidgetHeader>
        <WidgetTitle>{type === 'work' ? 'Work Tasks' : 'Personal Tasks'}</WidgetTitle>
        <WidgetIcon>{type === 'work' ? '💼' : '🏃'}</WidgetIcon>
      </WidgetHeader>
      <WidgetContent>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <StyledInput
              type="text"
              placeholder={`Add new ${type} task...`}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <ActionButton 
              onClick={generateAITask}
              disabled={generatingAI}
              style={{ width: 'auto', padding: '10px 15px' }}
            >
              {generatingAI ? '...' : '🤖'}
            </ActionButton>
          </div>
          <ActionButton 
            onClick={addTask} 
            style={{ width: '100%' }}
          >
            Add Task
          </ActionButton>
        </div>
        
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div>
            {tasks.filter(task => task.status === 'pending').map(task => (
              <ListItem 
                key={task.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span
                  onClick={() => toggleTask(task)}
                  style={{ flex: 1, cursor: 'pointer' }}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ×
                </button>
              </ListItem>
            ))}
            
            {tasks.filter(task => task.status === 'completed').length > 0 && (
              <>
                <div style={{ marginTop: '20px', marginBottom: '10px', fontSize: '0.9em', color: '#6c757d' }}>
                  Completed
                </div>
                {tasks.filter(task => task.status === 'completed').map(task => (
                  <ListItem 
                    key={task.id}
                    style={{ 
                      opacity: 0.6,
                      textDecoration: 'line-through',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      onClick={() => toggleTask(task)}
                      style={{ flex: 1, cursor: 'pointer' }}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      ×
                    </button>
                  </ListItem>
                ))}
              </>
            )}
          </div>
        )}
      </WidgetContent>
    </Widget>
  );
}

export default TasksWidget;