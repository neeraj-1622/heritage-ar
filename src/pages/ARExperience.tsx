
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ARView from '../components/ARView';
import { HistoricalSite } from '../components/SiteCard';
import { ArrowLeft, Image, Settings, Camera, Layers, Compass, Info } from 'lucide-react';

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
  const [isInitializing, setIsInitializing] = useState(true);
  const [showTip, setShowTip] = useState(false);
  const [showARModel, setShowARModel] = useState(false);

  useEffect(() => {
    // Hide footer when AR Experience mounts and restore when unmounting
    document.body.classList.add('ar-mode');
    
    return () => {
      document.body.classList.remove('ar-mode');
    };
  }, []);

  useEffect(() => {
    // When site changes, reset AR model visibility
    setShowARModel(false);
  }, [selectedSite]);

  useEffect(() => {
    // Simulate AR initialization
    const timer = setTimeout(() => {
      setIsInitializing(false);
      
      // Show tip after a short delay
      setTimeout(() => {
        setShowTip(true);
        
        // Hide tip after a few seconds
        setTimeout(() => {
          setShowTip(false);
        }, 5000);
      }, 1000);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col animate-fade-in">
      {/* AR Camera view */}
      <main className="flex-1 relative">
        <ARView selectedSite={selectedSite} showModel={showARModel} />
        
        {/* AR UI Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Status indicators */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            {isInitializing && (
              <div className="glass-panel px-4 py-2 rounded-full flex items-center animate-pulse">
                <div className="h-2 w-2 rounded-full bg-accent mr-2"></div>
                <span className="text-sm text-white font-medium">Initializing AR environment...</span>
              </div>
            )}
            
            {showTip && !isInitializing && !showARModel && (
              <div className="glass-panel px-4 py-2 rounded-full flex items-center animate-slide-up">
                <Info className="h-4 w-4 text-white mr-2" />
                <span className="text-sm text-white">Move your device to scan the environment</span>
              </div>
            )}
          </div>
          
          {/* AR interface elements */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 pointer-events-auto">
            <button 
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              onClick={() => setShowARModel(!showARModel)}
            >
              <Layers className="h-6 w-6 text-white" />
            </button>
            
            <button 
              className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              onClick={() => setShowARModel(!showARModel)}
            >
              <Camera className="h-8 w-8 text-white" />
            </button>
            
            <button 
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Compass className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
        
        {/* Top navigation bar */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/40 transition-colors pointer-events-auto"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex space-x-2 pointer-events-auto">
            <button 
              onClick={() => setIsSiteMenuOpen(!isSiteMenuOpen)}
              className={`p-2 rounded-full backdrop-blur-md text-white transition-colors ${
                isSiteMenuOpen ? 'bg-accent/70' : 'bg-black/30 hover:bg-black/40'
              }`}
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
          <div className="absolute top-16 right-4 z-20 glass-panel rounded-2xl p-4 w-64 animate-scale-in pointer-events-auto">
            <h3 className="text-lg font-medium text-white mb-3">Select Historical Site</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {sampleSites.map(site => (
                <button
                  key={site.id}
                  className={`w-full px-3 py-2 text-left rounded-lg transition-all ${
                    selectedSite?.id === site.id 
                      ? 'bg-accent/70 text-white' 
                      : 'hover:bg-white/10 text-white/80'
                  }`}
                  onClick={() => {
                    setSelectedSite(site);
                    setIsSiteMenuOpen(false);
                    // Reset AR model visibility when changing sites
                    setShowARModel(false);
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md overflow-hidden mr-2 flex-shrink-0">
                      <img 
                        src={site.imageUrl} 
                        alt={site.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{site.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ARExperience;
