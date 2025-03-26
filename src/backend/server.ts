
import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectToDatabase, closeDatabaseConnection } from './database/connection';
import { SiteService } from './services/siteService';
import { UserService } from './services/userService';
import { defaultSites } from './data/defaultSites';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const services = {
  siteService: null as SiteService | null,
  userService: null as UserService | null
};

// Initialize database connection and services
async function initializeServices() {
  try {
    const { db } = await connectToDatabase();
    services.siteService = new SiteService(db);
    services.userService = new UserService(db);
    
    // Initialize default data if the collection is empty
    await services.siteService.initializeDefaultData(defaultSites);
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Authentication Routes
app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!services.userService) {
      res.status(500).json({ message: 'Service not initialized' });
      return;
    }
    const newUser = await services.userService.registerUser(req.body);
    if (!newUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('Invalid email') || 
          error.message.includes('Username must be') || 
          error.message.includes('Password must be') ||
          error.message.includes('Email already exists')) {
        res.status(400).json({ message: error.message });
        return;
      }
    }
    res.status(500).json({ message: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!services.userService) {
      res.status(500).json({ message: 'Service not initialized' });
      return;
    }
    const user = await services.userService.loginUser(req.body);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// Public route for all sites
app.get('/api/sites', async (_req: Request, res: Response): Promise<void> => {
  try {
    if (!services.siteService) {
      res.status(500).json({ message: 'Service not initialized' });
      return;
    }
    const sites = await services.siteService.getAllSites();
    res.json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ message: 'Failed to fetch sites' });
  }
});

// Public route for single site details
app.get('/api/sites/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!services.siteService) {
      res.status(500).json({ message: 'Service not initialized' });
      return;
    }
    const site = await services.siteService.getSiteById(req.params.id);
    if (!site) {
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
app.post('/api/sites', async (req: Request, res: Response): Promise<void> => {
  if (!services.userService) {
    res.status(500).json({ message: 'Service not initialized' });
    return;
  }
  const auth = authMiddleware(services.userService);
  auth(req, res, async () => {
    try {
      if (!services.siteService) {
        res.status(500).json({ message: 'Service not initialized' });
        return;
      }
      const newSite = await services.siteService.createSite(req.body);
      res.status(201).json(newSite);
    } catch (error) {
      console.error('Error creating site:', error);
      res.status(500).json({ message: 'Failed to create site' });
    }
  });
});

app.put('/api/sites/:id', async (req: Request, res: Response): Promise<void> => {
  if (!services.userService) {
    res.status(500).json({ message: 'Service not initialized' });
    return;
  }
  const auth = authMiddleware(services.userService);
  auth(req, res, async () => {
    try {
      if (!services.siteService) {
        res.status(500).json({ message: 'Service not initialized' });
        return;
      }
      const updatedSite = await services.siteService.updateSite(req.params.id, req.body);
      if (!updatedSite) {
        res.status(404).json({ message: 'Site not found' });
        return;
      }
      res.json(updatedSite);
    } catch (error) {
      console.error(`Error updating site ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to update site' });
    }
  });
});

app.delete('/api/sites/:id', async (req: Request, res: Response): Promise<void> => {
  if (!services.userService) {
    res.status(500).json({ message: 'Service not initialized' });
    return;
  }
  const auth = authMiddleware(services.userService);
  auth(req, res, async () => {
    try {
      if (!services.siteService) {
        res.status(500).json({ message: 'Service not initialized' });
        return;
      }
      const success = await services.siteService.deleteSite(req.params.id);
      if (!success) {
        res.status(404).json({ message: 'Site not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting site ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to delete site' });
    }
  });
});

// Start server
initializeServices().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Server shutting down...');
  await closeDatabaseConnection();
  process.exit(0);
});
