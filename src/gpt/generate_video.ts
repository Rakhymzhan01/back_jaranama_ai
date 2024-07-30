// src/gpt/generate_video.ts
import { Request, Response } from 'express';
import { generateVideoDID, checkVideoStatus } from './d-id-service';

export const generateProductVideo = async (req: Request, res: Response) => {
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

    const videoUrl = videoStatus.result_url;
    if (!videoUrl) {
      return res.status(500).json({ error: 'Failed to get the video URL' });
    }

    res.status(200).json({ videoUrl });
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};
