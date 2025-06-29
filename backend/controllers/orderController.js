// import Stripe from 'stripe';
// import razorpay from 'razorpay';
// import crypto from 'crypto';
import {
  createOrder,
  updateOrder,
  getAllOrders,
  getUserOrders,
  getOrderByReceiptId,
} from '../services/orderService.js';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const razorpayInstance = new razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// ✅ Place Order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address, paymentMethod } = req.body;

    const order = await createOrder({
      userId: Number(userId),
      amount: parseFloat(amount),
      address,
      paymentMethod,
      payment: paymentMethod === 'COD' ? false : true, // fix
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

// ✅ Stripe Payment
// export const createStripeSession = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items: [{
//         price_data: {
//           currency: 'inr',
//           product_data: { name: 'Product Payment' },
//           unit_amount: Math.round(amount * 100),
//         },
//         quantity: 1,
//       }],
//       success_url: `${process.env.FRONTEND_URL}/success`,
//       cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//     });

//     res.json({ success: true, sessionUrl: session.url });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// ✅ Razorpay Order
// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const options = {
//       amount: Math.round(amount * 100),
//       currency: 'INR',
//       receipt: `${Date.now()}`,
//     };

//     const order = await razorpayInstance.orders.create(options);
//     res.json({ success: true, order });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// ✅ Razorpay Payment Verification
// export const verifyRazorpayPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

//     const signature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest('hex');

//     if (signature === razorpay_signature) {
//       // ✅ Mark order as paid
//       await updateOrder(orderId, {
//         payment: true,
//         status: 'Paid via Razorpay',
//       });

//       res.json({ success: true, message: "Payment verified" });
//     } else {
//       res.json({ success: false, message: "Invalid signature" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// ✅ Admin: Get All Orders
export const getAllOrderList = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ User: Get Their Orders
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

// ✅ Admin: Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await updateOrder(orderId, { status });
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
