import React, { useState, useEffect } from 'react';
import { Card, Button, Form, ListGroup, Modal, Badge, Spinner } from 'react-bootstrap';
import { Plus, Trash2, Edit2, Check, X, List as ListIcon } from 'lucide-react';

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  const [editingItem, setEditingItem] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    if (!newListName.trim()) return;
    
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newListName,
          description: newListDescription
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setLists([...lists, data.data]);
        setShowCreateModal(false);
        setNewListName('');
        setNewListDescription('');
      }
    } catch (error) {
      console.error('Error creating list:', error);
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
        // Refresh lists to show new item
        fetchLists();
        setNewItemContent('');
      }
    } catch (error) {
      console.error('Error adding item:', error);
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
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <ListIcon className="me-2" size={24} />
          My Lists
        </h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} className="me-1" /> New List
        </Button>
      </div>

      {lists.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <p className="text-muted mb-3">No lists yet. Create your first list!</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={20} className="me-1" /> Create List
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="row">
          {lists.map(list => (
            <div key={list.id} className="col-md-6 col-lg-4 mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{list.name}</h5>
                  <div>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger p-1"
                      onClick={() => deleteList(list.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {list.description && (
                    <p className="text-muted small mb-3">{list.description}</p>
                  )}
                  
                  <ListGroup variant="flush" className="mb-3">
                    {list.ListItems && list.ListItems.map(item => (
                      <ListGroup.Item
                        key={item.id}
                        className="d-flex align-items-center px-0"
                      >
                        <Form.Check
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleItem(list.id, item.id, item.checked)}
                          className="me-2"
                        />
                        <span
                          className={`flex-grow-1 ${item.checked ? 'text-decoration-line-through text-muted' : ''}`}
                        >
                          {item.content}
                        </span>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-1"
                          onClick={() => deleteItem(list.id, item.id)}
                        >
                          <X size={16} />
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    addItem(list.id);
                  }}>
                    <Form.Group className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Add new item..."
                        value={currentList === list.id ? newItemContent : ''}
                        onChange={(e) => {
                          setCurrentList(list.id);
                          setNewItemContent(e.target.value);
                        }}
                        onFocus={() => setCurrentList(list.id)}
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        className="ms-2"
                        disabled={currentList !== list.id || !newItemContent.trim()}
                      >
                        <Plus size={20} />
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Create List Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>List Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Shopping List, ToDo"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="What is this list for?"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={createList}
            disabled={!newListName.trim()}
          >
            Create List
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Lists;