import axios from 'axios';

const testGenerateVideo = async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/generate-video', {
            url: 'https://www.technodom.kz/p/noutbuk-apple-macbook-pro-14-m3-8c10g-512-space-grey-mtl73ru-276123?utm_source=google&utm_medium=cpc&utm_campaign=20598984394&gad_source=1&gclid=CjwKCAjw-O6zBhASEiwAOHeGxdL1fcJewI2Y8oGDYFwcz9a_4-u7WUP1NNqi70qvOB7V_yatpsh8NBoChscQAvD_BwE'  // Replace with a real product page URL
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Response:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error Response:', error.response?.data || 'No response data');
            console.error('Error Status:', error.response?.status || 'No response status');
            console.error('Error Headers:', error.response?.headers || 'No response headers');
        } else {
            console.error('Error Message:', (error as Error).message);
        }
    }
};

testGenerateVideo();
