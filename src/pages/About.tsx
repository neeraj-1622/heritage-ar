
import React, { useEffect } from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-heritage-950 text-white">
      <AnimatedHeader title="About Us" showBackButton={true} />
      
      <main className="flex-1 pt-28 pb-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-heritage-300/10 blur-3xl"></div>
              
              <h1 className="text-4xl font-bold mb-8 text-gradient relative z-10">About HeritageAR</h1>
              
              <div className="glass-panel rounded-xl p-8 mb-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/40"></div>
                
                <motion.p 
                  className="text-lg mb-6 text-white/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  HeritageAR is an innovative platform that brings historical sites and cultural heritage to life through augmented reality technology. Our mission is to make history more accessible, engaging, and interactive for people around the world.
                </motion.p>
                
                <motion.p 
                  className="text-lg mb-6 text-white/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Founded in 2023, our team of historians, AR developers, and education specialists work together to create immersive experiences that transport users across time and space, allowing them to explore ancient civilizations and historical landmarks in a completely new way.
                </motion.p>
              </div>
            </div>
            
            <motion.div 
              className="grid md:grid-cols-2 gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="glass-panel rounded-xl p-8 relative overflow-hidden hover-lift">
                <h2 className="text-2xl font-semibold mb-4 text-white">Our Vision</h2>
                <p className="text-white/80">
                  We envision a world where historical education is no longer confined to textbooks and museums, but is an interactive experience that can be accessed anywhere, at any time. By leveraging AR technology, we aim to preserve cultural heritage and make it accessible to future generations.
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/40 to-accent"></div>
              </div>
              
              <div className="glass-panel rounded-xl p-8 relative overflow-hidden hover-lift">
                <h2 className="text-2xl font-semibold mb-4 text-white">Our Technology</h2>
                <p className="text-white/80">
                  Our platform utilizes cutting-edge augmented reality technology that works on both iOS and Android devices. By simply pointing your camera at designated locations or markers, historical sites and artifacts come to life before your eyes, complete with detailed information and interactive elements.
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/40"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-panel rounded-xl p-8 mb-10 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-white">Meet Our Team</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  { name: "Dr. Emily Chen", role: "Chief Historian", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop" },
                  { name: "Michael Rodriguez", role: "Lead AR Developer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop" },
                  { name: "Sarah Johnson", role: "Education Specialist", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" }
                ].map((member, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center" 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + (index * 0.2) }}
                  >
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-accent/50">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-medium text-white">{member.name}</h3>
                    <p className="text-accent/80">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
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
              <a href="/about" className="hover:text-white transition-colors">About</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
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

export default About;
