
import React from 'react';
import { Link } from 'react-router-dom';

export interface HistoricalSite {
  id: string;
  name: string;
  period: string;
  location: string;
  shortDescription: string;
  imageUrl: string;
}

interface SiteCardProps {
  site: HistoricalSite;
}

const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  return (
    <Link 
      to={`/site/${site.id}`}
      className="flex flex-col overflow-hidden rounded-2xl bg-white border border-heritage-100 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] active:translate-y-[0px]"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-[1]"></div>
        <img 
          src={site.imageUrl} 
          alt={site.name} 
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 z-[2]">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full text-heritage-800">
            {site.period}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col p-4 space-y-2">
        <h3 className="font-medium text-lg text-heritage-950">{site.name}</h3>
        <div className="flex items-center text-sm text-heritage-500">
          <span>{site.location}</span>
        </div>
        <p className="text-sm text-heritage-700 line-clamp-2">
          {site.shortDescription}
        </p>
      </div>
    </Link>
  );
};

export default SiteCard;
