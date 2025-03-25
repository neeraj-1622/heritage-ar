
import React, { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  
  useEffect(() => {
    let startTime = Date.now();
    const duration = 3500; // 3.5 seconds animation
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(100, (elapsed / duration) * 100);
      
      setProgress(nextProgress);
      
      // Update stage based on progress
      if (nextProgress < 30) {
        setStage(0); // Initializing
      } else if (nextProgress < 60) {
        setStage(1); // Entering AR
      } else if (nextProgress < 90) {
        setStage(2); // Calibrating
      } else {
        setStage(3); // Ready
      }
      
      if (nextProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    };
    
    requestAnimationFrame(animate);
    
    return () => {
      // Cleanup
    };
  }, [onComplete]);

  const stageText = [
    "Initializing AR System",
    "Entering Virtual Space",
    "Calibrating Time Portal",
    "HeritageAR Ready"
  ];
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-heritage-950 z-50 overflow-hidden">
      {/* Background geometric patterns */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div 
              key={`line-${i}`}
              className="absolute bg-accent/30"
              style={{
                height: '1px',
                width: '100%',
                top: `${i * 5}%`,
                transform: `translateY(${Math.sin(i * 0.5) * 20}px)`,
                opacity: 0.3 + (i * 0.03),
              }}
            ></div>
          ))}
          
          {[...Array(20)].map((_, i) => (
            <div 
              key={`vert-${i}`}
              className="absolute bg-accent/20"
              style={{
                width: '1px',
                height: '100%',
                left: `${i * 5}%`,
                transform: `translateX(${Math.cos(i * 0.5) * 20}px)`,
                opacity: 0.2 + (i * 0.02),
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Portal effect */}
      <div className="relative w-64 h-64 mb-8">
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(56,189,248,0.1) 50%, rgba(56,189,248,0) 70%)`,
            boxShadow: '0 0 60px rgba(56,189,248,0.5)',
            transform: `scale(${0.5 + progress * 0.005})`,
            opacity: 0.8,
          }}
        ></div>
        
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            animation: 'pulseOpacity 3s infinite',
          }}
        >
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full border-4 border-accent/30 animate-spin" style={{ animationDuration: '8s' }}></div>
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-accent/50 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-16 w-16 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Orbiting elements */}
        {[...Array(5)].map((_, i) => {
          const angle = (progress / 100 * 360 + (i * 72)) * (Math.PI / 180);
          const radius = 80 - (i * 5);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <div 
              key={`orb-${i}`}
              className="absolute w-2 h-2 bg-accent rounded-full"
              style={{
                top: 'calc(50% + ' + y + 'px)',
                left: 'calc(50% + ' + x + 'px)',
                opacity: 0.5 + (i * 0.1),
                boxShadow: '0 0 10px rgba(56,189,248,0.8)',
              }}
            ></div>
          );
        })}
      </div>
      
      <div className="text-center z-10 relative">
        <h2 className="text-2xl font-semibold tracking-wide text-white mb-2 animate-pulse">
          <span className="text-gradient">HeritageAR</span>
        </h2>
        
        <p className="text-heritage-300 mt-1 h-6 flex items-center justify-center">
          {stageText[stage]}
          {stage < 3 && (
            <span className="ml-2 inline-flex">
              <span className="animate-bounce mx-0.5 delay-0">.</span>
              <span className="animate-bounce mx-0.5 delay-100">.</span>
              <span className="animate-bounce mx-0.5 delay-200">.</span>
            </span>
          )}
        </p>
      </div>
      
      <div className="mt-8 w-64 h-1 bg-heritage-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-heritage-500 mt-2 text-sm">
        {Math.round(progress)}%
      </p>
      
      {/* Futuristic background elements */}
      <style jsx>{`
        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
