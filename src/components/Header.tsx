
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
          {isAuthenticated ? (
            <>
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                    <Avatar>
                      <AvatarFallback className="bg-heritage-800 text-white">
                        {user?.username ? getInitials(user.username) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2 text-sm font-medium border-b border-border">
                    {user?.username || 'User'}
                  </div>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
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
                className="text-sm px-4 py-2 bg-heritage-100 text-heritage-800 rounded-full hover:bg-heritage-200 transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm px-4 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors duration-200"
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
