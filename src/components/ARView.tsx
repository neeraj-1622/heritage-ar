
import React, { useState, useEffect } from 'react';
import { HistoricalSite } from './SiteCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ARViewProps {
  selectedSite?: HistoricalSite;
}

const ARView: React.FC<ARViewProps> = ({ selectedSite }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [showScanAnimation, setShowScanAnimation] = useState(false);
  const [infoPoints, setInfoPoints] = useState<{x: number, y: number, info: string}[]>([]);

  // Simulate AR loading process
  useEffect(() => {
    if (!selectedSite) return;
    
    // Reset state when site changes
    setIsLoading(true);
    setIsModelLoaded(false);
    setCameraReady(false);
    setIsScanningActive(false);
    setShowScanAnimation(false);
    setScanProgress(0);
    
    // Camera initialization
    const timer1 = setTimeout(() => {
      setCameraReady(true);
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer1);
    };
  }, [selectedSite]);

  // Simulate scanning process when camera is ready
  useEffect(() => {
    if (!cameraReady || isModelLoaded) return;
    
    // Start scanning after camera is ready
    const scanTimer = setTimeout(() => {
      setIsScanningActive(true);
      
      // Simulate scanning progress
      let progress = 0;
      const scanInterval = setInterval(() => {
        progress += 2;
        setScanProgress(progress);
        
        if (progress >= 100) {
          clearInterval(scanInterval);
          setShowScanAnimation(true);
          
          // After scan complete, show the portal animation and then load the model
          setTimeout(() => {
            setShowScanAnimation(false);
            setIsModelLoaded(true);
            
            // Generate random info points for the model
            setInfoPoints([
              { x: -20, y: -40, info: "Built in 1500 BCE" },
              { x: 30, y: 10, info: "Restored in 1985" },
              { x: 10, y: -70, info: "Cultural significance" }
            ]);
          }, 2500);
        }
      }, 50);
      
      return () => {
        clearInterval(scanInterval);
      };
    }, 1000);
    
    return () => {
      clearTimeout(scanTimer);
    };
  }, [cameraReady, isModelLoaded]);

  // Simulate model rotation
  useEffect(() => {
    if (!isModelLoaded) return;
    
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    
    return () => clearInterval(rotationInterval);
  }, [isModelLoaded]);

  // Mouse movement affects model position slightly
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

  if (!selectedSite) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-heritage-950">
        <div className="text-center p-6 animate-fade-in">
          <h3 className="text-xl font-medium text-white">No Site Selected</h3>
          <p className="mt-2 text-heritage-400">
            Please select a historical site to view in AR
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Simulated camera view */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=2070" 
          alt="Camera view" 
          className={`h-full w-full object-cover transition-opacity duration-1000 ${
            cameraReady ? 'opacity-90' : 'opacity-0'
          }`}
        />
        
        {/* Grid overlay - simulates AR floor detection */}
        {cameraReady && !isModelLoaded && !showScanAnimation && (
          <div className="absolute inset-0 z-5 animate-fade-in">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div 
              className="absolute inset-x-0 bottom-0 h-1/3 transform-gpu perspective-1000"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, rgba(56,189,248,0.2) 0px, transparent 1px, transparent 20px),
                                repeating-linear-gradient(90deg, rgba(56,189,248,0.2) 0px, transparent 1px, transparent 20px)`,
                transform: 'rotateX(60deg)',
                transformOrigin: 'bottom',
                backgroundSize: '20px 20px',
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Scanning animation */}
      {isScanningActive && !isModelLoaded && !showScanAnimation && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative w-72 h-72">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="2" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(56,189,248,0.8)" strokeWidth="2" strokeDasharray="283" strokeDashoffset={283 - (283 * scanProgress) / 100} />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-accent/30"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-accent/20"></div>
              
              {/* Scanning line animation */}
              <div 
                className="absolute top-0 left-0 right-0 h-0.5 bg-accent/80"
                style={{
                  animation: 'scanMove 2s ease-in-out infinite',
                  boxShadow: '0 0 10px rgba(56,189,248,0.8), 0 0 20px rgba(56,189,248,0.4)',
                }}
              ></div>
              
              <style jsx>{`
                @keyframes scanMove {
                  0% { transform: translateY(0); }
                  50% { transform: translateY(72px); }
                  100% { transform: translateY(144px); }
                }
              `}</style>
            </div>
            
            <div className="mt-8 glass-panel rounded-xl px-6 py-3">
              <p className="text-white text-center">Scanning environment...</p>
              <div className="w-48 h-1 bg-white/20 rounded-full mt-2">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-200 ease-out"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-accent/80 text-center mt-1">{scanProgress}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Portal opening animation */}
      <AnimatePresence>
        {showScanAnimation && (
          <motion.div 
            className="absolute inset-0 z-15 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-0 h-0"
              animate={{ 
                width: ["0px", "500px", "500px"],
                height: ["0px", "500px", "500px"],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2.5,
                times: [0, 0.4, 1],
                ease: "easeInOut"
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                   style={{
                     background: `radial-gradient(circle, rgba(56,189,248,0.7) 0%, rgba(56,189,248,0.3) 60%, transparent 100%)`,
                     width: '100%',
                     height: '100%',
                     boxShadow: '0 0 100px rgba(56,189,248,0.8), 0 0 200px rgba(56,189,248,0.4) inset'
                   }}>
              </div>
              
              {/* Animated particles around the portal */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-accent"
                  style={{ 
                    width: Math.random() * 6 + 2,
                    height: Math.random() * 6 + 2,
                    boxShadow: '0 0 8px rgba(56,189,248,0.8)',
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 500],
                    y: [0, (Math.random() - 0.5) * 500],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    times: [0, 0.5, 1],
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AR scene elements */}
      <AnimatePresence>
        {isModelLoaded && (
          <motion.div 
            className="absolute inset-0 z-10 flex items-center justify-center perspective preserve-3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Ambient particles */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-accent/40"
                  style={{ 
                    width: Math.random() * 4 + 1,
                    height: Math.random() * 4 + 1,
                    boxShadow: '0 0 5px rgba(56,189,248,0.6)',
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  animate={{
                    x: [
                      Math.random() * window.innerWidth,
                      Math.random() * window.innerWidth
                    ],
                    y: [
                      Math.random() * window.innerHeight,
                      Math.random() * window.innerHeight
                    ],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
            
            {/* Ground shadow */}
            <motion.div 
              className="absolute w-60 h-20 rounded-full bg-black/30 blur-sm transform-gpu"
              style={{ 
                transform: `translateX(${modelPosition.x}px) translateY(120px) rotateX(60deg)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            
            {/* Portal ring effect */}
            <motion.div
              className="absolute"
              style={{ 
                width: 320,
                height: 320,
                transform: `translateX(${modelPosition.x}px) translateY(${modelPosition.y}px)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-accent/30"
                   style={{ 
                     boxShadow: '0 0 30px rgba(56,189,248,0.3) inset',
                   }}
              />
              
              {/* Rotating rings */}
              <motion.div
                className="absolute inset-0 rounded-full border border-accent/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div
                className="absolute inset-2 rounded-full border border-accent/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            
            {/* 3D model */}
            <motion.div 
              className="relative transform-gpu z-20"
              style={{ 
                transform: `translateX(${modelPosition.x}px) translateY(${modelPosition.y}px) rotateY(${rotation}deg)`,
                transition: 'transform 0.1s ease-out',
              }}
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3
              }}
            >
              <motion.img 
                src={selectedSite.imageUrl} 
                alt={`AR model of ${selectedSite.name}`} 
                className="h-96 object-contain"
                style={{
                  filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.4))',
                }}
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
              
              {/* Interactive hot spots */}
              {infoPoints.map((point, index) => (
                <motion.div 
                  key={index}
                  className="absolute w-6 h-6 rounded-full bg-accent/80 flex items-center justify-center cursor-pointer"
                  style={{ 
                    top: `calc(50% + ${point.y}px)`, 
                    left: `calc(50% + ${point.x}px)`,
                    transform: `rotateY(${-rotation}deg)`,
                    zIndex: 30
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  whileHover={{ scale: 1.3 }}
                >
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                  
                  {/* Info tooltip */}
                  <motion.div
                    className="absolute left-full ml-4 bg-white/90 backdrop-blur-md p-2 rounded-md text-xs text-heritage-950 whitespace-nowrap"
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    style={{ pointerEvents: 'none' }}
                  >
                    {point.info}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicators */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-16 w-16 rounded-full border-4 border-white/20 border-t-accent animate-spin"></div>
            <p className="mt-4 text-white text-lg">Initializing AR environment...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cameraReady && !isModelLoaded && !isScanningActive && (
          <motion.div 
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="p-6 rounded-2xl glass-panel max-w-xs text-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p className="text-white">
                Point your camera at a flat surface to place the {selectedSite.name} model
              </p>
              <button 
                className="mt-4 px-4 py-2 bg-accent text-white rounded-full text-sm hover:bg-accent/90 transition-colors"
                onClick={() => setIsScanningActive(true)}
              >
                Tap to Scan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls overlay */}
      <AnimatePresence>
        {isModelLoaded && (
          <motion.div 
            className="absolute bottom-20 left-0 right-0 z-30 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="glass-panel rounded-2xl p-4 max-w-lg mx-auto">
              <h3 className="text-lg font-medium text-white">{selectedSite.name}</h3>
              <p className="text-sm text-white/80 mt-1">{selectedSite.shortDescription}</p>
              
              <div className="mt-3 flex space-x-2">
                <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                  More Info
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-accent/80 text-white hover:bg-accent transition-colors">
                  Next Site
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ARView;
