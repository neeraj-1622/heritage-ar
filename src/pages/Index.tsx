
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedHeader from '../components/AnimatedHeader';
import SiteGallery from '../components/SiteGallery';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  // Animation variants for coordinated entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        damping: 16, 
        stiffness: 150 
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in scrollbar-none">
      <AnimatedHeader />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mb-16 text-center relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Decorative elements */}
            <div className="absolute top-10 left-1/4 w-20 h-20 rounded-full bg-accent/10 blur-2xl"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-heritage-200/20 blur-3xl"></div>
            
            <motion.span 
              className="inline-block px-4 py-1.5 text-xs font-medium bg-accent/10 text-accent rounded-full mb-4"
              variants={itemVariants}
            >
              Explore Historical Sites
            </motion.span>
            
            <motion.h1 
              className="text-5xl font-bold tracking-tight text-heritage-100 relative z-10 mb-6"
              variants={itemVariants}
            >
              <span className="text-gradient">Discover our heritage</span>
              <br /> in augmented reality
            </motion.h1>
            
            <motion.p 
              className="mt-4 text-heritage-300 max-w-2xl mx-auto text-lg"
              variants={itemVariants}
            >
              Point your camera at the world and see historical sites come to life. 
              Explore ancient civilizations and learn about our shared cultural heritage.
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-wrap justify-center gap-4"
              variants={itemVariants}
            >
              <a href="#gallery" className="button-primary hover-glow">
                Explore Sites
              </a>
              <Link to="/ar" className="button-secondary">
                Try AR Experience
              </Link>
            </motion.div>
          </motion.div>
          
          <div id="gallery" className="pt-8">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-heritage-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Featured Historical Sites
            </motion.h2>
            <SiteGallery />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
