import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import qrRoutes from './routes/qr.routes';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Database connection with better error handling
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/qr', qrRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'QR Check-in System API is running',
    mongodbUri: process.env.MONGODB_URI ? 'MongoDB URI is configured' : 'MongoDB URI is missing'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Environment variables loaded:', {
    port: process.env.PORT,
    mongoDBConfigured: !!process.env.MONGODB_URI
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});