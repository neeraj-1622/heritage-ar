
import React from 'react';
import SiteCard from './SiteCard';
import { HistoricalSite } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { getAllSites } from '../frontend/api/sitesApi';

const SiteGallery: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sites'],
    queryFn: getAllSites,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="rounded-2xl bg-heritage-100 h-48 w-full"></div>
            <div className="mt-4 h-5 bg-heritage-100 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-heritage-100 rounded w-1/2"></div>
            <div className="mt-2 h-4 bg-heritage-100 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="p-6 bg-red-50 rounded-lg border border-red-100">
          <h3 className="text-xl font-medium text-red-800">Error Loading Data</h3>
          <p className="mt-2 text-red-600">
            We encountered a problem loading historical sites. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.sites && data.sites.map((site: HistoricalSite) => (
          <div key={site.id} className="animate-scale-in">
            <SiteCard site={site} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteGallery;
