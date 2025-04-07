
import { supabase } from '@/integrations/supabase/client';
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
    
    // Insert default sites with corrected model URLs
    const sitesWithUpdatedModels = defaultSites.map(site => {
      // Ensure model URLs are correctly set
      let ar_model_url = site.ar_model_url;
      
      // Set model URLs based on site name if not already set
      if (!ar_model_url) {
        switch (site.name) {
          case 'The Colosseum':
            ar_model_url = '/models/colosseum.glb';
            break;
          case 'Parthenon':
            ar_model_url = '/models/parthenon.glb';
            break;
          case 'Taj Mahal':
            ar_model_url = '/models/taj_mahal.glb';
            break;
          case 'Stonehenge':
            ar_model_url = '/models/stonehenge.glb';
            break;
          default:
            ar_model_url = '/models/parthenon.glb'; // Default fallback
        }
      }
      
      return {
        ...site,
        ar_model_url
      };
    });
    
    const { error: insertError } = await supabase
      .from('historical_sites')
      .insert(sitesWithUpdatedModels.map(site => ({
        name: site.name,
        period: site.period,
        location: site.location,
        short_description: site.short_description,
        long_description: site.long_description,
        image_url: site.image_url,
        coordinates: site.coordinates,
        ar_model_url: site.ar_model_url
      })));
    
    if (insertError) {
      throw insertError;
    }
    console.log('Database seeded successfully with default data and corrected model URLs');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
