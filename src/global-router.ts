import express from 'express';
import gptRouter from './gpt/gpt-router'; // Default import

const router = express.Router();

router.use('/api/gpt', gptRouter);

export default router;
