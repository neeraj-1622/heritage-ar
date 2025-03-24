
import React from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import SiteGallery from '../components/SiteGallery';

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
            
            <span className="inline-block px-4 py-1.5 text-xs font-medium bg-accent-100 rounded-full text-accent-700 mb-4 animate-float">
              Explore Historical Sites
            </span>
            
            <h1 className="text-5xl font-bold tracking-tight text-heritage-950 relative z-10 mb-6">
              <span className="text-gradient">Discover our heritage</span>
              <br /> in augmented reality
            </h1>
            
            <p className="mt-4 text-heritage-700 max-w-2xl mx-auto text-lg">
              Point your camera at the world and see historical sites come to life. 
              Explore ancient civilizations and learn about our shared cultural heritage.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="#gallery" className="button-primary hover-glow">
                Explore Sites
              </a>
              <a href="/ar" className="button-secondary">
                Try AR Experience
              </a>
            </div>
            
            {/* Hero image or animation */}
            <div className="relative mt-16 max-w-4xl mx-auto perspective">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-heritage-300/10 blur-3xl"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-xl preserve-3d hover:rotate-y-1 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1550399504-8953e1a6ac87?q=80&w=2047" 
                  alt="Augmented Reality Experience" 
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="glass-panel rounded-xl p-4 max-w-md">
                    <h3 className="text-xl font-semibold text-white">Immersive AR Technology</h3>
                    <p className="text-white/80 text-sm mt-1">Experience historical monuments in your surroundings with realistic 3D models and interactive elements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div id="gallery" className="pt-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-heritage-900">Featured Historical Sites</h2>
            <SiteGallery />
          </div>
        </div>
      </main>
      
      <footer className="py-10 bg-white border-t border-heritage-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="relative w-8 h-8 flex items-center justify-center mr-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent to-accent-400 rounded-md"></div>
                <span className="relative font-bold text-white z-10">AR</span>
              </div>
              <span className="text-heritage-900 font-semibold">HeritageAR</span>
            </div>
            
            <div className="flex space-x-8 text-sm text-heritage-600">
              <a href="#" className="hover:text-heritage-900 transition-colors">About</a>
              <a href="#" className="hover:text-heritage-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-heritage-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-heritage-900 transition-colors">Contact</a>
            </div>
            
            <div className="mt-6 md:mt-0 text-heritage-500 text-sm">
              &copy; {new Date().getFullYear()} HeritageAR
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
