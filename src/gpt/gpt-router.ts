// src/gpt/gpt-router.ts
import express from 'express';
import { gptController } from './gpt-controller';

const router = express.Router();

router.post('/parse-product', gptController.parseProduct);
router.post('/generate-scripts', gptController.generateScripts);
router.post('/generate-video', gptController.generateProductVideo);

export default router;
