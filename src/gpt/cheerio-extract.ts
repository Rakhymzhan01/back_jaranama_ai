import cheerio from 'cheerio';

export const extractProductDetails = (html: string): { name: string, description: string, features: string[] } => {
    const $ = cheerio.load(html);
    
    // Update selectors based on the actual HTML structure
    const name = $('h1.product-title').text().trim();
    const description = $('div.product-description').text().trim();
    const features = $('ul.product-features li').map((i, el) => $(el).text().trim()).get();

    if (!name || !description) {
        console.error('Failed to extract product details', { name, description, html });
        throw new Error('Failed to extract product details');
    }

    return { name, description, features };
};
