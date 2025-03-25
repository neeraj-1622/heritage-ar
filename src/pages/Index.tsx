
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedHeader from '../components/AnimatedHeader';
import SiteGallery from '../components/SiteGallery';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-heritage-950 text-white">
      <AnimatedHeader />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mb-16 text-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-10 left-1/4 w-20 h-20 rounded-full bg-accent/10 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-heritage-500/10 blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            
            <motion.span 
              className="inline-block px-4 py-1.5 text-xs font-medium bg-accent/20 rounded-full text-accent mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore Historical Sites
            </motion.span>
            
            <motion.h1 
              className="text-5xl font-bold tracking-tight text-white relative z-10 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="text-gradient">Discover our heritage</span>
              <br /> in augmented reality
            </motion.h1>
            
            <motion.p 
              className="mt-4 text-heritage-300 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Point your camera at the world and see historical sites come to life. 
              Explore ancient civilizations and learn about our shared cultural heritage.
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link to="#gallery" className="button-primary hover-glow">
                Explore Sites
              </Link>
              <Link to="/ar" className="button-secondary">
                Try AR Experience
              </Link>
            </motion.div>
            
            {/* Hero image or animation */}
            <motion.div 
              className="relative mt-16 max-w-4xl mx-auto perspective"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-heritage-500/10 blur-3xl"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-xl preserve-3d hover:rotate-y-1 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent z-10"></div>
                <motion.img 
                  src="https://images.unsplash.com/photo-1550399504-8953e1a6ac87?q=80&w=2047" 
                  alt="Augmented Reality Experience" 
                  className="w-full h-auto"
                  animate={{ scale: 1.05 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <motion.div 
                    className="glass-panel rounded-xl p-4 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                  >
                    <h3 className="text-xl font-semibold text-white">Immersive AR Technology</h3>
                    <p className="text-white/80 text-sm mt-1">Experience historical monuments in your surroundings with realistic 3D models and interactive elements.</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            id="gallery" 
            className="pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Featured Historical Sites
            </motion.h2>
            <SiteGallery />
          </motion.div>
        </div>
      </main>
      
      <footer className="py-10 bg-heritage-900 border-t border-heritage-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="relative w-8 h-8 flex items-center justify-center mr-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent to-accent-400 rounded-md"></div>
                <span className="relative font-bold text-white z-10">AR</span>
              </div>
              <span className="text-white font-semibold">HeritageAR</span>
            </div>
            
            <div className="flex space-x-8 text-sm text-heritage-400">
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            
            <div className="mt-6 md:mt-0 text-heritage-400 text-sm">
              &copy; {new Date().getFullYear()} HeritageAR
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
