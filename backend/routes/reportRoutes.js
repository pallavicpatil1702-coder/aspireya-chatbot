import express from 'express';
import { submitAssessment, getReport, upgradeToPremium } from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply session authentication middleware
router.use(authMiddleware);

router.post('/submit', submitAssessment);
router.get('/', getReport);
router.post('/upgrade', upgradeToPremium);

export default router;
