
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ARView from '../components/ARView';
import { HistoricalSite } from '../components/SiteCard';
import { ArrowLeft, Image, Settings } from 'lucide-react';

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

const ARExperience: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get('siteId');
  
  const [selectedSite, setSelectedSite] = useState<HistoricalSite | undefined>(
    siteId ? sampleSites.find(site => site.id === siteId) : sampleSites[0]
  );

  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-black flex flex-col animate-fade-in">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsSiteMenuOpen(!isSiteMenuOpen)}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
            aria-label="Change model"
          >
            <Image size={20} />
          </button>
          
          <button 
            className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      {/* Site selection menu */}
      {isSiteMenuOpen && (
        <div className="absolute top-16 right-4 z-20 glass-panel rounded-2xl p-4 w-64 animate-scale-in">
          <h3 className="text-lg font-medium text-heritage-900 mb-3">Select Historical Site</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {sampleSites.map(site => (
              <button
                key={site.id}
                className={`w-full px-3 py-2 text-left rounded-lg transition-colors ${
                  selectedSite?.id === site.id 
                    ? 'bg-accent-500 text-white' 
                    : 'hover:bg-heritage-100 text-heritage-800'
                }`}
                onClick={() => {
                  setSelectedSite(site);
                  setIsSiteMenuOpen(false);
                }}
              >
                {site.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <main className="flex-1">
        <ARView selectedSite={selectedSite} />
      </main>
    </div>
  );
};

export default ARExperience;
