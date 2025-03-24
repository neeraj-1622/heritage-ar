
import React from 'react';
import Header from '../components/Header';
import SiteGallery from '../components/SiteGallery';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-heritage-50 animate-fade-in">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-accent-100 rounded-full text-accent-700 mb-3">
              Explore Historical Sites
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-heritage-950">
              Discover our heritage in augmented reality
            </h1>
            <p className="mt-4 text-heritage-700 max-w-2xl mx-auto">
              Point your camera at the world and see historical sites come to life. 
              Explore ancient civilizations and learn about our shared cultural heritage.
            </p>
          </div>
          
          <SiteGallery />
        </div>
      </main>
      
      <footer className="py-6 bg-white border-t border-heritage-100">
        <div className="container mx-auto px-4 text-center text-heritage-500 text-sm">
          HeritageAR &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
