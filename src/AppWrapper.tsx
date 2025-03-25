
import React, { useState, useEffect } from 'react';
import App from './App';
import LoadingAnimation from './components/LoadingAnimation';
import CustomCursor from './components/CustomCursor';
import { motion, AnimatePresence } from 'framer-motion';

const AppWrapper: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  const handleLoadingComplete = () => {
    setLoading(false);
  };
  
  // Hide scrollbar for the entire app
  useEffect(() => {
    document.body.classList.add('overflow-x-hidden');
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('overflow-x-hidden');
    };
  }, []);
  
  return (
    <>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingAnimation onComplete={handleLoadingComplete} key="loading" />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <App />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppWrapper;
