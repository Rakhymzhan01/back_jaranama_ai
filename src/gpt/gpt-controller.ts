// src/gpt/gpt-controller.ts
import { Request, Response } from 'express';
import { gptService } from './gpt-service'; // Assuming you have other services
import { generateVideoDID, checkVideoStatus } from './d-id-service';

export const gptController = {
  async parseProduct(req: Request, res: Response) {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      const productInfo = await gptService.parseProductInfo(url);
      res.json(productInfo);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to parse product information' });
    }
  },

  async generateScripts(req: Request, res: Response) {
    try {
      const { targetAudience, productInfo } = req.body;
      if (!targetAudience || !productInfo) {
        return res.status(400).json({ error: 'Target audience and product info are required' });
      }

      const scripts = await gptService.generateScripts(productInfo, targetAudience);
      res.json(scripts);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to generate scripts' });
    }
  },

  async generateProductVideo(req: Request, res: Response) {
    const { script } = req.body;

    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    try {
      const talkId = await generateVideoDID(script);
      let videoStatus = await checkVideoStatus(talkId);

      while (videoStatus.status !== 'done') {
        await new Promise(resolve => setTimeout(resolve, 5000));
        videoStatus = await checkVideoStatus(talkId);
      }

      const talkingFaceUrl = videoStatus.result_url;
      if (!talkingFaceUrl) {
        return res.status(500).json({ error: 'Failed to get the talking face video URL' });
      }

      res.status(200).json({ videoUrl: talkingFaceUrl });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
};
