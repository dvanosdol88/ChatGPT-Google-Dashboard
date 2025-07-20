// Enhanced Lists.js Component
// Changes:
// - Created a new component from scratch based on requirements, using only Tailwind CSS.
// - Replaced all React Bootstrap components with custom, accessible Tailwind-styled elements.
// - Implemented a custom modal for creating new lists.
// - Added full dark mode support (`dark:*` classes).
// - Included functionality for list/item CRUD operations with mock data.

import React, { useState, useEffect } from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const CreateListModal = ({ show, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!show) return null;

  const handleCreate = () => {
    if (name.trim()) {
      onCreate({ name, description });
      setName('');
      setDescription('');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-list-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" 
        onClick={e => e.stopPropagation()}
      >
        <h2 id="create-list-title" className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New List</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="list-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">List Name</label>
              <input
                id="list-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="list-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
              <textarea
                id="list-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md font-semibold">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function Lists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [newItemContent, setNewItemContent] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/lists');
      const data = await response.json();
      if (data.success) {
        setLists(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
      // Mock data as fallback
      setLists([
        { 
          id: 1, 
          name: 'Project Tasks', 
          description: 'Tasks for the main project', 
          ListItems: [
            { id: 101, content: 'Design UI', checked: true }, 
            { id: 102, content: 'Develop API', checked: false }
          ] 
        },
        { 
          id: 2, 
          name: 'Shopping List', 
          description: 'Groceries for the week', 
          ListItems: [] 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async ({ name, description }) => {
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      
      const data = await response.json();
      if (data.success) {
        setLists([...lists, data.data]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating list:', error);
      // Mock creation
      const newList = {
        id: Date.now(),
        name,
        description,
        ListItems: [],
      };
      setLists(prev => [...prev, newList]);
      setShowCreateModal(false);
    }
  };

  const deleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;
    
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setLists(lists.filter(list => list.id !== listId));
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      // Mock deletion
      setLists(lists.filter(list => list.id !== listId));
    }
  };

  const addItem = async (listId) => {
    if (!newItemContent.trim()) return;
    
    try {
      const response = await fetch(`/api/lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newItemContent })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchLists();
        setNewItemContent('');
        setCurrentList(null);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      // Mock addition
      setLists(prevLists => prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            ListItems: [...(list.ListItems || []), {
              id: Date.now(),
              content: newItemContent,
              checked: false
            }]
          };
        }
        return list;
      }));
      setNewItemContent('');
      setCurrentList(null);
    }
  };

  const toggleItem = async (listId, itemId, currentChecked) => {
    try {
      const response = await fetch(`/api/lists/${listId}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checked: !currentChecked })
      });
      
      if (response.ok) {
        fetchLists();
      }
    } catch (error) {
      console.error('Error updating item:', error);
      // Mock toggle
      setLists(prevLists => prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            ListItems: list.ListItems.map(item => 
              item.id === itemId ? { ...item, checked: !item.checked } : item
            )
          };
        }
        return list;
      }));
    }
  };

  const deleteItem = async (listId, itemId) => {
    try {
      const response = await fetch(`/api/lists/${listId}/items/${itemId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchLists();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // Mock deletion
      setLists(prevLists => prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            ListItems: list.ListItems.filter(item => item.id !== itemId)
          };
        }
        return list;
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">📋</span>
            My Lists
          </h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold shadow-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New List
          </button>
        </header>

        {loading ? (
          <LoadingSpinner />
        ) : lists.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No lists yet. Create your first list!</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create List
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {lists.map(list => (
              <div key={list.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col">
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{list.name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{list.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2.5 py-0.5 rounded-full">
                        {list.ListItems?.filter(i => !i.checked).length || 0}
                      </span>
                      <button
                        onClick={() => deleteList(list.id)}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        aria-label="Delete list"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {list.ListItems && list.ListItems.length > 0 ? (
                      list.ListItems.map(item => (
                        <div key={item.id} className="flex items-center group">
                          <input
                            type="checkbox"
                            id={`item-${item.id}`}
                            checked={item.checked}
                            onChange={() => toggleItem(list.id, item.id, item.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <label 
                            htmlFor={`item-${item.id}`}
                            className={`ml-3 flex-1 block text-sm font-medium cursor-pointer ${
                              item.checked 
                              ? 'text-gray-500 dark:text-gray-400 line-through' 
                              : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {item.content}
                          </label>
                          <button
                            onClick={() => deleteItem(list.id, item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                            aria-label="Delete item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No items in this list.</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    addItem(list.id);
                  }} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add new item..."
                      value={currentList === list.id ? newItemContent : ''}
                      onChange={(e) => {
                        setCurrentList(list.id);
                        setNewItemContent(e.target.value);
                      }}
                      onFocus={() => setCurrentList(list.id)}
                      className="flex-grow w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    />
                    <button 
                      type="submit" 
                      disabled={currentList !== list.id || !newItemContent.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-semibold disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateListModal 
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateList}
      />
    </div>
  );
}

export default Lists;