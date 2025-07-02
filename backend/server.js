import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';

import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import adminRouter from './routes/adminRoute.js';

const app = express();
const port = process.env.PORT || 4000;

const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = yaml.parse(file);


connectCloudinary(); // ✅ If still using Cloudinary

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Routes
app.use('/api/user', userRouter);
app.use('/api/admin',adminRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('API Working');
  console.log('DATABASE_URL at runtime:', process.env.DATABASE_URL);

});

app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));
