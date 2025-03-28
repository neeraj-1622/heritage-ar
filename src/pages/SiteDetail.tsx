import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteById } from '../frontend/api/sitesApi';
import AnimatedHeader from '../components/AnimatedHeader';
import InfoPanel from '../components/InfoPanel';
import { HistoricalSite } from '../components/SiteCard';
import { Camera, ArrowRight, Globe, Clock, Users, Scan } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const SiteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  
  const { data: site, isLoading, error } = useQuery({
    queryKey: ['site', id],
    queryFn: () => fetchSiteById(id || ''),
    enabled: !!id,
    retry: 2
  });

  React.useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => setArSupported(supported))
        .catch(() => setArSupported(false));
    } else {
      setArSupported(false);
    }
  }, []);

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading site",
        description: "Could not load site details. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleARExperience = () => {
    navigate(`/ar?siteId=${id}`);
    toast({
      title: "AR Experience",
      description: "Launching AR experience for this historical site.",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-heritage-950 to-heritage-900">
        <AnimatedHeader title="Loading..." showBackButton />
        <div className="flex-1 pt-24 flex items-center justify-center">
          <div className="h-20 w-20 relative">
            <div className="absolute inset-0 rounded-full border-4 border-heritage-800 border-t-accent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-heritage-800 border-b-accent animate-spin animation-delay-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatedHeader title={site.name} showBackButton />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              className="relative h-80 lg:h-full rounded-3xl overflow-hidden shadow-lg perspective"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
              variants={itemVariants}
            >
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 transition-opacity duration-300 ${
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
                <motion.button 
                  onClick={handleARExperience}
                  className="flex items-center space-x-2 bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-accent/20 transition-all duration-300 transform hover:-translate-y-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="h-5 w-5" />
                  <span>View in AR</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </motion.button>
              </div>
            </motion.div>
            
            <div>
              <motion.div className="mb-8" variants={itemVariants}>
                <span className="inline-block px-3 py-1 text-sm font-medium bg-heritage-800 rounded-full text-heritage-200 mb-3">
                  {site.period}
                </span>
                <h1 className="text-4xl font-bold text-heritage-100">{site.name}</h1>
                <div className="flex items-center mt-2 text-heritage-400">
                  <Globe className="h-4 w-4 mr-1" />
                  <span>{site.location}</span>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <InfoPanel site={site} className="animate-scale-in" />
              </motion.div>
              
              <motion.div 
                className="mt-8 glass-panel rounded-2xl p-6"
                variants={itemVariants}
              >
                <h3 className="text-xl font-medium text-heritage-100 mb-4">Historical Context</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center p-3 bg-heritage-800/50 rounded-xl border border-heritage-700/50">
                    <Clock className="h-5 w-5 text-accent mr-3" />
                    <div>
                      <div className="text-sm font-medium text-heritage-300">Period</div>
                      <div className="text-heritage-100">{site.period}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-heritage-800/50 rounded-xl border border-heritage-700/50">
                    <Globe className="h-5 w-5 text-accent mr-3" />
                    <div>
                      <div className="text-sm font-medium text-heritage-300">Location</div>
                      <div className="text-heritage-100">{site.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-heritage-800/50 rounded-xl border border-heritage-700/50">
                    <Users className="h-5 w-5 text-accent mr-3" />
                    <div>
                      <div className="text-sm font-medium text-heritage-300">Civilization</div>
                      <div className="text-heritage-100">{site.period.split(' ')[0]}</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-heritage-300">
                  {site.longDescription || `This historical site is a significant cultural landmark that showcases the architectural 
                  brilliance and cultural values of its time. The structure has been preserved through 
                  centuries and continues to be an important destination for researchers and tourists alike.`}
                </p>
                <p className="mt-4 text-heritage-300">
                  Archaeologists have uncovered numerous artifacts that provide insights into 
                  the daily lives of people who inhabited this region. These findings have contributed 
                  to our understanding of ancient civilizations and their technological advancements.
                </p>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="mt-12 glass-panel rounded-2xl p-6"
            variants={itemVariants}
          >
            <h3 className="text-xl font-medium text-heritage-100 mb-4">Interactive Experience</h3>
            <p className="text-heritage-300">
              Use our AR feature to see this historical site come to life. Point your camera at 
              a flat surface and watch as a detailed 3D model appears before your eyes. You can 
              walk around the model and explore it from different angles.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <motion.button 
                onClick={handleARExperience}
                className="px-6 py-3 bg-accent text-white rounded-xl shadow-md transition-all duration-300 
                hover:bg-accent/80 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Launch AR Experience
              </motion.button>
              
              {arSupported && (
                <div className="flex items-center px-4 py-2 bg-green-500/10 text-green-500 rounded-lg">
                  <Scan className="h-4 w-4 mr-2" />
                  <span className="text-sm">WebXR AR Supported on this device</span>
                </div>
              )}
              
              {arSupported === false && (
                <div className="flex items-center px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
                  <Scan className="h-4 w-4 mr-2" />
                  <span className="text-sm">Real AR not supported. Using simulated AR.</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default SiteDetail;
