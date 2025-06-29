import {
  createOrder,
  updateOrder,
  getAllOrders,
  getUserOrders,
} from '../services/orderService.js';

/**
 * ✅ Place Order (COD or Prepaid marker)
 */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address, paymentMethod } = req.body;

    const order = await createOrder({
      userId: Number(userId),
      amount: parseFloat(amount),
      address,
      paymentMethod,
      payment: paymentMethod === 'COD' ? false : true,
      status: 'Order Placed',
      date: Date.now(),
      items: {
        create: items.map((item) => ({
          productId: Number(item.productId),
          quantity: item.quantity,
          size: item.size,
        })),
      },
    });

    res.json({ success: true, message: 'Order placed', orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ Admin: Get all orders
 */
export const getAllOrderList = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ User: Get their orders
 */
export const getUserOrderList = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await getUserOrders(userId);
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ Admin: Update order status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await updateOrder(orderId, { status });
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
