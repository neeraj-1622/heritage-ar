import { supabase } from '../../lib/supabase';
import { defaultSites } from '../data/defaultSites';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data (optional)
    const { error: deleteError } = await supabase
      .from('historical_sites')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (deleteError) {
      throw deleteError;
    }
    console.log('Cleared existing data');
    
    // Insert default sites
    const { error: insertError } = await supabase
      .from('historical_sites')
      .insert(defaultSites.map(site => ({
        name: site.name,
        period: site.period,
        location: site.location,
        short_description: site.shortDescription,
        long_description: site.longDescription,
        image_url: site.imageUrl,
        coordinates: site.coordinates
      })));
    
    if (insertError) {
      throw insertError;
    }
    console.log('Database seeded successfully with default data');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
