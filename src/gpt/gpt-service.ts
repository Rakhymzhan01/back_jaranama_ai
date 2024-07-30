import { openaiClient } from './openaiClient';
import { scrapeWebsite } from './puppeteer-scraper';
import { ProductInfo, Script } from './gpt-types';

export const gptService = {
  async parseProductInfo(url: string): Promise<ProductInfo> {
    if (!url) {
      throw new Error('URL is required');
    }

    const websiteContent = await scrapeWebsite(url);

    const prompt = `
    Parse the following website content and extract product information in this format:
    Product Name: [Name]
    Description: [Description]
    Key Features:
    - [Feature 1]
    - [Feature 2]
    ...
    Included in the Box:
    - [Item 1]
    - [Item 2]
    ...
    Additional Information:
    - [Info 1]
    - [Info 2]
    ...

    Website content:
    ${websiteContent}
    `;

    const response = await openaiClient.chatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    if (!response.choices || !response.choices.length) {
      throw new Error('No choices found in response');
    }

    const gptResponse = response.choices[0].message?.content;

    if (!gptResponse) {
      throw new Error('No response content found');
    }

    return this.formatGPTResponse(gptResponse);
  },

  formatGPTResponse(gptResponse: string): ProductInfo {
    const lines = gptResponse.split('\n');
    const productInfo: ProductInfo = {
      name: '',
      description: '',
      keyFeatures: [],
      includedItems: [],
      additionalInfo: [],
      images: [] // Initialize images property
    };

    let currentSection: 'keyFeatures' | 'includedItems' | 'additionalInfo' | null = null;

    for (const line of lines) {
      if (line.startsWith('Product Name:')) {
        productInfo.name = line.split(':')[1].trim();
      } else if (line.startsWith('Description:')) {
        productInfo.description = line.split(':')[1].trim();
      } else if (line.startsWith('Key Features:')) {
        currentSection = 'keyFeatures';
      } else if (line.startsWith('Included in the Box:')) {
        currentSection = 'includedItems';
      } else if (line.startsWith('Additional Information:')) {
        currentSection = 'additionalInfo';
      } else if (line.trim().startsWith('-') && currentSection) {
        productInfo[currentSection].push(line.trim().substring(1).trim());
      }
    }

    return productInfo;
  },

  async generateScripts(productInfo: ProductInfo, targetAudience: string) {
    const genres = ['engaging', 'humorous', 'informative', 'emotional'];
    const scripts: Script[] = [];

    for (const genre of genres) {
      const prompt = `
        Write a ${genre} talking head script to promote the ${productInfo.name}. 
        Highlight key features and benefits: ${productInfo.description}. 
        Target audience: ${targetAudience}. Include a strong call to action.
        Note: Only include the dialogue, exclude any stage directions or camera focus instructions.
      `;
      const response = await openaiClient.chatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      });
      const scriptContent = response.choices[0].message?.content ?? '';
      scripts.push({ name: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Script`, script: scriptContent });
    }

    return scripts;
  }
};