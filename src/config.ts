// src/config.ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  DID_API_KEY: process.env.DID_API_KEY,
  PEXELS_API_KEY: process.env.PEXELS_API_KEY,
  SHOTSTACK_API_KEY: process.env.SHOTSTACK_API_KEY,
  SHOTSTACK_STAGE_URL: 'https://api.shotstack.io/stage',
};

Object.entries(config).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`Missing ${key} environment variable`);
  }
});
