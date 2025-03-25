
import React, { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let startTime = Date.now();
    const duration = 3000; // 3 seconds animation
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(100, (elapsed / duration) * 100);
      
      setProgress(nextProgress);
      
      if (nextProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    };
    
    requestAnimationFrame(animate);
    
    return () => {
      // Cleanup
    };
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-heritage-950 z-50">
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-28 w-28 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-heritage-800"></div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold tracking-wide text-white animate-pulse">HeritageAR</h2>
        <p className="text-heritage-400 mt-2">Explore history in augmented reality</p>
      </div>
      
      <div className="mt-8 w-64 h-1 bg-heritage-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-heritage-500 mt-2 text-sm">{Math.round(progress)}%</p>
    </div>
  );
};

export default LoadingAnimation;
