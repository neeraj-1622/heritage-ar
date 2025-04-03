
/**
 * This file maps historical site names to their corresponding Sketchfab model IDs.
 * When adding new models, add the site name and Sketchfab model ID here.
 */

// Map of historical site names to Sketchfab model IDs
const sketchfabModels: Record<string, string> = {
  'Parthenon': '949004775c8b40b297a275806a5beff1',
  'Colosseum': '9d05f35747bb40c29490904a4d3ff117',
  'Pyramids of Giza': '73c4622dbd8a41fba34854c1f8b53f07',
  'Stonehenge': 'aaa534f8bc1e43579174e0bcb9eb6b09',
  'Machu Picchu': 'b3392461848c48d2b59e79ff44566b7d',
  'Taj Mahal': '23043e2b6c4d42a4a4a91a6a261c36ba',
  'Great Wall of China': '55191e529151435c81afbecef4efbf80',
  'Angkor Wat': 'f0fb4cb6f03f4b0eb3fc410c93cd6b81',
  'Moai Easter Island': 'fb97bbf3c3ec44f9a148b65fc0f2b8bf',
  'Chichen Itza': '75c7cf0e31c3495292b050e905bddd4e',
  'Temple of Luxor': '4288b8e567854d39a38fe77160f7aa26',
  'Acropolis': '7e5ebd780c7c40ed957e08552f0e193d'
};

/**
 * Get the Sketchfab model ID for a given historical site name
 * 
 * @param siteName The name of the historical site
 * @returns The Sketchfab model ID or a default model ID if not found
 */
export const getSketchfabModelId = (siteName: string): string => {
  if (!siteName) return '';
  
  // Check if the exact name exists in the map
  if (sketchfabModels[siteName]) {
    return sketchfabModels[siteName];
  }
  
  // Try to find a partial match
  const siteKey = Object.keys(sketchfabModels).find(
    key => key.toLowerCase().includes(siteName.toLowerCase()) || 
           siteName.toLowerCase().includes(key.toLowerCase())
  );
  
  if (siteKey) {
    return sketchfabModels[siteKey];
  }
  
  // Return a default model if no match is found
  // Using Parthenon as the default
  console.log(`No model found for ${siteName}, using default`);
  return sketchfabModels['Parthenon'];
};

/**
 * Get all available historical site names that have Sketchfab models
 * 
 * @returns Array of site names
 */
export const getAvailableSiteNames = (): string[] => {
  return Object.keys(sketchfabModels);
};
