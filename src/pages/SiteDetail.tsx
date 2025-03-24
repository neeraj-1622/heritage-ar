
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteById } from '../frontend/api/sitesApi';
import Header from '../components/Header';
import InfoPanel from '../components/InfoPanel';
import { HistoricalSite } from '../components/SiteCard';

const SiteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: site, isLoading, error } = useQuery({
    queryKey: ['site', id],
    queryFn: () => fetchSiteById(id || ''),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-heritage-50">
        <Header title="Loading..." showBackButton />
        <div className="flex-1 pt-24 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-heritage-200 border-t-heritage-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-heritage-50 animate-fade-in">
      <Header title={site.name} showBackButton />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative h-80 lg:h-full rounded-2xl overflow-hidden shadow-lg animate-slide-up">
              <img 
                src={site.imageUrl} 
                alt={site.name} 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="animate-slide-up delay-150">
              <InfoPanel site={site} />
              
              <div className="mt-8 glass-panel rounded-2xl p-6">
                <h3 className="text-xl font-medium text-heritage-900 mb-4">Historical Context</h3>
                <p className="text-heritage-700">
                  {site.longDescription || `This historical site is a significant cultural landmark that showcases the architectural 
                  brilliance and cultural values of its time. The structure has been preserved through 
                  centuries and continues to be an important destination for researchers and tourists alike.`}
                </p>
                <p className="mt-4 text-heritage-700">
                  Archaeologists have uncovered numerous artifacts that provide insights into 
                  the daily lives of people who inhabited this region. These findings have contributed 
                  to our understanding of ancient civilizations and their technological advancements.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 glass-panel rounded-2xl p-6 animate-slide-up delay-300">
            <h3 className="text-xl font-medium text-heritage-900 mb-4">Interactive Experience</h3>
            <p className="text-heritage-700">
              Use our AR feature to see this historical site come to life. Point your camera at 
              a flat surface and watch as a detailed 3D model appears before your eyes. You can 
              walk around the model and explore it from different angles.
            </p>
            <div className="mt-6">
              <button className="px-6 py-2 bg-heritage-500 text-white rounded-full transition-all duration-300 
                hover:bg-heritage-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-heritage-500 focus:ring-opacity-50">
                Launch AR Experience
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteDetail;
