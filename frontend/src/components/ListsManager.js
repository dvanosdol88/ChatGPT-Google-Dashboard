import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_BASE_URL } from '../config';

const ListsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const ListCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: relative;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  .icon {
    font-size: 24px;
  }
  
  input {
    margin: 0 0 0 10px;
    font-size: 18px;
    font-weight: bold;
    border: none;
    background: transparent;
    color: #333;
    flex: 1;
    
    &:focus {
      outline: none;
      border-bottom: 2px solid #007bff;
    }
  }
`;

const ListControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
`;

const ControlButton = styled.button`
  background: #f0f0f0;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #e0e0e0;
  }
  
  &.delete {
    color: #dc3545;
  }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  input[type="checkbox"] {
    margin-right: 10px;
  }
  
  span {
    flex: 1;
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
    color: ${props => props.completed ? '#999' : '#333'};
  }
  
  button {
    background: none;
    border: none;
    color: #dc3545;
    cursor: pointer;
    padding: 0 5px;
    font-size: 18px;
    
    &:hover {
      color: #c82333;
    }
  }
`;

const AddItemInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

function ListsManager() {
  const [lists, setLists] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingListId, setEditingListId] = useState(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/google/drive/lists-file`);
      const data = await response.json();
      setLists(data.lists || []);
      setFileId(data.fileId);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLists = async (updatedLists) => {
    try {
      await fetch(`${API_BASE_URL}/google/drive/lists-file`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, lists: updatedLists })
      });
      setLists(updatedLists);
    } catch (error) {
      console.error('Error updating lists:', error);
    }
  };

  const toggleItem = (listId, itemId) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item => 
            item.id === itemId 
              ? { ...item, completed: !item.completed }
              : item
          )
        };
      }
      return list;
    });
    updateLists(updatedLists);
  };

  const deleteItem = (listId, itemId) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId)
        };
      }
      return list;
    });
    updateLists(updatedLists);
  };

  const addItem = (listId, text) => {
    if (!text.trim()) return;
    
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: [...list.items, {
            id: `${listId}-${Date.now()}`,
            text: text.trim(),
            completed: false
          }]
        };
      }
      return list;
    });
    updateLists(updatedLists);
  };

  const updateListName = (listId, newName) => {
    const updatedLists = lists.map(list => 
      list.id === listId ? { ...list, name: newName } : list
    );
    updateLists(updatedLists);
    setEditingListId(null);
  };

  const deleteList = (listId) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      const updatedLists = lists.filter(list => list.id !== listId);
      updateLists(updatedLists);
    }
  };

  const moveList = (listId, direction) => {
    const currentIndex = lists.findIndex(list => list.id === listId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === lists.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedLists = [...lists];
    [updatedLists[currentIndex], updatedLists[newIndex]] = 
    [updatedLists[newIndex], updatedLists[currentIndex]];
    
    updateLists(updatedLists);
  };

  if (loading) return <div>Loading lists from Google Drive...</div>;

  return (
    <ListsContainer>
      {lists.map((list, index) => (
        <ListCard key={list.id}>
          <ListControls>
            <ControlButton 
              onClick={() => moveList(list.id, 'up')}
              disabled={index === 0}
            >
              ↑
            </ControlButton>
            <ControlButton 
              onClick={() => moveList(list.id, 'down')}
              disabled={index === lists.length - 1}
            >
              ↓
            </ControlButton>
            <ControlButton 
              className="delete"
              onClick={() => deleteList(list.id)}
            >
              ×
            </ControlButton>
          </ListControls>

          <ListHeader>
            <span className="icon">{list.icon}</span>
            {editingListId === list.id ? (
              <input
                type="text"
                defaultValue={list.name}
                autoFocus
                onBlur={(e) => updateListName(list.id, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    updateListName(list.id, e.target.value);
                  }
                }}
              />
            ) : (
              <input
                type="text"
                value={list.name}
                readOnly
                onClick={() => setEditingListId(list.id)}
                style={{ cursor: 'pointer' }}
              />
            )}
          </ListHeader>
          
          {list.items.map(item => (
            <ListItem key={item.id} completed={item.completed}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(list.id, item.id)}
              />
              <span>{item.text}</span>
              <button onClick={() => deleteItem(list.id, item.id)}>
                ×
              </button>
            </ListItem>
          ))}
          
          <AddItemInput
            type="text"
            placeholder={`Add to ${list.name}...`}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addItem(list.id, e.target.value);
                e.target.value = '';
              }
            }}
          />
        </ListCard>
      ))}
    </ListsContainer>
  );
}

export default ListsManager;