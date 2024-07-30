import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export async function fetchProductImages(productName: string) {
  console.log(`Fetching product images for: ${productName}`);
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(productName)}&per_page=5`;
  const headers = { Authorization: PEXELS_API_KEY };
  try {
    const response = await axios.get(url, { headers });
    const images = response.data.photos.map((photo: any) => photo.src.original);
    console.log(`Fetched images: ${images}`);
    return images;
  } catch (error) {
    console.error("Error in fetchProductImages:", error);
    throw error;
  }
}
