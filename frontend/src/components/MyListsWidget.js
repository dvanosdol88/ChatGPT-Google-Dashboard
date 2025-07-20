// Enhanced MyListsWidget Component
// Changes:
// - Replaced all styled-components with Tailwind CSS for a modern, consistent UI.
// - Added full dark mode support (`dark:*` classes).
// - Implemented accessibility best practices (semantic HTML, ARIA roles, focus rings).
// - Structured the component to handle multiple lists, item management, and creation forms.
// - Added smooth transitions for hover and focus states.

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming API calls are made with axios

function MyListsWidget() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [newItemText, setNewItemText] = useState('');
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock fetching lists on initial load
  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        // const response = await axios.get('/api/lists');
        // setLists(response.data);
        // if (response.data.length > 0) {
        //   setSelectedList(response.data[0]);
        // }
        
        // Mock data for demonstration
        const mockLists = [
          { id: 1, name: 'Work Priorities', items: [{ id: 101, text: 'Finish report', completed: false }] },
          { id: 2, name: 'David Priorities', items: [{ id: 102, text: 'Buy groceries', completed: true }] },
        ];
        setLists(mockLists);
        if (mockLists.length > 0) setSelectedList(mockLists[0]);

      } catch (err) {
        setError('Failed to load lists.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const newList = { id: Date.now(), name: newListName, items: [] };
    setLists([...lists, newList]);
    setSelectedList(newList);
    setNewListName('');
    // TODO: Add API call to persist the new list
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim() || !selectedList) return;
    const newItem = { id: Date.now(), text: newItemText, completed: false };
    const updatedLists = lists.map(list => 
      list.id === selectedList.id 
        ? { ...list, items: [...list.items, newItem] } 
        : list
    );
    setLists(updatedLists);
    setSelectedList(updatedLists.find(l => l.id === selectedList.id));
    setNewItemText('');
    // TODO: Add API call to persist the new item
  };

  const handleToggleItem = (itemId) => {
    const updatedLists = lists.map(list => {
      if (list.id === selectedList.id) {
        return {
          ...list,
          items: list.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return list;
    });
    setLists(updatedLists);
    setSelectedList(updatedLists.find(l => l.id === selectedList.id));
    // TODO: Add API call to persist the change
  };

  const handleDeleteList = () => {
    if (!selectedList || !window.confirm(`Are you sure you want to delete the list "${selectedList.name}"?`)) return;
    const updatedLists = lists.filter(list => list.id !== selectedList.id);
    setLists(updatedLists);
    setSelectedList(updatedLists.length > 0 ? updatedLists[0] : null);
    // TODO: Add API call to delete the list
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 h-full flex flex-col transition-shadow duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700" aria-labelledby="mylists-widget-title">
      <header className="flex items-center justify-between mb-4">
        <h2 id="mylists-widget-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
          My Lists
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
          Sync with Drive
        </button>
      </header>

      <nav className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {lists.map(list => (
          <button
            key={list.id}
            onClick={() => setSelectedList(list)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500
              ${selectedList?.id === list.id 
                ? 'bg-blue-600 text-white font-semibold' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {list.name}
          </button>
        ))}
      </nav>

      <div className="flex-grow flex flex-col min-h-0">
        {loading ? <p role="status" className="text-center text-gray-500 dark:text-gray-400">Loading lists...</p> : null}
        {error ? <div role="alert" className="text-center text-red-600 dark:text-red-400">{error}</div> : null}

        {!loading && !error && (
          <>
            {selectedList ? (
              <div className="flex-grow flex flex-col min-h-0">
                <div className="flex-grow overflow-y-auto pr-2 -mr-4">
                  {selectedList.items.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">This list is empty.</p>
                  ) : (
                    <ul className="space-y-1">
                      {selectedList.items.map(item => (
                        <li key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <input 
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggleItem(item.id)}
                            aria-labelledby={`item-text-${item.id}`}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                          />
                          <span id={`item-text-${item.id}`} className={`flex-grow ${item.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                            {item.text}
                          </span>
                          {/* Optional: Delete item button */}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <form onSubmit={handleAddItem} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Add a new item..."
                    aria-label="Add new item to list"
                    className="flex-grow w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Add</button>
                </form>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>No lists found. Create one to get started!</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleCreateList} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="New list name..."
                  aria-label="Create new list"
                  className="flex-grow w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Create</button>
                {selectedList && (
                  <button 
                    type="button" 
                    onClick={handleDeleteList}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label={`Delete list ${selectedList.name}`}
                  >
                    Delete
                  </button>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default MyListsWidget;