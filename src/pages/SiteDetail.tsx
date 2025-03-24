
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import InfoPanel from '../components/InfoPanel';
import { HistoricalSite } from '../components/SiteCard';

// Sample data - in a real app this would come from an API or database
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

const SiteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<HistoricalSite | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSite = async () => {
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the site with the matching id
      const foundSite = sampleSites.find(s => s.id === id) || null;
      setSite(foundSite);
      
      setIsLoading(false);
    };

    loadSite();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-heritage-50">
        <Header title="Loading..." showBackButton />
        <div className="flex-1 pt-24 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-heritage-200 border-t-accent-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!site) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-heritage-50 animate-fade-in">
      <Header title={site.name} showBackButton />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative h-80 lg:h-full rounded-2xl overflow-hidden shadow-lg animate-slide-up">
              <img 
                src={site.imageUrl} 
                alt={site.name} 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="animate-slide-up delay-150">
              <InfoPanel site={site} />
              
              <div className="mt-8 glass-panel rounded-2xl p-6">
                <h3 className="text-xl font-medium text-heritage-900 mb-4">Historical Context</h3>
                <p className="text-heritage-700">
                  This historical site is a significant cultural landmark that showcases the architectural 
                  brilliance and cultural values of its time. The structure has been preserved through 
                  centuries and continues to be an important destination for researchers and tourists alike.
                </p>
                <p className="mt-4 text-heritage-700">
                  Archaeologists have uncovered numerous artifacts that provide insights into 
                  the daily lives of people who inhabited this region. These findings have contributed 
                  to our understanding of ancient civilizations and their technological advancements.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 glass-panel rounded-2xl p-6 animate-slide-up delay-300">
            <h3 className="text-xl font-medium text-heritage-900 mb-4">Interactive Experience</h3>
            <p className="text-heritage-700">
              Use our AR feature to see this historical site come to life. Point your camera at 
              a flat surface and watch as a detailed 3D model appears before your eyes. You can 
              walk around the model and explore it from different angles.
            </p>
            <div className="mt-6">
              <button className="button-primary">Launch AR Experience</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteDetail;
