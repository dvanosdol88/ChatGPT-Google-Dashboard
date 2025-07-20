import React, { useState, useEffect } from 'react';
import { 
  ListsWidget,
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  ActionButton
} from './styled/WidgetStyles';
import axios from 'axios';

function MyListsWidget() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/lists');
      if (response.data.success) {
        setLists(response.data.data || []);
        // Select first list if available
        if (response.data.data && response.data.data.length > 0 && !selectedList) {
          setSelectedList(response.data.data[0]);
        }
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching lists:', error);
      setError('Failed to load lists');
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    if (!newListName.trim()) return;
    
    try {
      const response = await axios.post('/api/lists', { 
        name: newListName,
        description: ''
      });
      if (response.data.success) {
        await fetchLists();
        setNewListName('');
        setIsCreatingList(false);
      }
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const addItem = async () => {
    if (!newItemText.trim() || !selectedList) return;
    
    try {
      const response = await axios.post(`/api/lists/${selectedList.id}/items`, {
        content: newItemText
      });
      if (response.data.success) {
        await fetchLists();
        setNewItemText('');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const toggleItem = async (itemId, checked) => {
    if (!selectedList) return;
    
    try {
      await axios.put(`/api/lists/${selectedList.id}/items/${itemId}`, {
        checked: !checked
      });
      await fetchLists();
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const openInDrive = () => {
    window.open('https://drive.google.com', '_blank');
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
            {/* List selector or create new */}
            <div style={{ marginBottom: '15px' }}>
              {isCreatingList ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && createList()}
                    placeholder="New list name..."
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 64, 128, 0.2)',
                      fontSize: '14px'
                    }}
                    autoFocus
                  />
                  <button onClick={createList} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}>✓</button>
                  <button onClick={() => { setIsCreatingList(false); setNewListName(''); }} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#6c757d', color: 'white', cursor: 'pointer' }}>✕</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={selectedList?.id || ''}
                    onChange={(e) => {
                      const list = lists.find(l => l.id === e.target.value);
                      setSelectedList(list);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 64, 128, 0.2)',
                      fontSize: '14px',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {lists.length === 0 && <option value="">No lists yet</option>}
                    {lists.map(list => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setIsCreatingList(true)} 
                    style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#28a745', color: 'white', cursor: 'pointer' }}
                    title="Create new list"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* List items */}
            {selectedList && (
              <>
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#0A1828',
                  maxHeight: '250px',
                  overflowY: 'auto',
                  marginBottom: '10px'
                }}>
                  {selectedList.ListItems && selectedList.ListItems.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {selectedList.ListItems.map(item => (
                        <li key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(item.id, item.checked)}
                            style={{ marginRight: '8px', cursor: 'pointer' }}
                          />
                          <span style={{ 
                            flex: 1,
                            textDecoration: item.checked ? 'line-through' : 'none',
                            color: item.checked ? '#6c757d' : '#0A1828'
                          }}>
                            {item.content}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No items yet</p>
                  )}
                </div>

                {/* Add new item */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Add item..."
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0, 64, 128, 0.2)',
                      fontSize: '13px'
                    }}
                  />
                  <button 
                    onClick={addItem}
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      border: 'none', 
                      background: '#007bff', 
                      color: 'white', 
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Add
                  </button>
                </div>
              </>
            )}

            {error && (
              <div style={{ 
                marginTop: '10px', 
                padding: '8px', 
                background: '#f8d7da',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#721c24'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ textAlign: 'center' }}>
              <ActionButton 
                onClick={openInDrive}
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                View in Google Drive
              </ActionButton>
            </div>
          </>
        )}
      </WidgetContent>
    </ListsWidget>
  );
}

export default MyListsWidget;