import axios from 'axios';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

const pexelsClient = axios.create({
    baseURL: PEXELS_BASE_URL,
    headers: {
        Authorization: PEXELS_API_KEY,
    },
});

export const fetchProductMedia = async (query: string) => {
    const response = await pexelsClient.get(`/search`, {
        params: { query, per_page: 10 },
    });
    return response.data.photos;
};
