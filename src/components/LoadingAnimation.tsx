
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 60);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  // New rotating rings animation
  const clockwiseRing = {
    rotate: [0, 360],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  };
  
  const counterClockwiseRing = {
    rotate: [360, 0],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "linear"
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-heritage-950 z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="max-w-md text-center px-6">
        <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Outer rotating ring (counterclockwise) */}
            <motion.div 
              className="absolute inset-0 w-full h-full rounded-full border-2 border-accent/50"
              style={{ borderWidth: '3px', borderStyle: 'dashed' }}
              animate={counterClockwiseRing}
            ></motion.div>
            
            {/* Inner rotating ring (clockwise) */}
            <motion.div 
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full border-2 border-white/50"
              style={{ borderWidth: '2px' }}
              animate={clockwiseRing}
            ></motion.div>
            
            {/* AR Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-24 h-24 bg-gradient-to-tr from-accent to-accent-400 rounded-md animate-pulse-slow">
                <span className="absolute inset-0 flex items-center justify-center font-bold text-4xl text-white">AR</span>
              </div>
            </div>
          </div>
          
          <motion.h1 
            className="text-5xl font-bold text-white mb-4"
            variants={itemVariants}
          >
            HeritageAR
          </motion.h1>
          
          <motion.p 
            className="text-heritage-300 text-xl"
            variants={itemVariants}
          >
            Explore history in augmented reality
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="w-full bg-heritage-800 rounded-full h-3 mb-6 overflow-hidden"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-accent h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          ></motion.div>
        </motion.div>
        
        <motion.div className="text-heritage-400 text-sm font-medium" variants={itemVariants}>
          {progress < 100 ? "Loading experience..." : "Ready!"}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;
