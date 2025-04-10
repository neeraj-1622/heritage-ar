import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import HeaderBackButton from './HeaderBackButton';
import UserMenu from './UserMenu';
import AuthLinks from './AuthLinks';
import ArViewLink from './ArViewLink';

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
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 glass-panel px-4 py-4 flex items-center">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <HeaderBackButton showBackButton={showBackButton} />
          
          <Link to="/" className="text-xl font-medium tracking-tight text-white">
            {title}
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <ArViewLink hidden={hideArView} />
              <UserMenu user={user} onLogout={handleLogout} />
            </>
          ) : (
            <AuthLinks />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
