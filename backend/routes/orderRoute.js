import express from 'express';
import {
  placeOrder,
  // createStripeSession,
  // createRazorpayOrder,
  // verifyRazorpayPayment,
  getAllOrderList,
  getUserOrderList,
  updateOrderStatus,
} from '../controllers/orderController.js';

import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

// User routes
orderRouter.post('/place', authUser, placeOrder);
// orderRouter.post('/stripe', authUser, createStripeSession);
// orderRouter.post('/razorpay', authUser, createRazorpayOrder);
// orderRouter.post('/verify', authUser, verifyRazorpayPayment);
orderRouter.post('/user', authUser, getUserOrderList);

// Admin routes
orderRouter.get('/admin', adminAuth, getAllOrderList);
orderRouter.post('/admin/update', adminAuth, updateOrderStatus);

export default orderRouter;
