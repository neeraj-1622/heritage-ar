
import { toast } from '@/hooks/use-toast';
import { supabase, HistoricalSite, HistoricalSiteInput } from '@/lib/supabase';

// Sample data to use if API fails or during development
const fallbackSites = [
  {
    id: '1',
    name: 'The Colosseum',
    period: 'Ancient Rome',
    location: 'Rome, Italy',
    short_description: 'An oval amphitheatre in the centre of Rome, built of travertine limestone, tuff, and brick-faced concrete.',
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Machu Picchu',
    period: 'Inca Civilization',
    location: 'Cusco Region, Peru',
    short_description: 'A 15th-century Inca citadel situated on a mountain ridge above the Sacred Valley.',
    image_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Parthenon',
    period: 'Ancient Greece',
    location: 'Athens, Greece',
    short_description: 'A former temple dedicated to the goddess Athena, completed in 438 BC.',
    image_url: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Taj Mahal',
    period: 'Mughal Empire',
    location: 'Agra, India',
    short_description: 'An ivory-white marble mausoleum commissioned in 1632 by the Mughal emperor Shah Jahan.',
    image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Angkor Wat',
    period: 'Khmer Empire',
    location: 'Siem Reap, Cambodia',
    short_description: 'A temple complex and the largest religious monument in the world, built in the early 12th century.',
    image_url: 'https://images.unsplash.com/photo-1508159452718-d22f6734a00d?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '6',
    name: 'Chichen Itza',
    period: 'Maya Civilization',
    location: 'Yucatán, Mexico',
    short_description: 'A pre-Columbian city built by the Maya people, known for its step pyramid El Castillo.',
    image_url: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=2067&auto=format&fit=crop',
  },
];

// Transform Supabase response to match expected format
const transformSiteData = (site: any): any => ({
  id: site.id,
  name: site.name,
  period: site.period,
  location: site.location,
  shortDescription: site.short_description,
  longDescription: site.long_description,
  imageUrl: site.image_url,
  arModelUrl: site.ar_model_url,
  coordinates: site.coordinates,
  createdAt: site.created_at,
  updatedAt: site.updated_at,
});

// Export function for compatibility
export const fetchSiteById = getSiteById;

export async function getAllSites(): Promise<HistoricalSite[]> {
  try {
    console.log("Fetching sites from Supabase...");
    const { data, error } = await supabase
      .from('historical_sites')
      .select('*');

    if (error) {
      console.error('Error fetching sites:', error);
      // Use fallback data if Supabase connection fails
      console.log("Using fallback site data");
      return fallbackSites.map(site => ({
        id: site.id,
        name: site.name,
        period: site.period,
        location: site.location,
        short_description: site.short_description,
        image_url: site.image_url,
      }));
    }

    console.log("Sites data from Supabase:", data);
    return data || [];
  } catch (error) {
    console.error('Error in getAllSites:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch historical sites. Using fallback data.',
      variant: 'destructive',
    });
    
    // Return fallback data in case of error
    return fallbackSites.map(site => ({
      id: site.id,
      name: site.name,
      period: site.period,
      location: site.location,
      short_description: site.short_description,
      image_url: site.image_url,
    }));
  }
}

export async function getSiteById(id: string): Promise<HistoricalSite | null> {
  try {
    const { data, error } = await supabase
      .from('historical_sites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching site:', error);
      // Find the site in the fallback data
      const fallbackSite = fallbackSites.find(site => site.id === id);
      if (fallbackSite) {
        return {
          id: fallbackSite.id,
          name: fallbackSite.name,
          period: fallbackSite.period,
          location: fallbackSite.location,
          short_description: fallbackSite.short_description,
          image_url: fallbackSite.image_url,
        };
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in getSiteById for ID ${id}:`, error);
    toast({
      title: 'Error',
      description: 'Failed to fetch site details',
      variant: 'destructive',
    });
    return null;
  }
}

export async function createSite(site: HistoricalSiteInput): Promise<HistoricalSite | null> {
  try {
    const { data, error } = await supabase
      .from('historical_sites')
      .insert([site])
      .select()
      .single();

    if (error) {
      console.error('Error creating site:', error);
      throw error;
    }

    toast({
      title: 'Success',
      description: 'Historical site created successfully',
    });

    return data;
  } catch (error) {
    console.error('Error in createSite:', error);
    toast({
      title: 'Error',
      description: 'Failed to create historical site',
      variant: 'destructive',
    });
    return null;
  }
}

export async function updateSite(id: string, site: Partial<HistoricalSiteInput>): Promise<HistoricalSite | null> {
  try {
    const { data, error } = await supabase
      .from('historical_sites')
      .update(site)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating site:', error);
      throw error;
    }

    toast({
      title: 'Success',
      description: 'Historical site updated successfully',
    });

    return data;
  } catch (error) {
    console.error(`Error in updateSite for ID ${id}:`, error);
    toast({
      title: 'Error',
      description: 'Failed to update historical site',
      variant: 'destructive',
    });
    return null;
  }
}

export async function deleteSite(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('historical_sites')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting site:', error);
      throw error;
    }

    toast({
      title: 'Success',
      description: 'Historical site deleted successfully',
    });

    return true;
  } catch (error) {
    console.error(`Error in deleteSite for ID ${id}:`, error);
    toast({
      title: 'Error',
      description: 'Failed to delete historical site',
      variant: 'destructive',
    });
    return false;
  }
}
