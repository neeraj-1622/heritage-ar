
import express from 'express';
import cors from 'cors';
import { connectToDatabase, closeDatabaseConnection } from './database/connection';
import { SiteService } from './services/siteService';
import { defaultSites } from './data/defaultSites';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
let siteService: SiteService;

// Initialize database connection and services
async function initializeServices() {
  try {
    const { db } = await connectToDatabase();
    siteService = new SiteService(db);
    
    // Initialize default data if the collection is empty
    await siteService.initializeDefaultData(defaultSites);
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Routes
app.get('/api/sites', async (req, res) => {
  try {
    const sites = await siteService.getAllSites();
    res.json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ message: 'Failed to fetch sites' });
  }
});

app.get('/api/sites/:id', async (req, res) => {
  try {
    const site = await siteService.getSiteById(req.params.id);
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }
    res.json(site);
  } catch (error) {
    console.error(`Error fetching site ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch site' });
  }
});

app.post('/api/sites', async (req, res) => {
  try {
    const newSite = await siteService.createSite(req.body);
    res.status(201).json(newSite);
  } catch (error) {
    console.error('Error creating site:', error);
    res.status(500).json({ message: 'Failed to create site' });
  }
});

app.put('/api/sites/:id', async (req, res) => {
  try {
    const updatedSite = await siteService.updateSite(req.params.id, req.body);
    if (!updatedSite) {
      return res.status(404).json({ message: 'Site not found' });
    }
    res.json(updatedSite);
  } catch (error) {
    console.error(`Error updating site ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update site' });
  }
});

app.delete('/api/sites/:id', async (req, res) => {
  try {
    const success = await siteService.deleteSite(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Site not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting site ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete site' });
  }
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
