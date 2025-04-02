
import express, { Request, Response } from 'express';
import cors from 'cors';
import { supabase } from '@/integrations/supabase/client';
import { defaultSites } from './data/defaultSites';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, displayName } = req.body;
    
    // Build the redirect URL from origin or default to localhost
    const origin = req.headers.origin || 'http://localhost:5173';
    const redirectUrl = `${origin}/login?verified=true`;
    
    // Register with Supabase Auth (auto-generates confirmation email)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name,
          display_name: displayName || name,
        }
      }
    });

    if (authError) {
      res.status(400).json({ message: authError.message });
      return;
    }

    // Create user profile in user_profiles table
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{ 
        id: authData.user?.id, 
        username: name, 
        email: email,
        display_name: displayName || name,
        avatar_url: null
      }]);

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      
      // Don't fail registration if profile creation fails
      // The trigger should handle this
      console.log('Relying on database trigger to create profile');
    } else {
      console.log('User profile created successfully during registration');
    }

    res.status(201).json({ 
      user: authData.user, 
      message: 'Verification email sent. Please check your inbox to verify your email address before logging in.'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ message: error.message });
      return;
    }

    // Check if email is verified
    if (!data.user.email_confirmed_at) {
      res.status(403).json({ 
        message: 'Email not verified. Please check your inbox and verify your email before logging in.',
        emailVerification: false
      });
      return;
    }

    // Check if user profile exists, if not create one
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profileData) {
      const displayName = data.user.user_metadata?.display_name || 
                         data.user.user_metadata?.name || 
                         data.user.email?.split('@')[0];
      const username = data.user.user_metadata?.name || data.user.email?.split('@')[0];
      
      console.log('Creating missing profile during login:', {
        id: data.user.id,
        username,
        display_name: displayName,
        email: data.user.email
      });
      
      // Create user profile if it doesn't exist
      await supabase
        .from('user_profiles')
        .insert([{ 
          id: data.user.id, 
          username: username || 'User', 
          display_name: displayName || username || 'User',
          email: data.user.email || '',
          avatar_url: null
        }]);
    }

    res.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

app.post('/api/auth/resend-verification', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    // Build the redirect URL from origin or default to localhost
    const origin = req.headers.origin || 'http://localhost:5173';
    const redirectUrl = `${origin}/login?verified=true`;
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl,
      }
    });

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(200).json({ message: 'Verification email resent. Please check your inbox.' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ message: 'Failed to resend verification email' });
  }
});

// Public route for all sites
app.get('/api/sites', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data: sites, error } = await supabase
      .from('historical_sites')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ message: 'Failed to fetch sites' });
  }
});

// Public route for single site details
app.get('/api/sites/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: site, error } = await supabase
      .from('historical_sites')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      console.error(`Error fetching site ${req.params.id}:`, error);
      res.status(404).json({ message: 'Site not found' });
      return;
    }

    res.json(site);
  } catch (error) {
    console.error(`Error fetching site ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch site' });
  }
});

// Protected routes (require authentication)
app.post('/api/sites', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: site, error } = await supabase
      .from('historical_sites')
      .insert([{ ...req.body, created_by: (req as any).user.id }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(site);
  } catch (error) {
    console.error('Error creating site:', error);
    res.status(500).json({ message: 'Failed to create site' });
  }
});

app.put('/api/sites/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: site, error } = await supabase
      .from('historical_sites')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('created_by', (req as any).user.id)
      .select()
      .single();

    if (error) {
      res.status(404).json({ message: 'Site not found or unauthorized' });
      return;
    }

    res.json(site);
  } catch (error) {
    console.error(`Error updating site ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update site' });
  }
});

app.delete('/api/sites/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase
      .from('historical_sites')
      .delete()
      .eq('id', req.params.id)
      .eq('created_by', (req as any).user.id);

    if (error) {
      res.status(404).json({ message: 'Site not found or unauthorized' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting site ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete site' });
  }
});

// Initialize default data
async function initializeDefaultData() {
  try {
    const { data: existingSites } = await supabase
      .from('historical_sites')
      .select('*');

    if (!existingSites || existingSites.length === 0) {
      const { error } = await supabase
        .from('historical_sites')
        .insert(defaultSites);

      if (error) {
        console.error('Error initializing default sites:', error);
      } else {
        console.log('Default sites initialized successfully');
      }
    }
  } catch (error) {
    console.error('Error checking/initializing default sites:', error);
  }
}

// Start server
initializeDefaultData().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
