
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, ChevronLeft, User, LogOut } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const AnimatedHeader: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-white/80 backdrop-blur-lg shadow-sm' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-2 rounded-full text-heritage-700 hover:text-heritage-900 hover:bg-heritage-100 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent to-accent-400 rounded-md animate-pulse-slow"></div>
              <span className="relative font-bold text-white z-10">AR</span>
            </div>
            <h1 className={`font-bold ${title ? 'text-lg' : 'text-xl'} text-heritage-900`}>
              {title || "HeritageAR"}
            </h1>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-heritage-700 hover:text-heritage-900 hover-lift relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:scale-x-0 after:bg-accent hover:after:scale-x-100 after:transition-transform after:origin-left"
          >
            Home
          </Link>
          <Link 
            to="/ar" 
            className="text-heritage-700 hover:text-heritage-900 hover-lift relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:scale-x-0 after:bg-accent hover:after:scale-x-100 after:transition-transform after:origin-left"
          >
            AR Experience
          </Link>
          
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-1 text-heritage-700 hover:text-heritage-900 hover-lift">
                <User className="h-4 w-4" />
                <span>Account</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-heritage-700 hover:text-heritage-900 hover:bg-heritage-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-full bg-accent text-white shadow-sm hover:shadow-md hover:bg-accent-600 transition-all duration-200"
            >
              Sign in
            </Link>
          )}
        </div>
        
        <button 
          onClick={toggleMenu}
          className="p-2 rounded-md md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden absolute w-full bg-white shadow-md transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      } overflow-hidden`}>
        <div className="container mx-auto px-4 py-4 space-y-3">
          <Link 
            to="/" 
            className="block py-2 text-heritage-700 hover:text-heritage-900"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/ar" 
            className="block py-2 text-heritage-700 hover:text-heritage-900"
            onClick={() => setIsMenuOpen(false)}
          >
            AR Experience
          </Link>
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center w-full py-2 text-heritage-700 hover:text-heritage-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          ) : (
            <Link 
              to="/login" 
              className="block py-2 text-heritage-700 hover:text-heritage-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default AnimatedHeader;
