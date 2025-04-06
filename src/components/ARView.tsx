
import React, { useState, useEffect } from 'react';
import { HistoricalSite } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ObjectModelData, createThreeJsGeometryFromModelData } from '@/utils/objectReconstructor';

interface ARViewProps {
  modelUrl?: string;
  selectedSite?: HistoricalSite | null;
  detectedObjectModel?: ObjectModelData | null;
  showModel?: boolean;
  enableRotation?: boolean;
  onNextSite?: () => void;
  onInfoClick?: () => void;
}

const ARView: React.FC<ARViewProps> = ({ 
  selectedSite, 
  modelUrl,
  detectedObjectModel,
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
  const [objectScene, setObjectScene] = useState<THREE.Scene | null>(null);
  const [modelRendered, setModelRendered] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedSite && !modelUrl && !detectedObjectModel) return;
    
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
  }, [selectedSite, modelUrl, detectedObjectModel, showModel]);

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

  // Create 3D representation if object model is provided
  useEffect(() => {
    if (detectedObjectModel && isModelLoaded) {
      console.log("Creating 3D scene from detected object model", detectedObjectModel);
      
      // Create a new THREE scene
      const scene = new THREE.Scene();
      
      // Create geometry based on model data
      const geometry = createThreeJsGeometryFromModelData(detectedObjectModel);
      
      // Create material with the color from model data
      const material = new THREE.MeshStandardMaterial({
        color: detectedObjectModel.color,
        roughness: 0.7,
        metalness: 0.3
      });
      
      // Create mesh and add to scene
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(
        detectedObjectModel.scale,
        detectedObjectModel.scale,
        detectedObjectModel.scale
      );
      scene.add(mesh);
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      setObjectScene(scene);
      setModelRendered(true);
    }
  }, [detectedObjectModel, isModelLoaded]);

  const handleGoBack = () => {
    navigate('/');
  };

  if (!selectedSite && !modelUrl && !detectedObjectModel) {
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

  // Choose the image source - site image, object image, or default
  const getImageSource = () => {
    if (selectedSite?.image_url) {
      return selectedSite.image_url;
    } else if (detectedObjectModel) {
      // In a real implementation, we would render the 3D object directly
      // For now, use a placeholder image based on the object class
      return `https://source.unsplash.com/500x500/?${detectedObjectModel.class}`;
    }
    return 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2071&auto=format&fit=crop';
  }
  
  // Get the display name - site name or object class
  const getDisplayName = () => {
    if (selectedSite?.name) {
      return selectedSite.name;
    } else if (detectedObjectModel) {
      return `3D ${detectedObjectModel.class}`;
    }
    return 'Historical Monument';
  }

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
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
          </div>
        )}
      </div>

      {isModelLoaded && detectedObjectModel && (
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
            {/* Render model based on geometry type */}
            {detectedObjectModel.geometry === 'cylinder' && (
              <div className="relative w-40 h-60">
                <div className="absolute inset-0 bg-gradient-to-b rounded-t-full rounded-b-full"
                     style={{backgroundColor: detectedObjectModel.color, opacity: 0.9}}>
                </div>
                <div className="absolute inset-x-0 top-0 h-4 rounded-full"
                     style={{backgroundColor: detectedObjectModel.color, opacity: 0.7}}>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-4 rounded-full"
                     style={{backgroundColor: detectedObjectModel.color, opacity: 0.7}}>
                </div>
              </div>
            )}
            
            {detectedObjectModel.geometry === 'sphere' && (
              <div className="relative w-56 h-56 rounded-full"
                   style={{backgroundColor: detectedObjectModel.color, opacity: 0.9}}>
                <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/30"></div>
              </div>
            )}
            
            {detectedObjectModel.geometry === 'box' && (
              <div className="relative w-56 h-56 flex items-center justify-center">
                <div className="relative w-48 h-48 transform-gpu"
                     style={{backgroundColor: detectedObjectModel.color, opacity: 0.9,
                             transform: 'perspective(800px) rotateX(20deg) rotateY(20deg)'}}>
                  <div className="absolute inset-0 border-2 border-white/10"></div>
                </div>
              </div>
            )}
            
            {!['cylinder', 'sphere', 'box'].includes(detectedObjectModel.geometry) && (
              <img 
                src={getImageSource()} 
                alt={`AR model of ${getDisplayName()}`} 
                className="h-96 object-contain"
                style={{
                  filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.4))',
                }}
              />
            )}
          </div>
        </div>
      )}
      
      {isModelLoaded && selectedSite && !detectedObjectModel && (
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
              src={getImageSource()} 
              alt={`AR model of ${getDisplayName()}`} 
              className="h-96 object-contain"
              style={{
                filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.4))',
              }}
            />
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
              Point your camera at a flat surface to place the model
            </p>
          </div>
        </div>
      )}

      {isModelLoaded && (selectedSite || detectedObjectModel) && (
        <div className="absolute bottom-20 left-0 right-0 z-30 p-4">
          <div className="glass-panel rounded-2xl p-4 max-w-lg mx-auto animate-slide-up">
            <h3 className="text-lg font-medium text-white">{getDisplayName()}</h3>
            <p className="text-sm text-white/80 mt-1">
              {selectedSite?.short_description || 
               (detectedObjectModel && `3D model created from ${detectedObjectModel.class} object analysis`)}
            </p>
            
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
