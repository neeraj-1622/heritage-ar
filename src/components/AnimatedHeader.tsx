import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, ChevronLeft, LogOut, Settings, User, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const AnimatedHeader: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const getInitials = (name: string = 'User') => {
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a consistent color based on the username
  const getAvatarColor = (username: string = 'User') => {
    const blueColors = [
      'bg-blue-800', 'bg-indigo-800', 'bg-blue-900', 
      'bg-indigo-900', 'bg-blue-700'
    ];
    
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = ((hash << 5) - hash) + username.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % blueColors.length;
    return blueColors[index];
  };
  
  const displayName = user?.display_name || user?.username || 'User';

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
              onClick={() => navigate('/')}
              className="mr-3 p-2 rounded-full text-white hover:text-accent hover:bg-heritage-800/50 transition-colors"
              aria-label="Go back to home"
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
          <div className="flex items-center space-x-4">
            <Link 
              to="/ar" 
              className="text-white transition-all duration-300 relative rainbow-hover-effect"
            >
              AR Experience
            </Link>
            
            <Link 
              to="/tour" 
              className="text-white transition-all duration-300 relative rainbow-hover-effect"
            >
              Tour
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown} 
                className="flex items-center space-x-1 text-white hover:text-accent"
              >
                <Avatar className="h-9 w-9 border-2 border-accent/30">
                  <AvatarFallback className={`${getAvatarColor(displayName)} text-white font-medium`}>
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-blue-800/90 backdrop-blur-sm rounded-md shadow-lg overflow-hidden z-20 border border-blue-700/50">
                  <div className="py-2 border-b border-blue-700/50">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-white leading-none">{displayName}</p>
                      <p className="text-xs text-blue-300/90">{user?.email}</p>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/profile');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-blue-700/80 transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/update-password');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-blue-700/80 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Update Password
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-blue-700/80 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
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
            to="/ar" 
            className="block py-2 text-white hover:text-accent hover:pl-2 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            AR Experience
          </Link>
          
          <Link 
            to="/tour" 
            className="block py-2 text-white hover:text-accent hover:pl-2 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Tour
          </Link>
          
          {isAuthenticated ? (
            <div className="border-t border-heritage-700 pt-2 mt-2">
              <div className="py-2 flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className={`${getAvatarColor(displayName)} text-white font-medium`}>
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{displayName}</p>
                  <p className="text-xs text-heritage-400">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/profile');
                }}
                className="flex items-center w-full py-2 text-white hover:text-accent hover:pl-2 transition-all"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/update-password');
                }}
                className="flex items-center w-full py-2 text-white hover:text-accent hover:pl-2 transition-all"
              >
                <Settings className="h-4 w-4 mr-2" />
                Update Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full py-2 text-white hover:text-accent hover:pl-2 transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 border-t border-heritage-700 pt-2 mt-2">
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
