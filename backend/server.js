import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import adminRouter from './routes/adminRoute.js';

const app = express();
const port = process.env.PORT || 4000;


connectCloudinary(); // ✅ If still using Cloudinary

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/user', userRouter);
app.use('/api/admin',adminRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));
