// src/user/user-controller.ts
import { Request, Response } from 'express';

export const userController = {
  someFunction: (req: Request, res: Response) => {
    // Your implementation here
    res.send('User endpoint hit');
  }
};
