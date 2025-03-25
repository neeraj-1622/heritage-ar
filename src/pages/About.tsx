
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-heritage-950 to-heritage-900 text-heritage-100">
      <Header title="About HeritageAR" showBackButton />

      <motion.div 
        className="container mx-auto px-4 py-24 md:py-32"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient"
          variants={itemVariants}
        >
          About HeritageAR
        </motion.h1>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto"
          variants={itemVariants}
        >
          <div className="bg-heritage-800/40 rounded-2xl overflow-hidden glass-panel hover-lift">
            <motion.div 
              className="p-8"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold mb-4 text-accent">Our Mission</h2>
              <p className="text-heritage-300 leading-relaxed">
                HeritageAR is dedicated to bringing history to life through cutting-edge augmented reality technology. Our mission is to make historical education engaging, immersive, and accessible to everyone regardless of their location or background.
              </p>
            </motion.div>
          </div>

          <div className="bg-heritage-800/40 rounded-2xl overflow-hidden glass-panel hover-lift">
            <motion.div 
              className="p-8"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold mb-4 text-accent">Our Vision</h2>
              <p className="text-heritage-300 leading-relaxed">
                We envision a world where history is no longer confined to textbooks and museums, but instead comes alive in the spaces around us. Through augmented reality, we're creating a new dimension of historical understanding and appreciation.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="mt-16 max-w-4xl mx-auto glass-panel rounded-2xl p-8 hover-lift"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4 text-accent">Our Technology</h2>
          <p className="text-heritage-300 leading-relaxed mb-6">
            HeritageAR utilizes advanced computer vision and augmented reality technologies to recognize historical artifacts and overlay detailed 3D models and information. Our platform is designed to work seamlessly across different devices:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-heritage-300">
            <li className="ml-4">Mobile AR experiences through our iOS and Android apps</li>
            <li className="ml-4">Web-based exploration of historical sites</li>
            <li className="ml-4">Integration with AR glasses and headsets</li>
            <li className="ml-4">Support for educational institutions with custom content</li>
          </ul>
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gradient">Our Team</h2>
          <p className="text-heritage-300 max-w-2xl mx-auto mb-12">
            HeritageAR is built by a passionate team of historians, developers, designers, and educators dedicated to preserving and sharing our collective heritage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                className="glass-panel rounded-2xl p-6 text-center hover-lift"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="w-24 h-24 bg-heritage-700 rounded-full mx-auto mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 opacity-80"></div>
                </div>
                <h3 className="text-xl font-medium text-heritage-100">Team Member {i}</h3>
                <p className="text-heritage-400 text-sm mt-1">Role Title</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
