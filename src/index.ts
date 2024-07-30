// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import globalRouter from './global-router';
import callbackRouter from './routes/callback';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', callbackRouter); // Add the callback router under the '/api' path
app.use(globalRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
