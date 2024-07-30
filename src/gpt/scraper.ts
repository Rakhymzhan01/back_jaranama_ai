import axios from 'axios';

export const fetchProductPage = async (productUrl: string): Promise<string> => {
    try {
        const response = await axios.get(productUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        const contentType = response.headers['content-type'];
        
        if (!contentType || !contentType.includes('text/html')) {
            console.error(`Fetched content is not HTML. Content-Type: ${contentType}`);
            throw new Error('Fetched content is not HTML');
        }

        const pageContent = response.data;
        console.log('Fetched HTML content:', pageContent);

        // Check if the content contains typical error messages
        if (pageContent.includes('404: This page could not be found') || pageContent.includes('error')) {
            console.error('Product page not found or returned an error');
            throw new Error('Product page not found or returned an error');
        }

        return pageContent;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Failed to fetch product page: ${error.message}`, { url: productUrl, error, status: error.response?.status, headers: error.response?.headers, data: error.response?.data });
            throw new Error(`Failed to fetch product page: ${error.message}`);
        } else {
            console.error(`Failed to fetch product page: ${String(error)}`, { url: productUrl, error });
            throw new Error(`Failed to fetch product page: ${String(error)}`);
        }
    }
};
