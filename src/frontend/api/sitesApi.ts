
// API client for historical sites

const BASE_URL = 'http://localhost:5000/api';

export const fetchAllSites = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sites`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
};

export const fetchSiteById = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/sites/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching site with ID ${id}:`, error);
    throw error;
  }
};

export const createSite = async (siteData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};

export const updateSite = async (id: string, siteData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/sites/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating site with ID ${id}:`, error);
    throw error;
  }
};

export const deleteSite = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/sites/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting site with ID ${id}:`, error);
    throw error;
  }
};
