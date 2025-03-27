
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ARView from '../components/ARView';
import ARModelViewer from '../components/ARModelViewer';
import { HistoricalSite } from '../components/SiteCard';
import { ArrowLeft, Image, Camera, Layers, Compass, Info, Scan } from 'lucide-react';
import { toast } from "sonner";

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
  
  const [selectedSiteIndex, setSelectedSiteIndex] = useState<number>(
    siteId ? sampleSites.findIndex(site => site.id === siteId) : 0
  );
  const [selectedSite, setSelectedSite] = useState<HistoricalSite>(
    sampleSites[selectedSiteIndex >= 0 ? selectedSiteIndex : 0]
  );

  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showTip, setShowTip] = useState(false);
  const [showARModel, setShowARModel] = useState(false);
  const [enableRotation, setEnableRotation] = useState(false);
  const [useRealAR, setUseRealAR] = useState(false);

  useEffect(() => {
    document.body.classList.add('ar-mode');
    
    return () => {
      document.body.classList.remove('ar-mode');
    };
  }, []);

  useEffect(() => {
    setShowARModel(false);
  }, [selectedSite]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
      
      setTimeout(() => {
        setShowTip(true);
        
        setTimeout(() => {
          setShowTip(false);
        }, 5000);
      }, 1000);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBackToHome = () => {
    console.log("Back to home clicked");
    navigate('/');
  };

  const handleNextSite = () => {
    const nextIndex = (selectedSiteIndex + 1) % sampleSites.length;
    setSelectedSiteIndex(nextIndex);
    setSelectedSite(sampleSites[nextIndex]);
    toast.success(`Switched to ${sampleSites[nextIndex].name}`);
  };

  const handleMoreInfo = () => {
    navigate(`/site/${selectedSite.id}`);
  };

  const handleSiteSelect = (site: HistoricalSite) => {
    const siteIndex = sampleSites.findIndex(s => s.id === site.id);
    if (siteIndex >= 0) {
      setSelectedSiteIndex(siteIndex);
      setSelectedSite(site);
      setIsSiteMenuOpen(false);
      setShowARModel(false);
      toast.success(`Selected ${site.name}`);
    }
  };

  const toggleARModel = () => {
    console.log("Toggle AR model called");
    setShowARModel(!showARModel);
    if (!showARModel) {
      toast.success(`Showing 3D model of ${selectedSite.name}`);
    } else {
      toast.info(`Hiding 3D model of ${selectedSite.name}`);
    }
  };

  const toggleRotation = () => {
    console.log("Toggle rotation called");
    setEnableRotation(!enableRotation);
    toast.success(enableRotation ? 'Rotation disabled' : 'Rotation enabled');
  };

  const toggleRealAR = () => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => {
          if (supported) {
            setUseRealAR(!useRealAR);
            toast.success(useRealAR ? 'Switched to simulated AR' : 'Switched to real AR');
          } else {
            toast.error('WebXR AR not supported on this device');
          }
        })
        .catch(() => {
          toast.error('Error checking AR support');
        });
    } else {
      toast.error('WebXR not supported in this browser');
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col animate-fade-in">
      <main className="flex-1 relative">
        {useRealAR ? (
          <ARModelViewer 
            selectedSite={selectedSite} 
            arMode={true}
            enableRotation={enableRotation}
          />
        ) : (
          <ARView 
            selectedSite={selectedSite} 
            showModel={showARModel} 
            enableRotation={enableRotation}
            onNextSite={handleNextSite}
            onInfoClick={handleMoreInfo}
          />
        )}
        
        <div className="absolute inset-0 pointer-events-none">
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
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 pointer-events-auto">
            <div className="relative group">
              <button 
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                onClick={() => toggleARModel()}
                aria-label="Toggle AR layers"
              >
                <Layers className="h-6 w-6 text-white" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Toggle AR layers
              </div>
            </div>
            
            <div className="relative group">
              <button 
                className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                onClick={() => toggleARModel()}
                aria-label="Show 3D model"
              >
                <Camera className="h-8 w-8 text-white" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {showARModel ? 'Hide' : 'Show'} 3D model
              </div>
            </div>
            
            <div className="relative group">
              <button 
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                onClick={() => toggleRotation()}
                aria-label="Enable rotation"
              >
                <Compass className="h-6 w-6 text-white" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {enableRotation ? 'Disable' : 'Enable'} rotation
              </div>
            </div>
            
            <div className="relative group">
              <button 
                className="w-14 h-14 rounded-full bg-accent/70 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                onClick={() => toggleRealAR()}
                aria-label="Toggle Real AR"
              >
                <Scan className="h-6 w-6 text-white" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {useRealAR ? 'Use Simulated AR' : 'Use Real AR'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
          <button 
            onClick={handleBackToHome}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/40 transition-colors pointer-events-auto active:scale-95"
            aria-label="Go back to home"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex space-x-2 pointer-events-auto">
            <button 
              onClick={() => setIsSiteMenuOpen(!isSiteMenuOpen)}
              className={`p-2 rounded-full backdrop-blur-md text-white transition-colors active:scale-95 ${
                isSiteMenuOpen ? 'bg-accent/70' : 'bg-black/30 hover:bg-black/40'
              }`}
              aria-label="Historical sites"
            >
              <Image size={20} />
            </button>
          </div>
        </div>
        
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
                  onClick={() => handleSiteSelect(site)}
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
