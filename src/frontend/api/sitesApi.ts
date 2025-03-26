
import { toast } from '@/hooks/use-toast';

export const fetchAllSites = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/sites');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error fetching sites: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sites:', error);
    toast({
      title: "Error loading sites",
      description: "Could not load sites. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchSiteById = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/sites/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error fetching site ${id}: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching site ${id}:`, error);
    toast({
      title: "Error loading site",
      description: "Could not load site details. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};
