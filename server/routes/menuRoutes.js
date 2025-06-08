const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItemById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, menuController.createMenuItem);
router.put('/:id', authMiddleware, adminMiddleware, menuController.updateMenuItem);
router.delete('/:id', authMiddleware, adminMiddleware, menuController.deleteMenuItem);

module.exports = router;