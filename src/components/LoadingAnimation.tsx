
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  // Animation timing in seconds
  const animationDuration = 3.5;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        return newProgress <= 100 ? newProgress : 100;
      });
    }, animationDuration * 10);

    // Cleanup and signal completion
    const timer = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, animationDuration * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-heritage-900 z-50">
      <div className="relative flex flex-col items-center">
        {/* Outer clockwise rotating ring */}
        <motion.div 
          className="absolute w-32 h-32 rounded-full border-2 border-accent/30"
          initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
          animate={{ 
            rotate: 360, 
            scale: 1,
            opacity: 1,
          }}
          transition={{ 
            duration: 3, 
            ease: "linear", 
            repeat: Infinity,
          }}
        />
        
        {/* Inner counter-clockwise rotating ring */}
        <motion.div 
          className="absolute w-24 h-24 rounded-full border-2 border-heritage-400/30"
          initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
          animate={{ 
            rotate: -360, 
            scale: 1,
            opacity: 1,
          }}
          transition={{ 
            duration: 2.5, 
            ease: "linear", 
            repeat: Infinity,
          }}
        />

        {/* Logo */}
        <motion.div
          className="relative flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-accent to-accent-600 shadow-lg"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-white text-3xl font-bold">AR</span>
        </motion.div>

        {/* Progress bar */}
        <motion.div 
          className="w-48 h-1 bg-heritage-800 rounded-full mt-8 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.p 
          className="mt-4 text-heritage-400 text-sm animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Loading HeritageAR...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
