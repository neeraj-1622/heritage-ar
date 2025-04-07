
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HistoricalSite, HistoricalSiteInput } from '@/lib/supabase';
import { Json } from '@/integrations/supabase/types';

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
    name: 'Stonehenge',
    period: 'Neolithic',
    location: 'Wiltshire, England',
    short_description: 'A prehistoric monument consisting of a ring of standing stones, each around 13 feet high, seven feet wide, and weighing around 25 tons.',
    image_url: 'https://images.unsplash.com/photo-1564207550505-32a0f9c622b6?q=80&w=2065&auto=format&fit=crop',
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

// Helper function to convert database site to HistoricalSite type
const mapDbSiteToHistoricalSite = (site: any): HistoricalSite => {
  return {
    id: site.id,
    name: site.name,
    period: site.period,
    location: site.location,
    short_description: site.short_description,
    long_description: site.long_description,
    image_url: site.image_url,
    ar_model_url: site.ar_model_url,
    coordinates: site.coordinates ? site.coordinates as { lat: number; lng: number } : undefined,
    created_at: site.created_at,
    updated_at: site.updated_at,
    created_by: site.created_by
  };
};

/**
 * Get all historical sites
 * @returns Promise containing array of sites or error
 */
export const getAllSites = async (): Promise<{
  sites: HistoricalSite[];
  error: string | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('historical_sites')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching sites:', error);
      return { sites: fallbackSites, error: error.message };
    }

    if (!data || data.length === 0) {
      console.warn('No sites found, using fallback data');
      return { sites: fallbackSites, error: null };
    }

    // Convert data to HistoricalSite type
    const sites = data.map(mapDbSiteToHistoricalSite);
    return { sites, error: null };
  } catch (error) {
    console.error('Error in getAllSites:', error);
    toast({
      title: 'Error fetching sites',
      description: 'Could not retrieve site information. Please try again later.',
      variant: 'destructive',
    });
    return { sites: fallbackSites, error: 'Failed to fetch sites' };
  }
};

/**
 * Get site by ID
 * @param id Site ID
 * @returns Promise containing site or error
 */
export const getSiteById = async (
  id: string
): Promise<{
  site: HistoricalSite | null;
  error: string | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('historical_sites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching site:', error);
      return { site: null, error: error.message };
    }

    return { site: mapDbSiteToHistoricalSite(data), error: null };
  } catch (error) {
    console.error('Error in getSiteById:', error);
    toast({
      title: 'Error fetching site details',
      description: 'Could not retrieve site information. Please try again later.',
      variant: 'destructive',
    });
    return { site: null, error: 'Failed to fetch site details' };
  }
};

/**
 * Create a new site
 * @param site Site data
 * @returns Promise containing created site or error
 */
export const createSite = async (
  site: HistoricalSiteInput
): Promise<{
  site: HistoricalSite | null;
  error: string | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('historical_sites')
      .insert([site])
      .select()
      .single();

    if (error) {
      console.error('Error creating site:', error);
      return { site: null, error: error.message };
    }

    toast({
      title: 'Site created',
      description: `${site.name} has been added successfully!`,
    });

    return { site: mapDbSiteToHistoricalSite(data), error: null };
  } catch (error) {
    console.error('Error in createSite:', error);
    toast({
      title: 'Error creating site',
      description: 'Could not create the site. Please try again later.',
      variant: 'destructive',
    });
    return { site: null, error: 'Failed to create site' };
  }
};

/**
 * Update an existing site
 * @param id Site ID
 * @param site Updated site data
 * @returns Promise containing updated site or error
 */
export const updateSite = async (
  id: string,
  site: Partial<HistoricalSiteInput>
): Promise<{
  site: HistoricalSite | null;
  error: string | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('historical_sites')
      .update(site)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating site:', error);
      return { site: null, error: error.message };
    }

    toast({
      title: 'Site updated',
      description: `Changes to ${site.name || 'site'} have been saved!`,
    });

    return { site: mapDbSiteToHistoricalSite(data), error: null };
  } catch (error) {
    console.error('Error in updateSite:', error);
    toast({
      title: 'Error updating site',
      description: 'Could not update the site. Please try again later.',
      variant: 'destructive',
    });
    return { site: null, error: 'Failed to update site' };
  }
};

/**
 * Delete a site
 * @param id Site ID
 * @returns Promise containing success status or error
 */
export const deleteSite = async (
  id: string
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    const { error } = await supabase
      .from('historical_sites')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting site:', error);
      return { success: false, error: error.message };
    }

    toast({
      title: 'Site deleted',
      description: `${id} has been removed successfully!`,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in deleteSite:', error);
    toast({
      title: 'Error deleting site',
      description: 'Could not delete the site. Please try again later.',
      variant: 'destructive',
    });
    return { success: false, error: 'Failed to delete site' };
  }
};
