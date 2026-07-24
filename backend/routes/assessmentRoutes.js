import express from "express";
import { getAssessmentQuestions } from "../controllers/assessmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/questions", getAssessmentQuestions);

export default router;