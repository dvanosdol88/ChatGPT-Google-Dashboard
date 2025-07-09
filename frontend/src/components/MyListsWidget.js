import React, { useState, useEffect } from 'react';
import { 
  ListsWidget,
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  ListItem,
  StyledInput,
  ActionButton
} from './styled/WidgetStyles';
import { listAPI } from '../api/api';

function MyListsWidget() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateList, setShowCreateList] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      fetchListItems(selectedList.id);
    }
  }, [selectedList]);

  const fetchLists = async () => {
    try {
      const response = await listAPI.getAll();
      setLists(response.data.lists || []);
      if (response.data.lists?.length > 0 && !selectedList) {
        setSelectedList(response.data.lists[0]);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
      // Provide some default lists as fallback
      const defaultLists = [
        { id: '1', name: 'Shopping List', itemCount: 0 },
        { id: '2', name: 'Reading List', itemCount: 0 }
      ];
      setLists(defaultLists);
      setSelectedList(defaultLists[0]);
    } finally {
      setLoading(false);
    }
  };

  const fetchListItems = async (listId) => {
    try {
      const response = await listAPI.getById(listId);
      setListItems(response.data.list?.items || []);
    } catch (error) {
      console.error('Error fetching list items:', error);
      setListItems([]);
    }
  };

  const createList = async () => {
    if (!newListName.trim()) return;

    try {
      const response = await listAPI.create({ name: newListName });
      setLists([...lists, response.data.list]);
      setNewListName('');
      setShowCreateList(false);
      setSelectedList(response.data.list);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const deleteList = async (listId) => {
    try {
      await listAPI.delete(listId);
      setLists(lists.filter(l => l.id !== listId));
      if (selectedList?.id === listId) {
        setSelectedList(lists[0] || null);
      }
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const addItem = async () => {
    if (!newItemContent.trim() || !selectedList) return;

    try {
      const response = await listAPI.addItem(selectedList.id, { 
        content: newItemContent 
      });
      setListItems([...listItems, response.data.item]);
      setNewItemContent('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const toggleItem = async (itemId) => {
    try {
      await listAPI.toggleItem(selectedList.id, itemId);
      setListItems(listItems.map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ));
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await listAPI.deleteItem(selectedList.id, itemId);
      setListItems(listItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <ListsWidget>
      <WidgetHeader>
        <WidgetTitle>My Lists</WidgetTitle>
        <WidgetIcon>📝</WidgetIcon>
      </WidgetHeader>
      <WidgetContent>
        {loading ? (
          <p>Loading lists...</p>
        ) : (
          <>
            {/* List selector */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select
                  value={selectedList?.id || ''}
                  onChange={(e) => setSelectedList(lists.find(l => l.id === e.target.value))}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 64, 128, 0.2)',
                    fontSize: '14px'
                  }}
                >
                  {lists.map(list => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list.itemCount || 0})
                    </option>
                  ))}
                </select>
                <ActionButton
                  onClick={() => setShowCreateList(!showCreateList)}
                  style={{ padding: '8px 16px' }}
                >
                  +
                </ActionButton>
              </div>

              {showCreateList && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <StyledInput
                    type="text"
                    placeholder="New list name..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && createList()}
                  />
                  <ActionButton onClick={createList} style={{ padding: '8px 16px' }}>
                    Create
                  </ActionButton>
                </div>
              )}
            </div>

            {/* List items */}
            {selectedList && (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <StyledInput
                      type="text"
                      placeholder="Add new item..."
                      value={newItemContent}
                      onChange={(e) => setNewItemContent(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    />
                    <ActionButton onClick={addItem} style={{ padding: '8px 16px' }}>
                      Add
                    </ActionButton>
                  </div>
                </div>

                <div>
                  {listItems.map(item => (
                    <ListItem
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: item.checked ? 'line-through' : 'none',
                        opacity: item.checked ? 0.6 : 1
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.checked || false}
                        onChange={() => toggleItem(item.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ flex: 1 }}>{item.content}</span>
                      <button
                        onClick={() => deleteItem(item.id)}
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
                </div>
              </>
            )}
          </>
        )}
      </WidgetContent>
    </ListsWidget>
  );
}

export default MyListsWidget;