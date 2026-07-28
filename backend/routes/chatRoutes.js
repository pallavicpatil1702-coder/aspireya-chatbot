import express from 'express';
import multer from 'multer';
import { 
  getConversations, 
  getChatHistory, 
  sendMessage, 
  clearChatHistory, 
  saveUserProfile,
  renameConversation,
  deleteConversation
} from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/conversations', getConversations);
router.get('/history/:conversationId', getChatHistory);
// Fallback for frontend that might still call /history without ID initially
router.get('/history', getChatHistory); 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload PDF, DOCX, TXT, PNG, JPG, or WEBP.'));
    }
  }
});

router.post('/message', upload.single('file'), sendMessage);
router.post('/conversations/:conversationId/clear', clearChatHistory);
router.post('/conversations/:conversationId/title', renameConversation);
router.delete('/conversations/:conversationId', deleteConversation);
router.post('/profile', saveUserProfile);

export default router;
