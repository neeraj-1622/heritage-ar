
import { toast } from '@/hooks/use-toast';

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

export const fetchAllSites = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/sites');
    
    if (!response.ok) {
      console.warn('API request failed, using fallback data');
      return fallbackSites;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sites:', error);
    console.warn('API request failed, using fallback data');
    
    // Don't show error toast if we're using fallback data
    // toast({
    //   title: "Error loading sites",
    //   description: "Could not load sites. Please try again later.",
    //   variant: "destructive",
    // });
    
    return fallbackSites;
  }
};

export const fetchSiteById = async (id: string) => {
  try {
    // Check if id is invalid or has placeholder value
    if (!id || id === ':id') {
      throw new Error('Invalid site ID');
    }
    
    const response = await fetch(`http://localhost:5000/api/sites/${id}`);
    
    if (!response.ok) {
      // For specific site, fallback to the matching site from our hardcoded data
      const fallbackSite = fallbackSites.find(site => site.id === id);
      if (fallbackSite) {
        console.warn(`API request failed for site ID ${id}, using fallback data`);
        return fallbackSite;
      }
      const errorData = await response.json();
      throw new Error(`Error fetching site ${id}: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
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
