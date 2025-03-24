
import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteById } from '../frontend/api/sitesApi';
import AnimatedHeader from '../components/AnimatedHeader';
import InfoPanel from '../components/InfoPanel';
import { HistoricalSite } from '../components/SiteCard';
import { Camera, ArrowRight, Globe, Clock, Users } from 'lucide-react';

const SiteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isImageHovered, setIsImageHovered] = useState(false);
  
  const { data: site, isLoading, error } = useQuery({
    queryKey: ['site', id],
    queryFn: () => fetchSiteById(id || ''),
    enabled: !!id,
  });

  const handleARExperience = () => {
    navigate(`/ar?siteId=${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnimatedHeader title="Loading..." showBackButton />
        <div className="flex-1 pt-24 flex items-center justify-center">
          <div className="h-20 w-20 relative">
            <div className="absolute inset-0 rounded-full border-4 border-heritage-200 border-t-accent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-heritage-200 border-b-accent animate-spin animation-delay-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <AnimatedHeader title={site.name} showBackButton />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              className="relative h-80 lg:h-full rounded-3xl overflow-hidden shadow-lg animate-slide-up perspective"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 transition-opacity duration-300 ${
                isImageHovered ? 'opacity-40' : 'opacity-70'
              }`}></div>
              
              <img 
                src={site.imageUrl} 
                alt={site.name} 
                className={`h-full w-full object-cover transition-all duration-700 ${
                  isImageHovered ? 'scale-110' : 'scale-100'
                }`}
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <button 
                  onClick={handleARExperience}
                  className="flex items-center space-x-2 bg-accent hover:bg-accent-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-accent/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Camera className="h-5 w-5" />
                  <span>View in AR</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
            
            <div className="animate-slide-up delay-150">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-heritage-100 rounded-full text-heritage-800 mb-3">
                  {site.period}
                </span>
                <h1 className="text-4xl font-bold text-heritage-950">{site.name}</h1>
                <div className="flex items-center mt-2 text-heritage-600">
                  <Globe className="h-4 w-4 mr-1" />
                  <span>{site.location}</span>
                </div>
              </div>
              
              <InfoPanel site={site} className="animate-scale-in" />
              
              <div className="mt-8 glass-panel rounded-2xl p-6 animate-slide-up delay-200">
                <h3 className="text-xl font-medium text-heritage-900 mb-4">Historical Context</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center p-3 bg-heritage-50 rounded-xl">
                    <Clock className="h-5 w-5 text-accent mr-3" />
                    <div>
                      <div className="text-sm font-medium">Period</div>
                      <div className="text-heritage-700">{site.period}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-heritage-50 rounded-xl">
                    <Globe className="h-5 w-5 text-accent mr-3" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-heritage-700">{site.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-heritage-50 rounded-xl">
                    <Users className="h-5 w-5 text-accent mr-3" />
                    <div>
                      <div className="text-sm font-medium">Civilization</div>
                      <div className="text-heritage-700">{site.period.split(' ')[0]}</div>
                    </div>
                  </div>
                </div>
                
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
              <button 
                onClick={handleARExperience}
                className="px-6 py-3 bg-heritage-500 text-white rounded-xl shadow-md transition-all duration-300 
                hover:bg-heritage-600 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-heritage-500 focus:ring-opacity-50"
              >
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
