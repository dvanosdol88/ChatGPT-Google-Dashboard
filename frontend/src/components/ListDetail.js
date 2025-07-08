import React, { useState, useEffect } from 'react';
import { listAPI } from '../api/api';
import './ListDetail.css';

const ListDetail = ({ list, onListUpdated }) => {
  const [items, setItems] = useState([]);
  const [newItemContent, setNewItemContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (list && list.ListItems) {
      setItems(list.ListItems.sort((a, b) => a.position - b.position));
    }
  }, [list]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!newItemContent.trim()) {
      return;
    }

    try {
      setLoading(true);
      const response = await listAPI.addItem(list.id, {
        content: newItemContent.trim()
      });
      
      const newItem = response.data.data;
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      setNewItemContent('');
      
      // Update parent component
      onListUpdated({
        ...list,
        ListItems: updatedItems
      });
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (itemId) => {
    try {
      const response = await listAPI.toggleItem(list.id, itemId);
      const updatedItem = response.data.data;
      
      const updatedItems = items.map(item =>
        item.id === itemId ? updatedItem : item
      );
      setItems(updatedItems);
      
      onListUpdated({
        ...list,
        ListItems: updatedItems
      });
    } catch (err) {
      console.error('Error toggling item:', err);
      alert('Failed to update item');
    }
  };

  const handleUpdateItem = async (itemId, newContent) => {
    if (!newContent.trim()) {
      return;
    }

    try {
      const response = await listAPI.updateItem(list.id, itemId, {
        content: newContent.trim()
      });
      const updatedItem = response.data.data;
      
      const updatedItems = items.map(item =>
        item.id === itemId ? updatedItem : item
      );
      setItems(updatedItems);
      setEditingItem(null);
      
      onListUpdated({
        ...list,
        ListItems: updatedItems
      });
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await listAPI.deleteItem(list.id, itemId);
      
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      
      onListUpdated({
        ...list,
        ListItems: updatedItems
      });
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item');
    }
  };

  const completedCount = items.filter(item => item.checked).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="list-detail">
      <div className="list-detail-header">
        <h2>{list.name}</h2>
        <div className="list-stats">
          <span>{completedCount} of {items.length} completed</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleAddItem} className="add-item-form">
        <input
          type="text"
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          placeholder="Add new item..."
          className="item-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="add-item-button"
          disabled={loading || !newItemContent.trim()}
        >
          Add
        </button>
      </form>

      <div className="items-list">
        {items.length === 0 ? (
          <div className="empty-state">
            No items in this list yet
          </div>
        ) : (
          items.map(item => (
            <div 
              key={item.id} 
              className={`list-item-row ${item.checked ? 'checked' : ''}`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggleItem(item.id)}
                className="item-checkbox"
              />
              
              {editingItem === item.id ? (
                <input
                  type="text"
                  defaultValue={item.content}
                  onBlur={(e) => handleUpdateItem(item.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateItem(item.id, e.target.value);
                    } else if (e.key === 'Escape') {
                      setEditingItem(null);
                    }
                  }}
                  className="item-edit-input"
                  autoFocus
                />
              ) : (
                <span 
                  className="item-content"
                  onDoubleClick={() => setEditingItem(item.id)}
                >
                  {item.content}
                </span>
              )}
              
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="delete-item-button"
                title="Delete item"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListDetail;