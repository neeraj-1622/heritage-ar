
import { connectToDatabase, closeDatabaseConnection } from '../database/connection';
import { SiteService } from '../services/siteService';
import { defaultSites } from '../data/defaultSites';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    const { db } = await connectToDatabase();
    const siteService = new SiteService(db);
    
    // Clear existing data (optional)
    await db.collection('sites').deleteMany({});
    console.log('Cleared existing data');
    
    // Insert default sites
    await siteService.initializeDefaultData(defaultSites);
    console.log('Database seeded successfully with default data');
    
    await closeDatabaseConnection();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase();
