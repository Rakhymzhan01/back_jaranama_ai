// src/routes/callback.ts
import express from 'express';

const router = express.Router();

router.post('/shotstack-callback', (req, res) => {
  const { id, status, url } = req.body;

  // Handle the callback logic here
  // For example, you might want to save the video URL to your database

  console.log(`Shotstack callback received: ${status}`);
  if (status === 'done') {
    console.log(`Video URL: ${url}`);
  } else {
    console.error(`Rendering error: ${status}`);
  }

  res.status(200).send('Callback received');
});

export default router;
