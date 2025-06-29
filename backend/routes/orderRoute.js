import express from 'express';
import {
  placeOrder,
  getAllOrderList,
  getUserOrderList,
  updateOrderStatus,
} from '../controllers/orderController.js';


import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

// User routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/user', authUser, getUserOrderList);

// Admin routes
orderRouter.get('/admin', adminAuth, getAllOrderList);
orderRouter.post('/admin/update', adminAuth, updateOrderStatus);

export default orderRouter;
