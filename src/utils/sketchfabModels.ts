
// Map of historical site names to their corresponding Sketchfab model IDs
export const sketchfabModelIds: Record<string, string> = {
  "Parthenon": "fa23b514e7564ebca473d7e041a07118",
  "The Colosseum": "44fc46a0d04547f29b5ea0763fa0e43a",
  "Machu Picchu": "a63454cea04e4d3c9980732b6ee53f07",
  "Taj Mahal": "ba05e56f72f34b3eaf9b93ffa6001fa8",
  "Angkor Wat": "2ea9f5964f304b3eadf1030c4b33338d",
  "Chichen Itza": "6e5b69da9371448e8eebee160b10bfb8",
  // Default model if no matching one is found
  "default": "fa23b514e7564ebca473d7e041a07118"
};

// Function to get the Sketchfab model ID for a given site name
export const getSketchfabModelId = (siteName: string): string => {
  return sketchfabModelIds[siteName] || sketchfabModelIds.default;
};
