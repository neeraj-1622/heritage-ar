import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { MapPin } from 'lucide-react';

interface TourLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  category: 'food' | 'culture' | 'nature' | 'shopping';
}

const Tour: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // This is just sample data - you can replace with your actual locations
  const cityLocations: TourLocation[] = [
    { id: 1, name: 'Central Market', latitude: 17.3850, longitude: 78.4867, category: 'food' },
    { id: 2, name: 'City Park', latitude: 17.4156, longitude: 78.4347, category: 'nature' },
    { id: 3, name: 'Shopping District', latitude: 17.3616, longitude: 78.4747, category: 'shopping' },
    { id: 4, name: 'Arts Center', latitude: 17.3850, longitude: 78.4867, category: 'culture' },
  ];

  const categories = [
    { id: 'all', name: 'All Places', color: 'bg-gray-500' },
    { id: 'food', name: 'Food & Dining', color: 'bg-orange-500' },
    { id: 'culture', name: 'Cultural Spots', color: 'bg-purple-500' },
    { id: 'nature', name: 'Nature & Parks', color: 'bg-green-500' },
    { id: 'shopping', name: 'Shopping', color: 'bg-blue-500' },
  ];

  const filteredLocations = selectedCategory === 'all' 
    ? cityLocations 
    : cityLocations.filter(location => location.category === selectedCategory);

  return (
    <div className="min-h-screen bg-heritage-950">
      <Header title="City Explorer Tour" showBackButton />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Explore the City
            </h1>
            <p className="text-heritage-300 max-w-2xl mx-auto">
              Discover the best spots around the city. From local cuisine to shopping districts, 
              find your next destination.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === category.id 
                    ? 'bg-accent text-white' 
                    : 'bg-heritage-800 text-heritage-300 hover:bg-heritage-700'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Map Container */}
          <div className="bg-heritage-900/50 rounded-xl p-4 h-[400px] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-heritage-400 text-center">
                Map will be implemented here
                <br />
                (Google Maps/Mapbox integration)
              </p>
            </div>
          </div>

          {/* Location List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map(location => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-heritage-900/50 rounded-lg p-4 hover:bg-heritage-800/50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${categories.find(c => c.id === location.category)?.color || 'bg-gray-500'}`}>
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{location.name}</h3>
                    <p className="text-heritage-400 text-sm">
                      {categories.find(c => c.id === location.category)?.name}
                    </p>
                    <p className="text-heritage-500 text-xs mt-1">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Tour; 