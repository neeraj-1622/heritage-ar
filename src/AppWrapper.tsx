
import React, { useState, useEffect } from 'react';
import App from './App';
import LoadingAnimation from './components/LoadingAnimation';
import EnhancedCursor from './components/EnhancedCursor';

const AppWrapper: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user has visited before to avoid showing animation again
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setLoading(false);
    } else {
      localStorage.setItem('hasVisitedBefore', 'true');
      // After 24 hours, reset the visited flag so they see animation again
      const resetTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      setTimeout(() => {
        localStorage.removeItem('hasVisitedBefore');
      }, resetTime);
    }

    // Ensure the AR-specific class is removed when the app starts
    document.body.classList.remove('ar-mode');
  }, []);
  
  const handleLoadingComplete = () => {
    setLoading(false);
  };
  
  return (
    <>
      <EnhancedCursor />
      {loading ? (
        <LoadingAnimation onComplete={handleLoadingComplete} />
      ) : (
        <div className="animate-fade-in">
          <App />
        </div>
      )}
    </>
  );
};

export default AppWrapper;
