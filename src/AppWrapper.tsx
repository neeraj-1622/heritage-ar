
import React, { useState, useEffect } from 'react';
import App from './App';
import LoadingAnimation from './components/LoadingAnimation';
import EnhancedCursor from './components/EnhancedCursor';

const AppWrapper: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Always show the loading animation on page reload
    // After 24 hours, reset the visited flag to ensure they see animation again
    const resetTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    setTimeout(() => {
      localStorage.removeItem('hasVisitedBefore');
    }, resetTime);

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
