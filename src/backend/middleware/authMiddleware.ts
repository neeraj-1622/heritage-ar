
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

// Extend the Request interface to include user property
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = (userService: UserService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const token = authHeader.split(' ')[1];
      const user = await userService.validateToken(token);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      
      // Cast to AuthRequest to add user property
      (req as AuthRequest).user = { id: user.id, email: user.email };
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };
};
