import express from 'express';
import { userController } from './user-controller';

const router = express.Router();

router.post('/some-endpoint', userController.someFunction); // Adjust the route and function as necessary

export default router; // Use default export
