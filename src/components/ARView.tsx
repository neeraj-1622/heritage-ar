
import React, { useState } from 'react';
import { HistoricalSite } from './SiteCard';

interface ARViewProps {
  selectedSite?: HistoricalSite;
}

const ARView: React.FC<ARViewProps> = ({ selectedSite }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Simulate AR loading process
  React.useEffect(() => {
    if (!selectedSite) return;
    
    const timer1 = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    const timer2 = setTimeout(() => {
      setIsModelLoaded(true);
    }, 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [selectedSite]);

  if (!selectedSite) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-heritage-100">
        <div className="text-center p-6">
          <h3 className="text-xl font-medium text-heritage-800">No Site Selected</h3>
          <p className="mt-2 text-heritage-600">
            Please select a historical site to view in AR
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black">
      {/* Simulated camera view */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=2070" 
          alt="Camera view" 
          className="h-full w-full object-cover opacity-70"
        />
      </div>

      {/* AR overlay */}
      {isModelLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center animate-fade-in">
          <img 
            src={selectedSite.imageUrl} 
            alt={`AR model of ${selectedSite.name}`} 
            className="h-4/5 object-contain opacity-90"
          />
        </div>
      )}

      {/* Loading indicators */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="h-16 w-16 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
          <p className="mt-4 text-white text-lg">Initializing AR environment...</p>
        </div>
      )}

      {!isLoading && !isModelLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
          <div className="p-6 rounded-2xl glass-panel max-w-xs text-center">
            <p className="text-heritage-800">
              Point your camera at a flat surface to place the {selectedSite.name} model
            </p>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
        <div className="glass-panel rounded-2xl p-4 max-w-lg mx-auto">
          <h3 className="text-lg font-medium text-heritage-900">{selectedSite.name}</h3>
          <p className="text-sm text-heritage-700 mt-1">{selectedSite.shortDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default ARView;
