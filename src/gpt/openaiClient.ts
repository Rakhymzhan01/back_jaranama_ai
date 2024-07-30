import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

export const openaiClient = {
  async chatCompletion(params: any) {
    console.log('Sending prompt to OpenAI:', params);
    const response = await openai.chat.completions.create(params);
    console.log('Received response from OpenAI:', response);
    return response;
  }
};
