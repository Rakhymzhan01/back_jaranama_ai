import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
const SHOTSTACK_BASE_URL = 'https://api.shotstack.io/stage';

export const createVideoWithPhotos = async (jsonResult: any): Promise<string> => {
  const response = await axios.post(`${SHOTSTACK_BASE_URL}/render`, jsonResult, {
    headers: {
      'x-api-key': SHOTSTACK_API_KEY,
      'Content-Type': 'application/json'
    },
  });

  if (response.status === 201) {
    return response.data.response.id;
  } else {
    throw new Error(`Unexpected response status: ${response.status}`);
  }
};

export const fetchStatus = async (renderId: string): Promise<any> => {
  const url = `${SHOTSTACK_BASE_URL}/render/${renderId}`;
  console.log(url);

  while (true) {
    const response = await axios.get(url, { headers: { 'x-api-key': SHOTSTACK_API_KEY } });
    console.log("response: " + url);

    const body = response.data;

    if (body.response.status === 'done') {
      return body;
    } else if (body.response.error) {
      console.error('Rendering error:', body.response.error);
      break;
    }

    console.log('Current status:', body.response.status);
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
};
