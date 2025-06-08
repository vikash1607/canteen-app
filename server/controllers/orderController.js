const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    const userId = req.userId;

    // Validate items
    const menuItems = await MenuItem.find({ 
      _id: { $in: items.map(item => item.itemId) } 
    });

    if (menuItems.length !== items.length) {
      return res.status(400).json({ error: 'Invalid menu items' });
    }

    // Calculate total and prepare order items
    let total = 0;
    const orderItems = items.map(item => {
      const menuItem = menuItems.find(mi => mi._id.equals(item.itemId));
      total += menuItem.price * item.quantity;
      return {
        itemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity
      };
    });

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      total,
      paymentMethod
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('items.itemId', 'name image');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    }).populate('items.itemId', 'name image description');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById };