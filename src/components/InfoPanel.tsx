
import React from 'react';
import { HistoricalSite } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface InfoPanelProps {
  site: HistoricalSite;
  className?: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ site, className = '' }) => {
  const navigate = useNavigate();
  
  const handleViewInAR = () => {
    navigate(`/ar?siteId=${site.id}`);
  };
  
  return (
    <motion.div 
      className={`glass-panel rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-heritage-100">{site.name}</h2>
        
        <div className="flex items-center space-x-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-heritage-800 rounded-full text-heritage-300">
            {site.period}
          </span>
          <span className="text-sm text-heritage-400">{site.location}</span>
        </div>
        
        <p className="text-heritage-300">
          {site.shortDescription}
        </p>

        <div className="pt-2">
          <Button 
            onClick={handleViewInAR}
            className="bg-accent hover:bg-accent/80 text-white rounded-xl transition-all duration-300 
            hover:shadow-accent/20 active:scale-95"
          >
            View in AR
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoPanel;
