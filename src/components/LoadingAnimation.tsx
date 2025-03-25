
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');
  const [textIndex, setTextIndex] = useState(0);
  
  const loadingTexts = [
    'Initializing AR environment',
    'Loading historical data',
    'Building virtual artifacts',
    'Preparing time portals',
    'Connecting to the past'
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 3;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);
    
    const textTimer = setInterval(() => {
      setTextIndex(prev => (prev + 1) % loadingTexts.length);
    }, 2000);
    
    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, []);
  
  useEffect(() => {
    setLoadingText(loadingTexts[textIndex]);
  }, [textIndex]);
  
  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-heritage-950 to-heritage-900 flex flex-col items-center justify-center z-50">
      <style>
        {`
          @keyframes portal-glow {
            0%, 100% {
              box-shadow: 0 0 20px 5px rgba(56, 189, 248, 0.4);
            }
            50% {
              box-shadow: 0 0 35px 10px rgba(56, 189, 248, 0.6);
            }
          }
          
          @keyframes orbital {
            0% {
              transform: rotate(0deg) translateX(100px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(100px) rotate(-360deg);
            }
          }

          .portal-ring {
            position: relative;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 4px solid transparent;
            background: linear-gradient(black, black) padding-box,
                        linear-gradient(to right, #38bdf8, #38bdf8cc) border-box;
            animation: portal-glow 3s infinite alternate, spin 20s linear infinite;
          }
          
          .portal-ring::before, .portal-ring::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 50%;
            background: transparent;
            border: 2px solid rgba(56, 189, 248, 0.6);
            transform: translate(-50%, -50%);
          }
          
          .portal-ring::before {
            width: 220px;
            height: 220px;
            animation: spin 12s linear infinite reverse;
          }
          
          .portal-ring::after {
            width: 250px;
            height: 250px;
            border-width: 3px;
            animation: spin 20s linear infinite;
          }
          
          .orbital {
            animation: orbital 6s linear infinite;
          }
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .particles {
            position: absolute;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            background-color: rgba(56, 189, 248, 0.8);
            box-shadow: 0 0 10px 2px rgba(56, 189, 248, 0.4);
          }
          
          .particle-1 { animation: orbital 8s linear infinite; }
          .particle-2 { animation: orbital 12s linear infinite; animation-delay: -2s; }
          .particle-3 { animation: orbital 10s linear infinite; animation-delay: -4s; }
          .particle-4 { animation: orbital 14s linear infinite; animation-delay: -6s; }
          .particle-5 { animation: orbital 9s linear infinite; animation-delay: -8s; }
        `}
      </style>
      
      <div className="relative mb-12">
        <div className="portal-ring"></div>
        
        {/* Orbiting elements */}
        <div className="particle-1 particles"></div>
        <div className="particle-2 particles"></div>
        <div className="particle-3 particles"></div>
        <div className="particle-4 particles"></div>
        <div className="particle-5 particles"></div>
        
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-accent to-accent/70"></div>
            <span className="relative z-10 text-4xl font-bold text-white">AR</span>
          </div>
        </motion.div>
      </div>
      
      <motion.h2 
        className="text-2xl font-bold text-white mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to HeritageAR
      </motion.h2>
      
      <motion.div 
        className="text-accent mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {loadingText}...
      </motion.div>
      
      <motion.div 
        className="w-64 h-2 bg-heritage-800 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <motion.div 
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </motion.div>
      
      <motion.div 
        className="mt-2 text-heritage-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {Math.round(progress)}%
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;
