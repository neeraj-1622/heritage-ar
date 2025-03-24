
import React from 'react';
import { HistoricalSite } from './SiteCard';
import { Button } from '@/components/ui/button';

interface InfoPanelProps {
  site: HistoricalSite;
  className?: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ site, className = '' }) => {
  return (
    <div className={`glass-panel rounded-2xl p-6 ${className}`}>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-heritage-950">{site.name}</h2>
        
        <div className="flex items-center space-x-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-heritage-100 rounded-full text-heritage-800">
            {site.period}
          </span>
          <span className="text-sm text-heritage-600">{site.location}</span>
        </div>
        
        <p className="text-heritage-700">
          {site.shortDescription}
        </p>

        <div className="pt-2">
          <Button className="px-6 py-2 bg-heritage-500 text-white rounded-full transition-all duration-300 
                hover:bg-heritage-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-heritage-500 focus:ring-opacity-50">
            View in AR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
