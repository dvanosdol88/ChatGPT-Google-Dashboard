import express from 'express';
import { List, ListItem } from '../models/index.js';

const router = express.Router();

// GET /api/lists - Get all lists
router.get('/', async (req, res) => {
  try {
    const lists = await List.findAll({
      include: [{
        model: ListItem,
        order: [['position', 'ASC'], ['createdAt', 'ASC']]
      }],
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: lists
    });
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lists'
    });
  }
});

// POST /api/lists - Create new list
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'List name is required'
      });
    }
    
    const list = await List.create({ name, description });
    
    res.status(201).json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({
      success: false,
      error: error.name === 'SequelizeUniqueConstraintError' 
        ? 'List with this name already exists' 
        : 'Failed to create list'
    });
  }
});

// GET /api/lists/:id - Get single list with items
router.get('/:id', async (req, res) => {
  try {
    const list = await List.findByPk(req.params.id, {
      include: [{
        model: ListItem,
        order: [['position', 'ASC'], ['createdAt', 'ASC']]
      }]
    });
    
    if (!list) {
      return res.status(404).json({
        success: false,
        error: 'List not found'
      });
    }
    
    res.json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch list'
    });
  }
});

// DELETE /api/lists/:id - Delete list
router.delete('/:id', async (req, res) => {
  try {
    const list = await List.findByPk(req.params.id);
    
    if (!list) {
      return res.status(404).json({
        success: false,
        error: 'List not found'
      });
    }
    
    await list.destroy(); // This will cascade delete all items
    
    res.json({
      success: true,
      message: 'List deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete list'
    });
  }
});

// POST /api/lists/:id/items - Add item to list
router.post('/:id/items', async (req, res) => {
  try {
    const { content } = req.body;
    const listId = req.params.id;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Item content is required'
      });
    }
    
    // Check if list exists
    const list = await List.findByPk(listId);
    if (!list) {
      return res.status(404).json({
        success: false,
        error: 'List not found'
      });
    }
    
    // Get max position
    const maxPosition = await ListItem.max('position', { where: { listId } }) || 0;
    
    const item = await ListItem.create({
      listId,
      content,
      position: maxPosition + 1
    });
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item'
    });
  }
});

// PATCH /api/lists/:listId/items/:itemId - Update list item
router.patch('/:listId/items/:itemId', async (req, res) => {
  try {
    const { content, checked, position } = req.body;
    const { listId, itemId } = req.params;
    
    const item = await ListItem.findOne({
      where: { id: itemId, listId }
    });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    if (content !== undefined) item.content = content;
    if (checked !== undefined) item.checked = checked;
    if (position !== undefined) item.position = position;
    
    await item.save();
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update item'
    });
  }
});

// DELETE /api/lists/:listId/items/:itemId - Delete list item
router.delete('/:listId/items/:itemId', async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    
    const item = await ListItem.findOne({
      where: { id: itemId, listId }
    });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    await item.destroy();
    
    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete item'
    });
  }
});

// PATCH /api/lists/:listId/items/:itemId/toggle - Toggle item checked status
router.patch('/:listId/items/:itemId/toggle', async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    
    const item = await ListItem.findOne({
      where: { id: itemId, listId }
    });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    item.checked = !item.checked;
    await item.save();
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error toggling item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle item'
    });
  }
});

export default router;