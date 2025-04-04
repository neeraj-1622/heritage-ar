
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ArViewLinkProps {
  hidden: boolean;
}

const ArViewLink: React.FC<ArViewLinkProps> = ({ hidden }) => {
  const location = useLocation();
  
  if (hidden) return null;
  
  return (
    <Link 
      to="/ar" 
      className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${
        location.pathname === '/ar' 
          ? 'bg-accent text-white' 
          : 'bg-heritage-100/20 text-white hover:bg-heritage-200/30'
      }`}
    >
      AR View
    </Link>
  );
};

export default ArViewLink;
