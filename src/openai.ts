// src/openai.ts
import axios from 'axios';

const openaiAPI = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  }
});

export default openaiAPI;
