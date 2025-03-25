
import React, { useState, useEffect } from 'react';
import App from './App';
import LoadingAnimation from './components/LoadingAnimation';
import EnhancedCursor from './components/EnhancedCursor';

const AppWrapper: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user has visited before to avoid showing animation again
    const hasVisited = sessionStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setLoading(false);
    } else {
      sessionStorage.setItem('hasVisitedBefore', 'true');
    }
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
