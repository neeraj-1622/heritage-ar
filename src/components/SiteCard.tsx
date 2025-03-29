
import React from 'react';
import { Link } from 'react-router-dom';
import Card3D from './Card3D';
import { HistoricalSite } from '@/lib/supabase';

interface SiteCardProps {
  site: HistoricalSite;
}

const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  return (
    <Link to={`/sites/${site.id}`}>
      <Card3D className="group relative overflow-hidden rounded-xl">
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            src={site.image_url}
            alt={site.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="mb-1 text-xl font-semibold text-white">{site.name}</h3>
            <p className="mb-2 text-sm text-gray-300">{site.location}</p>
            <p className="text-sm text-gray-400 line-clamp-2">{site.short_description}</p>
          </div>
        </div>
      </Card3D>
    </Link>
  );
};

export default SiteCard;
