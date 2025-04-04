import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  hideArView?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'HeritageAR',
  showBackButton = false,
  hideArView = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [avatarColor, setAvatarColor] = useState<string>('');
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('display_name, username, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          
          // Fall back to user object from auth context
          setDisplayName(user.display_name || user.username || 'User');
          setEmail(user.email || '');
          
          // Generate avatar color once and store it
          if (!avatarColor) {
            setAvatarColor(getAvatarColor(user.display_name || user.username || 'User'));
          }
        } else if (data) {
          setDisplayName(data.display_name || data.username || 'User');
          setEmail(data.email || user.email || '');
          
          // Generate avatar color once and store it
          if (!avatarColor) {
            setAvatarColor(getAvatarColor(data.display_name || data.username || 'User'));
          }
        }
      } catch (error) {
        console.error('Error in header profile fetch:', error);
        
        // Default values as fallback
        setDisplayName(user.display_name || user.username || 'User');
        setEmail(user.email || '');
        
        if (!avatarColor) {
          setAvatarColor(getAvatarColor(user.display_name || user.username || 'User'));
        }
      }
    };

    fetchUserProfile();
  }, [user?.id, user?.display_name, user?.username, user?.email, avatarColor]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (username: string) => {
    // Always use blue tones for the avatar background to match the theme
    const blueColors = [
      'bg-blue-800', 'bg-blue-700', 'bg-indigo-800', 
      'bg-indigo-700', 'bg-blue-900'
    ];
    
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = ((hash << 5) - hash) + username.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % blueColors.length;
    return blueColors[index];
  };

  // Ensure back button always navigates to home
  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 glass-panel px-4 py-4 flex items-center">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button 
              onClick={handleBackClick} 
              className="p-2 rounded-full hover:bg-heritage-100 transition-colors duration-200"
              aria-label="Go back to home"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
          )}
          
          <Link to="/" className="text-xl font-medium tracking-tight text-white">
            {title}
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {!hideArView && (
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
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-10 w-10 overflow-hidden ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar className="h-10 w-10 border-2 border-accent/30">
                      <AvatarFallback className={`${avatarColor || 'bg-blue-800'} text-white font-medium`}>
                        {getInitials(displayName || 'User')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-blue-800/90 backdrop-blur-sm border-blue-700 text-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <p className="text-xs leading-none text-blue-300/90">{email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-blue-700/50" />
                  <DropdownMenuItem 
                    className="text-white hover:bg-blue-700 cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-white hover:bg-blue-700 cursor-pointer"
                    onClick={() => navigate('/update-password')}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Update Password</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-blue-700/50" />
                  <DropdownMenuItem 
                    className="text-white hover:bg-blue-700 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex space-x-2">
              <Link 
                to="/login" 
                className="text-sm px-4 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm px-4 py-2 bg-accent text-white font-medium rounded-full hover:bg-accent/90 transition-colors duration-200"
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

export default Header;
