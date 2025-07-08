import React, { useState, useEffect } from 'react';
import { listAPI } from '../api/api';
import ListDetail from './ListDetail';
import './ListManager.css';

const ListManager = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await listAPI.getAll();
      setLists(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load lists');
      console.error('Error fetching lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    
    if (!newListName.trim()) {
      alert('Please enter a list name');
      return;
    }

    try {
      const response = await listAPI.create({ 
        name: newListName.trim(),
        description: ''
      });
      setLists([...lists, response.data.data]);
      setNewListName('');
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating list:', err);
      alert(err.response?.data?.error || 'Failed to create list');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list? All items will be removed.')) {
      return;
    }

    try {
      await listAPI.delete(listId);
      setLists(lists.filter(list => list.id !== listId));
      if (selectedList?.id === listId) {
        setSelectedList(null);
      }
    } catch (err) {
      console.error('Error deleting list:', err);
      alert('Failed to delete list');
    }
  };

  const handleListUpdated = (updatedList) => {
    setLists(lists.map(list => 
      list.id === updatedList.id ? updatedList : list
    ));
    setSelectedList(updatedList);
  };

  if (loading) {
    return <div className="loading">Loading lists...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={fetchLists} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="list-manager">
      <div className="list-sidebar">
        <div className="list-header">
          <h3>My Lists</h3>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-list-button"
            title="Create new list"
          >
            +
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateList} className="create-list-form">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="New list name"
              className="list-name-input"
              autoFocus
            />
            <div className="form-actions">
              <button type="submit" className="save-button">
                Save
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowCreateForm(false);
                  setNewListName('');
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="lists-container">
          {lists.length === 0 ? (
            <div className="empty-state">
              No lists yet. Create your first list!
            </div>
          ) : (
            lists.map(list => (
              <div
                key={list.id}
                className={`list-item ${selectedList?.id === list.id ? 'active' : ''}`}
                onClick={() => setSelectedList(list)}
              >
                <span className="list-name">{list.name}</span>
                <span className="list-count">
                  {list.ListItems ? list.ListItems.length : 0}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list.id);
                  }}
                  className="delete-list-button"
                  title="Delete list"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="list-content">
        {selectedList ? (
          <ListDetail 
            list={selectedList} 
            onListUpdated={handleListUpdated}
          />
        ) : (
          <div className="no-list-selected">
            Select a list to view its items
          </div>
        )}
      </div>
    </div>
  );
};

export default ListManager;