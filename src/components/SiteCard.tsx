
import React from 'react';
import { Link } from 'react-router-dom';
import Card3D from './Card3D';

export interface HistoricalSite {
  id: string;
  name: string;
  period: string;
  location: string;
  shortDescription: string;
  imageUrl: string;
  longDescription?: string;
}

interface SiteCardProps {
  site: HistoricalSite;
}

const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  // Use the Angkor Wat image specifically for the Angkor Wat site
  const imageUrl = site.name.includes("Angkor Wat") 
    ? "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&auto=format&fit=crop" 
    : site.imageUrl;
    
  return (
    <Card3D className="h-full">
      <Link 
        to={`/site/${site.id}`}
        className="flex flex-col overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-heritage-100 shadow-sm h-full"
      >
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-[1]"></div>
          <img 
            src={imageUrl} 
            alt={site.name} 
            className="h-full w-full object-cover transition-all duration-500 hover:scale-110 hover:rotate-1"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 z-[2]">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full text-heritage-800 shadow-sm">
              {site.period}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col p-4 space-y-2 flex-grow">
          <h3 className="font-medium text-lg text-heritage-950">{site.name}</h3>
          <div className="flex items-center text-sm text-heritage-500">
            <span>{site.location}</span>
          </div>
          <p className="text-sm text-heritage-700 line-clamp-2">
            {site.shortDescription}
          </p>
          <div className="mt-auto pt-2">
            <span className="inline-block text-sm font-medium text-accent hover:underline mt-2">
              Explore in AR &rarr;
            </span>
          </div>
        </div>
      </Link>
    </Card3D>
  );
};

export default SiteCard;
