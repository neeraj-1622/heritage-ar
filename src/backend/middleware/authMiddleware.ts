
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client for the backend
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Extend the Request interface to include user property
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    // Add user info to request
    (req as AuthRequest).user = { id: user.id, email: user.email! };
    
    // Check if user profile exists in user_profiles table, create if not exists
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (profileError || !profileData) {
      // Create profile if doesn't exist
      await supabase
        .from('user_profiles')
        .insert([{ 
          id: user.id, 
          username: user.email?.split('@')[0] || 'User', 
          email: user.email || '',
          avatar_url: null
        }]);
    }
    
    next();
    return;
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
