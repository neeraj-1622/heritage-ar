
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card3D from './Card3D';
import { HistoricalSite } from '@/lib/supabase';

interface SiteCardProps {
  site: HistoricalSite;
}

const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Navigate to the site detail page with the site ID
    navigate(`/site/${site.id}`);
  };
  
  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card3D className="group relative overflow-hidden rounded-xl">
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            src={site.image_url}
            alt={site.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              // Fallback image if the original fails to load
              e.currentTarget.src = 'https://images.unsplash.com/photo-1564207550505-32a0f9c622b6?q=80&w=2065&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="mb-1 text-xl font-semibold text-white">{site.name}</h3>
            <p className="mb-2 text-sm text-gray-300">{site.location}</p>
            <p className="text-sm text-gray-400 line-clamp-2">{site.short_description}</p>
          </div>
        </div>
      </Card3D>
    </div>
  );
};

export default SiteCard;
