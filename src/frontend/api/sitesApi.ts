
import { toast } from '@/hooks/use-toast';
import { supabase, HistoricalSite } from '@/lib/supabase';

// Sample data to use if API fails or during development
const fallbackSites = [
  {
    id: '1',
    name: 'The Colosseum',
    period: 'Ancient Rome',
    location: 'Rome, Italy',
    shortDescription: 'An oval amphitheatre in the centre of Rome, built of travertine limestone, tuff, and brick-faced concrete.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Machu Picchu',
    period: 'Inca Civilization',
    location: 'Cusco Region, Peru',
    shortDescription: 'A 15th-century Inca citadel situated on a mountain ridge above the Sacred Valley.',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Parthenon',
    period: 'Ancient Greece',
    location: 'Athens, Greece',
    shortDescription: 'A former temple dedicated to the goddess Athena, completed in 438 BC.',
    imageUrl: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Taj Mahal',
    period: 'Mughal Empire',
    location: 'Agra, India',
    shortDescription: 'An ivory-white marble mausoleum commissioned in 1632 by the Mughal emperor Shah Jahan.',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Angkor Wat',
    period: 'Khmer Empire',
    location: 'Siem Reap, Cambodia',
    shortDescription: 'A temple complex and the largest religious monument in the world, built in the early 12th century.',
    imageUrl: 'https://images.unsplash.com/photo-1508159452718-d22f6734a00d?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '6',
    name: 'Chichen Itza',
    period: 'Maya Civilization',
    location: 'Yucatán, Mexico',
    shortDescription: 'A pre-Columbian city built by the Maya people, known for its step pyramid El Castillo.',
    imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=2067&auto=format&fit=crop',
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

export const fetchAllSites = async () => {
  try {
    const { data, error } = await supabase
      .from('historical_sites')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching sites from Supabase:', error);
      console.warn('API request failed, using fallback data');
      return fallbackSites;
    }
    
    return data.map(transformSiteData);
  } catch (error) {
    console.error('Error fetching sites:', error);
    console.warn('API request failed, using fallback data');
    return fallbackSites;
  }
};

export const fetchSiteById = async (id: string) => {
  try {
    // Check if id is invalid or has placeholder value
    if (!id || id === ':id') {
      throw new Error('Invalid site ID');
    }
    
    const { data, error } = await supabase
      .from('historical_sites')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      // For specific site, fallback to the matching site from our hardcoded data
      const fallbackSite = fallbackSites.find(site => site.id === id);
      if (fallbackSite) {
        console.warn(`API request failed for site ID ${id}, using fallback data`);
        return fallbackSite;
      }
      throw new Error(`Error fetching site ${id}: ${error.message}`);
    }
    
    return transformSiteData(data);
  } catch (error) {
    console.error(`Error fetching site ${id}:`, error);
    
    // Try to find the site in our fallback data
    const fallbackSite = fallbackSites.find(site => site.id === id);
    if (fallbackSite) {
      console.warn(`Using fallback data for site ID ${id}`);
      return fallbackSite;
    }
    
    toast({
      title: "Error loading site",
      description: "Could not load site details. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};
