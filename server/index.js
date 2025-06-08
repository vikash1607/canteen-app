import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a proper database)
let users = [];
let foodItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh tomatoes, mozzarella, and basil',
    price: 12.99,
    category: 'Pizza',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '2',
    name: 'Chicken Burger',
    description: 'Juicy grilled chicken burger with lettuce and tomato',
    price: 9.99,
    category: 'Burgers',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing and croutons',
    price: 8.50,
    category: 'Salads',
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '4',
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
    price: 13.50,
    category: 'Pasta',
    image: 'https://images.pexels.com/photos/4518844/pexels-photo-4518844.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '5',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with herbs and lemon',
    price: 18.99,
    category: 'Seafood',
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '6',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with chocolate frosting',
    price: 6.99,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  }
];
let orders = [];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'customer',
      createdAt: new Date()
    };
    
    users.push(user);
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Food items routes
app.get('/api/food-items', (req, res) => {
  res.json(foodItems.filter(item => item.available));
});

app.get('/api/food-items/:id', (req, res) => {
  const item = foodItems.find(item => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Food item not found' });
  }
  res.json(item);
});

// Orders routes
app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;
    
    const order = {
      id: uuidv4(),
      userId: req.user.userId,
      items,
      totalAmount,
      deliveryAddress,
      status: 'pending',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    };
    
    orders.push(order);
    
    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders', authenticateToken, (req, res) => {
  const userOrders = orders.filter(order => order.userId === req.user.userId);
  res.json(userOrders);
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const order = orders.find(order => 
    order.id === req.params.id && order.userId === req.user.userId
  );
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
});

// Payment route (mock implementation)
app.post('/api/payment', authenticateToken, (req, res) => {
  try {
    const { orderId, paymentMethod, amount } = req.body;
    
    // Mock payment processing
    const payment = {
      id: uuidv4(),
      orderId,
      amount,
      paymentMethod,
      status: 'completed',
      transactionId: `txn_${uuidv4()}`,
      processedAt: new Date()
    };
    
    // Update order status
    const order = orders.find(order => order.id === orderId);
    if (order) {
      order.status = 'confirmed';
      order.paymentId = payment.id;
    }
    
    res.json({
      message: 'Payment processed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment processing failed' });
  }
});

// Admin routes (basic implementation)
app.get('/api/admin/orders', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  res.json(orders);
});

app.put('/api/admin/orders/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  const { status } = req.body;
  const order = orders.find(order => order.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  order.status = status;
  order.updatedAt = new Date();
  
  res.json({ message: 'Order status updated', order });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// // Updated version with MongoDB integration
// import express from 'express';
// import cors from 'cors';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { v4 as uuidv4 } from 'uuid';
// import mongoose from 'mongoose';

// const app = express();
// const PORT = 3001;
// const JWT_SECRET = 'your-secret-key-change-in-production';

// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb+srv://2105083:vikash1234@cluster0.abjawd9.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // Schemas and Models
// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String,
//   firstName: String,
//   lastName: String,
//   role: { type: String, default: 'customer' },
//   createdAt: { type: Date, default: Date.now }
// });
// const User = mongoose.model('User', userSchema);

// const foodItemSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   price: Number,
//   category: String,
//   image: String,
//   available: Boolean
// });
// const FoodItem = mongoose.model('FoodItem', foodItemSchema);

// const orderSchema = new mongoose.Schema({
//   userId: String,
//   items: Array,
//   totalAmount: Number,
//   deliveryAddress: String,
//   status: String,
//   createdAt: Date,
//   estimatedDelivery: Date,
//   paymentId: String,
//   updatedAt: Date
// });
// const Order = mongoose.model('Order', orderSchema);

// const paymentSchema = new mongoose.Schema({
//   orderId: String,
//   amount: Number,
//   paymentMethod: String,
//   status: String,
//   transactionId: String,
//   processedAt: Date
// });
// const Payment = mongoose.model('Payment', paymentSchema);

// // Middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// // Auth routes
// app.post('/api/register', async (req, res) => {
//   const { email, password, firstName, lastName } = req.body;
//   const existingUser = await User.findOne({ email });
//   if (existingUser) return res.status(400).json({ message: 'User already exists' });

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new User({ email, password: hashedPassword, firstName, lastName });
//   await user.save();

//   const token = jwt.sign({ userId: user._id, email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

//   res.status(201).json({
//     message: 'User created successfully',
//     token,
//     user: { id: user._id, email, firstName, lastName, role: user.role }
//   });
// });

// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//   const isValid = await bcrypt.compare(password, user.password);
//   if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

//   const token = jwt.sign({ userId: user._id, email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

//   res.json({
//     message: 'Login successful',
//     token,
//     user: { id: user._id, email, firstName: user.firstName, lastName: user.lastName, role: user.role }
//   });
// });

// // Food routes
// app.get('/api/food-items', async (req, res) => {
//   const items = await FoodItem.find({ available: true });
//   res.json(items);
// });

// app.get('/api/food-items/:id', async (req, res) => {
//   const item = await FoodItem.findById(req.params.id);
//   if (!item) return res.status(404).json({ message: 'Food item not found' });
//   res.json(item);
// });

// // Orders
// app.post('/api/orders', authenticateToken, async (req, res) => {
//   const { items, totalAmount, deliveryAddress } = req.body;
//   const order = new Order({
//     userId: req.user.userId,
//     items,
//     totalAmount,
//     deliveryAddress,
//     status: 'pending',
//     createdAt: new Date(),
//     estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000)
//   });
//   await order.save();
//   res.status(201).json({ message: 'Order placed successfully', order });
// });

// app.get('/api/orders', authenticateToken, async (req, res) => {
//   const orders = await Order.find({ userId: req.user.userId });
//   res.json(orders);
// });

// app.get('/api/orders/:id', authenticateToken, async (req, res) => {
//   const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId });
//   if (!order) return res.status(404).json({ message: 'Order not found' });
//   res.json(order);
// });

// // Payment
// app.post('/api/payment', authenticateToken, async (req, res) => {
//   const { orderId, paymentMethod, amount } = req.body;
//   const payment = new Payment({
//     orderId,
//     amount,
//     paymentMethod,
//     status: 'completed',
//     transactionId: `txn_${uuidv4()}`,
//     processedAt: new Date()
//   });
//   await payment.save();

//   const order = await Order.findById(orderId);
//   if (order) {
//     order.status = 'confirmed';
//     order.paymentId = payment._id;
//     await order.save();
//   }

//   res.json({ message: 'Payment processed successfully', payment });
// });

// // Admin routes
// app.get('/api/admin/orders', authenticateToken, async (req, res) => {
//   if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
//   const allOrders = await Order.find();
//   res.json(allOrders);
// });

// app.put('/api/admin/orders/:id/status', authenticateToken, async (req, res) => {
//   if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
//   const { status } = req.body;
//   const order = await Order.findById(req.params.id);
//   if (!order) return res.status(404).json({ message: 'Order not found' });

//   order.status = status;
//   order.updatedAt = new Date();
//   await order.save();

//   res.json({ message: 'Order status updated', order });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on : ${PORT}`);
// });
