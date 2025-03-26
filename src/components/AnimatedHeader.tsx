
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
          ? 'py-2 bg-heritage-900/90 backdrop-blur-lg shadow-md' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-2 rounded-full text-white hover:text-accent hover:bg-heritage-800/50 transition-colors"
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
            <h1 className={`font-bold ${title ? 'text-lg' : 'text-xl'} text-white`}>
              {title || "HeritageAR"}
            </h1>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-white transition-all duration-300 relative rainbow-hover-effect"
          >
            Home
          </Link>
          <Link 
            to="/ar" 
            className="text-white transition-all duration-300 relative rainbow-hover-effect"
          >
            AR Experience
          </Link>
          <Link 
            to="/contact" 
            className="text-white transition-all duration-300 relative rainbow-hover-effect"
          >
            Contact
          </Link>
          
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-1 text-white hover:text-accent">
                <User className="h-4 w-4" />
                <span>Account</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-heritage-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-heritage-300 hover:text-white hover:bg-heritage-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login" 
                className="text-white transition-all duration-300 relative rainbow-hover-effect"
              >
                Sign in
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 rounded-full bg-accent text-white shadow-sm hover:shadow-md hover:bg-accent-600 transition-all duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
        
        <button 
          onClick={toggleMenu}
          className="p-2 rounded-md md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden absolute w-full bg-heritage-800/95 backdrop-blur-md shadow-md transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      } overflow-hidden`}>
        <div className="container mx-auto px-4 py-4 space-y-3">
          <Link 
            to="/" 
            className="block py-2 text-white hover:text-accent hover:pl-2 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/ar" 
            className="block py-2 text-white hover:text-accent hover:pl-2 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            AR Experience
          </Link>
          <Link 
            to="/contact" 
            className="block py-2 text-white hover:text-accent hover:pl-2 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center w-full py-2 text-white hover:text-accent hover:pl-2 transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link 
                to="/login" 
                className="block py-2 text-white hover:text-accent hover:pl-2 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link 
                to="/register" 
                className="block py-2 text-white hover:text-accent hover:pl-2 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AnimatedHeader;
