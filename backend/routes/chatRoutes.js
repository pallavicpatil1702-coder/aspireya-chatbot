import express from 'express';
import { getChatHistory, sendMessage, clearChatHistory, saveUserProfile } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/history', getChatHistory);
router.post('/message', sendMessage);
router.post('/clear', clearChatHistory);
router.post('/profile', saveUserProfile);

export default router;
