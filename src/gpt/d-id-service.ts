import axios from 'axios';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';
dotenv.config();

const DID_API_KEY = process.env.DID_API_KEY || 'your_did_api_key';
const encodedApiKey = Buffer.from(DID_API_KEY).toString('base64');
console.log(encodedApiKey); // Print the encoded API key to verify


export async function generateVideoDID(inputText: string): Promise<string> {
  console.log("Generating video with D-ID...");

  const payload = {
    source_url: "https://github.com/de-id/live-streaming-demo/blob/main/emma_idle.png?raw=true",
    script: {
      type: "text",
      input: inputText,
      provider: {
        type: "microsoft",
        voice_id: "en-US-JennyNeural"
      }
    },
    config: {
      fluent: false,
      pad_audio: 0.0,
      result_format: "mp4"
    }
  };

  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'authorization': `Basic ${encodedApiKey}`
  };

  try {
    const response = await axios.post('https://api.d-id.com/talks', payload, { headers });
    if (response.status === 201) {
      console.log("D-ID video generated successfully");
      return response.data.id;
    } else {
      console.error('Unexpected response status:', response.status);
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error in generateVideoDID:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);
      } else if (error.request) {
        console.error("Request:", error.request);
      } else {
        console.error("Message:", error.message);
      }
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

export async function checkVideoStatus(talkId: string): Promise<{ status: string, result_url?: string }> {
  try {
    const response = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
      headers: {
        'authorization': `Basic ${encodedApiKey}`
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error checking video status:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);
      } else if (error.request) {
        console.error("Request:", error.request);
      } else {
        console.error("Message:", error.message);
      }
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}
