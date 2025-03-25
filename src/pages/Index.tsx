
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedHeader from '../components/AnimatedHeader';
import SiteGallery from '../components/SiteGallery';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <AnimatedHeader />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center relative">
            {/* Decorative elements */}
            <div className="absolute top-10 left-1/4 w-20 h-20 rounded-full bg-accent/10 blur-2xl"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-heritage-200/20 blur-3xl"></div>
            
            <motion.span 
              className="inline-block px-4 py-1.5 text-xs font-medium bg-accent/10 text-accent rounded-full mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Explore Historical Sites
            </motion.span>
            
            <motion.h1 
              className="text-5xl font-bold tracking-tight text-heritage-100 relative z-10 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-gradient">Discover our heritage</span>
              <br /> in augmented reality
            </motion.h1>
            
            <motion.p 
              className="mt-4 text-heritage-300 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Point your camera at the world and see historical sites come to life. 
              Explore ancient civilizations and learn about our shared cultural heritage.
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a href="#gallery" className="button-primary hover-glow">
                Explore Sites
              </a>
              <Link to="/ar" className="button-secondary">
                Try AR Experience
              </Link>
            </motion.div>
            
            {/* Hero image of Angkor Wat */}
            <motion.div 
              className="relative mt-16 max-w-4xl mx-auto perspective"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-heritage-300/10 blur-3xl"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-xl preserve-3d hover:rotate-y-1 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&auto=format&fit=crop"
                  alt="Angkor Wat Temple"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="glass-panel rounded-xl p-4 max-w-md">
                    <h3 className="text-xl font-semibold text-white">Angkor Wat Temple</h3>
                    <p className="text-white/80 text-sm mt-1">Experience this ancient temple in augmented reality with detailed 3D models and historical context.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
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
