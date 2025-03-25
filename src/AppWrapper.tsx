
import React, { useState, useEffect } from 'react';
import App from './App';
import LoadingAnimation from './components/LoadingAnimation';
import EnhancedCursor from './components/EnhancedCursor';

const AppWrapper: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
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
