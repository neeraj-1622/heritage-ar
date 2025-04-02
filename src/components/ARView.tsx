import React, { useState, useEffect } from 'react';
import { HistoricalSite } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ARViewProps {
  modelUrl?: string;
  selectedSite?: HistoricalSite;
  showModel?: boolean;
  enableRotation?: boolean;
  onNextSite?: () => void;
  onInfoClick?: () => void;
}

const ARView: React.FC<ARViewProps> = ({ 
  selectedSite, 
  modelUrl,
  showModel = true,
  enableRotation = false,
  onNextSite,
  onInfoClick
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!selectedSite && !modelUrl) return;
    
    setIsLoading(true);
    setIsModelLoaded(false);
    setCameraReady(false);
    
    const timer1 = setTimeout(() => {
      setCameraReady(true);
      setIsLoading(false);
    }, 1500);
    
    const timer2 = setTimeout(() => {
      if (showModel) {
        setIsModelLoaded(true);
      }
    }, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [selectedSite, modelUrl, showModel]);

  useEffect(() => {
    if (cameraReady && showModel && !isModelLoaded) {
      const timer = setTimeout(() => {
        setIsModelLoaded(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (!showModel && isModelLoaded) {
      setIsModelLoaded(false);
    }
  }, [showModel, cameraReady, isModelLoaded]);

  useEffect(() => {
    if (!isModelLoaded) return;
    
    let rotationInterval: NodeJS.Timeout | null = null;
    
    if (enableRotation) {
      rotationInterval = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360);
      }, 50);
    }
    
    return () => {
      if (rotationInterval) clearInterval(rotationInterval);
    };
  }, [isModelLoaded, enableRotation]);

  useEffect(() => {
    if (!isModelLoaded) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 5;
      
      setModelPosition({
        x: x,
        y: y,
        z: 0
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isModelLoaded]);

  const handleGoBack = () => {
    navigate('/');
  };

  if (!selectedSite && !modelUrl) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-heritage-100">
        <button 
          onClick={handleGoBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-heritage-800/50 text-white hover:bg-heritage-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="text-center p-6 animate-fade-in">
          <h3 className="text-xl font-medium text-heritage-800">No Site Selected</h3>
          <p className="mt-2 text-heritage-600">
            Please select a historical site to view in AR
          </p>
        </div>
      </div>
    );
  }

  const imageUrl = selectedSite?.image_url || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2071&auto=format&fit=crop';
  const siteName = selectedSite?.name || 'Historical Monument';

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      <button 
        onClick={handleGoBack}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-heritage-800/50 text-white hover:bg-heritage-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2071&auto=format&fit=crop" 
          alt="Camera view" 
          className={`h-full w-full object-cover transition-opacity duration-1000 ${
            cameraReady ? 'opacity-90' : 'opacity-0'
          }`}
        />
        
        {cameraReady && !isModelLoaded && (
          <div className="absolute inset-0 z-5 animate-fade-in">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div 
              className="absolute inset-x-0 bottom-0 h-1/3 transform-gpu perspective-1000"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, transparent 1px, transparent 20px),
                                repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, transparent 1px, transparent 20px)`,
                transform: 'rotateX(60deg)',
                transformOrigin: 'bottom',
                backgroundSize: '20px 20px',
              }}
            ></div>
          </div>
        )}
      </div>

      {isModelLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center perspective preserve-3d animate-fade-in">
          <div 
            className="absolute w-60 h-20 rounded-full bg-black/30 blur-sm transform-gpu"
            style={{ 
              transform: `translateX(${modelPosition.x}px) translateY(120px) rotateX(60deg)`,
            }}
          ></div>
          
          <div 
            className="relative transform-gpu"
            style={{ 
              transform: `translateX(${modelPosition.x}px) translateY(${modelPosition.y}px) rotateY(${rotation}deg)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            <img 
              src={imageUrl} 
              alt={`AR model of ${siteName}`} 
              className="h-96 object-contain"
              style={{
                filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.4))',
              }}
            />
            
            <div className="absolute top-1/4 left-1/4 w-6 h-6 rounded-full bg-accent/80 animate-pulse-slow flex items-center justify-center" 
                 style={{ transform: `rotateY(${-rotation}deg)` }}>
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
            
            <div className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full bg-accent/80 animate-pulse-slow flex items-center justify-center"
                 style={{ transform: `rotateY(${-rotation}deg)` }}>
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="h-16 w-16 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
          <p className="mt-4 text-white text-lg">Initializing AR environment...</p>
        </div>
      )}

      {cameraReady && !isModelLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
          <div className="p-6 rounded-2xl glass-panel max-w-xs text-center animate-float">
            <p className="text-white">
              Point your camera at a flat surface to place the {siteName} model
            </p>
          </div>
        </div>
      )}

      {isModelLoaded && (
        <div className="absolute bottom-20 left-0 right-0 z-30 p-4">
          <div className="glass-panel rounded-2xl p-4 max-w-lg mx-auto animate-slide-up">
            <h3 className="text-lg font-medium text-white">{selectedSite.name}</h3>
            <p className="text-sm text-white/80 mt-1">{selectedSite.short_description}</p>
            
            <div className="mt-3 flex space-x-2">
              <button 
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors active:scale-95"
                onClick={onInfoClick}
              >
                More Info
              </button>
              <button 
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-accent/80 text-white hover:bg-accent transition-colors active:scale-95"
                onClick={onNextSite}
              >
                Next Site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARView;
