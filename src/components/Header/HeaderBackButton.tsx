
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderBackButtonProps {
  showBackButton: boolean;
}

const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({ showBackButton }) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate('/');
  };

  if (!showBackButton) return null;
  
  return (
    <button 
      onClick={handleBackClick} 
      className="p-2 rounded-full hover:bg-heritage-100 transition-colors duration-200"
      aria-label="Go back to home"
    >
      <ArrowLeft size={20} className="text-white" />
    </button>
  );
};

export default HeaderBackButton;
