import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cloudinary from 'cloudinary';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

import userRouter from './Route/UserRoute.js';
import jobRouter from './Route/JobRoute.js';
import ExpertRouter from './Controller/ExpertController.js';
import ApplicationRouter from './Route/Applicationroute.js';
import GoogleRouter from './Route/GoogleRoute.js';
import { passp } from './config/passport.js';
dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_KEY);

// Cloudinary config
cloudinary.v2.config({ 
  cloud_name: 'dneeum0v1', 
  api_key: '951164984623356', 
  api_secret: 'YC86zF3N1b5Ue0EhxX5GjK2SoOg' 
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CON);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Redis client


// Middleware
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

// Routes
app.use('/api/auth', userRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/application', ApplicationRouter);
app.use('/api', ExpertRouter);
app.use(passp.initialize())
app.use('/api',GoogleRouter)
// Payment Endpoint
app.post('/payment', async (req, res) => {
  try {
    const { expert } = req.body;
    console.log(expert);

    const idHash = await bcrypt.hash(expert.id, 10);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: expert.name },
          unit_amount: expert.price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONT_URL}/success/expert/${expert.id}`,
      cancel_url: `${process.env.FRONT_URL}/cancel/expert`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
}); 

// Start server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});


 

