
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'HeritageAR',
  showBackButton = false
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-10 glass-panel px-4 py-4 flex items-center">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && !isHomePage && (
            <Link 
              to="/" 
              className="p-2 rounded-full hover:bg-heritage-100 transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-heritage-800" />
            </Link>
          )}
          
          <h1 className="text-xl font-medium tracking-tight text-heritage-950">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link 
            to="/ar" 
            className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${
              location.pathname === '/ar' 
                ? 'bg-accent text-accent-foreground' 
                : 'bg-heritage-100 text-heritage-800 hover:bg-heritage-200'
            }`}
          >
            AR View
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
