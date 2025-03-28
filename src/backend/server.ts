import express, { Request, Response } from 'express';
import cors from 'cors';
import { supabase } from '../lib/supabase';
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
    const { email, password, name } = req.body;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      res.status(400).json({ message: authError.message });
      return;
    }

    // Create user profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([{ id: authData.user?.id, email, name }]);

    if (profileError) {
      res.status(500).json({ message: profileError.message });
      return;
    }

    res.status(201).json({ user: authData.user });
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

    res.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// Public route for all sites
app.get('/api/sites', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data: sites, error } = await supabase
      .from('sites')
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
      .from('sites')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
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
      .from('sites')
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
      .from('sites')
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
      .from('sites')
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
      .from('sites')
      .select('*');

    if (!existingSites || existingSites.length === 0) {
      const { error } = await supabase
        .from('sites')
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
