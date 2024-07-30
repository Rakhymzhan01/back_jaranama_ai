import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DID_API_KEY = process.env.DID_API_KEY || 'your_did_api_key';
const encodedApiKey = Buffer.from(DID_API_KEY).toString('base64');

async function generateVideoDID(script: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.d-id.com/talks',
      {
        script,
        source_url: 'https://your-source-url', // Replace with your source URL if needed
      },
      {
        headers: {
          'Authorization': `Basic ${encodedApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.id; // Assuming the ID is returned in the response
  } catch (error) {
    console.error('Error generating video with D-ID:', error);
    throw error;
  }
}

async function fetchVideoUrl(didVideoId: string): Promise<string> {
  try {
    const response = await axios.get(`https://api.d-id.com/talks/${didVideoId}`, {
      headers: {
        'Authorization': `Basic ${encodedApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.result_url; // Assuming the result URL is returned in the response
  } catch (error) {
    console.error('Error fetching video URL:', error);
    throw error;
  }
}

export async function createVideo(script: string): Promise<string> {
  try {
    console.log('Generating video with D-ID...');
    const didVideoId = await generateVideoDID(script);
    console.log('D-ID video generated successfully');

    console.log('Fetching video URL...');
    const videoUrl = await fetchVideoUrl(didVideoId);
    console.log('Video URL fetched successfully:', videoUrl);

    return videoUrl;
  } catch (error) {
    console.error('Error in createVideo:', error);
    throw error;
  }
}
