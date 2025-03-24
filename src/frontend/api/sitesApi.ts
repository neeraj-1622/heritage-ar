
import { HistoricalSite, HistoricalSiteInput } from '../../backend/models/HistoricalSite';

const API_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = localStorage.getItem('heritageAR_user');
  if (!user) return {};
  
  const { token } = JSON.parse(user);
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const fetchAllSites = async (): Promise<HistoricalSite[]> => {
  try {
    const response = await fetch(`${API_URL}/sites`);
    
    if (!response.ok) {
      throw new Error(`Error fetching sites: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
};

export const fetchSiteById = async (id: string): Promise<HistoricalSite> => {
  try {
    const response = await fetch(`${API_URL}/sites/${id}`, {
      headers: {
        ...getAuthHeaders(),
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching site ${id}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching site ${id}:`, error);
    throw error;
  }
};

export const createSite = async (siteData: HistoricalSiteInput): Promise<HistoricalSite> => {
  try {
    const response = await fetch(`${API_URL}/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(siteData),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating site: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};

export const updateSite = async (id: string, siteData: Partial<HistoricalSiteInput>): Promise<HistoricalSite> => {
  try {
    const response = await fetch(`${API_URL}/sites/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(siteData),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating site ${id}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating site ${id}:`, error);
    throw error;
  }
};

export const deleteSite = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/sites/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting site ${id}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error deleting site ${id}:`, error);
    throw error;
  }
};
