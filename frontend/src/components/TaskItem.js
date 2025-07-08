import React, { useState } from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSubmitEdit = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onEdit(editedTitle.trim());
    }
    setIsEditing(false);
    setEditedTitle(task.title);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.status === 'completed'}
        onChange={onToggle}
        className="task-checkbox"
      />
      
      {isEditing ? (
        <div className="task-edit">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSubmitEdit}
            className="task-edit-input"
            autoFocus
          />
        </div>
      ) : (
        <div className="task-content">
          <span 
            className="task-title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.title}
          </span>
          <span className="task-date">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      )}

      <div className="task-actions">
        {!isEditing && (
          <>
            <button 
              onClick={() => setIsEditing(true)} 
              className="task-button edit-button"
              title="Edit task"
            >
              ✏️
            </button>
            <button 
              onClick={onDelete} 
              className="task-button delete-button"
              title="Delete task"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;