
import React, { useState, useEffect } from 'react';
import SiteCard, { HistoricalSite } from './SiteCard';

// Sample data for historical sites
const sampleSites: HistoricalSite[] = [
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

const SiteGallery: React.FC = () => {
  const [sites, setSites] = useState<HistoricalSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const loadSites = async () => {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setSites(sampleSites);
      
      setIsLoading(false);
    };

    loadSites();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="rounded-2xl bg-heritage-100 h-48 w-full"></div>
            <div className="mt-4 h-5 bg-heritage-100 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-heritage-100 rounded w-1/2"></div>
            <div className="mt-2 h-4 bg-heritage-100 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div key={site.id} className="animate-scale-in">
            <SiteCard site={site} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteGallery;
