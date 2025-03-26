
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-heritage-900/95">
      <div className="text-center max-w-md p-8 glass-panel rounded-xl animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-heritage-300 mb-6">The page you're looking for doesn't exist or is unavailable</p>
        <Link to="/" className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-white hover:bg-accent/90 transition-all duration-200 shadow-lg">
          <ArrowLeft className="mr-2 h-5 w-5" /> 
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
