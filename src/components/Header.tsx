
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogOut, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'HeritageAR',
  showBackButton = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a consistent color based on the username
  const getAvatarColor = (username: string) => {
    const colors = [
      'bg-purple-800', 'bg-indigo-800', 'bg-blue-800', 
      'bg-teal-800', 'bg-green-800', 'bg-amber-800', 
      'bg-red-800', 'bg-pink-800'
    ];
    
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = ((hash << 5) - hash) + username.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

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
              <ArrowLeft size={20} className="text-white" />
            </Link>
          )}
          
          <h1 className="text-xl font-medium tracking-tight text-white">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-10 w-10 overflow-hidden ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar className="h-10 w-10 border-2 border-accent/30">
                      <AvatarFallback className={`${getAvatarColor(user?.username || 'User')} text-white font-medium`}>
                        {user?.username ? getInitials(user.username) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-heritage-800 border-heritage-700 text-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username || 'User'}</p>
                      <p className="text-xs leading-none text-heritage-400">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-heritage-700" />
                  <DropdownMenuItem 
                    className="text-white hover:bg-heritage-700 cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-white hover:bg-heritage-700 cursor-pointer"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-heritage-700" />
                  <DropdownMenuItem 
                    className="text-white hover:bg-heritage-700 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
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
