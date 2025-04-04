
import React from 'react';
import { Link } from 'react-router-dom';

const AuthLinks: React.FC = () => {
  return (
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
  );
};

export default AuthLinks;
