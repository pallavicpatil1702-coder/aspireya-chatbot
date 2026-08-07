import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { firebaseIsMock } from './config/firebase.js';
import { aiIsMock } from './config/gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with support for custom headers
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Session-Id', 'session-id']
}));

app.use(express.json());

// Root health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    firebaseMode: firebaseIsMock ? 'mock' : 'production',
    geminiMode: aiIsMock ? 'mock' : 'production'
  });
});

// Register api endpoints
app.use('/api/chat', chatRoutes);

app.use('/api/assessment', assessmentRoutes);

app.use('/api/report', reportRoutes);

app.use('/api/payment', paymentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Aspireya AI Server running on port ${PORT}`);
  console.log(` Firebase Admin Mode: ${firebaseIsMock ? '⚠️ MOCK DEVELOPMENT' : '✅ SECURE/PRODUCTION'}`);
  console.log(` Gemini API Mode:     ${aiIsMock ? '⚠️ MOCK DEVELOPMENT' : '✅ GOOGLE STUDIO'}`);
  console.log(`=================================================`);
});
// Trigger reload

