
import React from 'react';
import AnimatedHeader from '../components/AnimatedHeader';
import { motion } from 'framer-motion';
import { BookOpen, Camera, Globe, History, Server } from 'lucide-react';

const About: React.FC = () => {
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

  const features = [
    {
      icon: <Camera className="h-8 w-8 text-accent" />,
      title: "AR Visualization",
      description: "Experience historical sites in augmented reality directly through your device's camera."
    },
    {
      icon: <History className="h-8 w-8 text-accent" />,
      title: "Historical Context",
      description: "Access detailed information about each site including its historical significance and cultural impact."
    },
    {
      icon: <Globe className="h-8 w-8 text-accent" />,
      title: "Global Coverage",
      description: "Explore historical sites from different civilizations and time periods across the world."
    },
    {
      icon: <Server className="h-8 w-8 text-accent" />,
      title: "Offline Access",
      description: "Download content for offline access when traveling to locations with limited connectivity."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-accent" />,
      title: "Educational Resources",
      description: "Access educational materials and guided tours designed for different age groups and learning levels."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedHeader title="About HeritageAR" showBackButton />
      
      <motion.main 
        className="flex-1 pt-24 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <motion.div className="max-w-3xl mx-auto mb-16" variants={itemVariants}>
            <div className="flex justify-center mb-8">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent to-accent/70 rounded-md"></div>
                <span className="relative font-bold text-white text-2xl z-10">AR</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center text-heritage-100 mb-4">Our Mission</h1>
            <p className="text-heritage-300 text-lg text-center">
              At HeritageAR, we're on a mission to make history more accessible and engaging through 
              the power of augmented reality. We believe that by allowing people to visualize and interact 
              with historical sites and artifacts in their own environments, we can create more meaningful 
              connections to our shared human heritage.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-bold text-center text-heritage-100 mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass-panel rounded-2xl p-6 hover-lift"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <h3 className="text-xl font-semibold text-heritage-100 ml-3">{feature.title}</h3>
                  </div>
                  <p className="text-heritage-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div className="glass-panel rounded-2xl p-8 max-w-3xl mx-auto" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-heritage-100 mb-4">Our Story</h2>
            <p className="text-heritage-300 mb-4">
              HeritageAR began as a collaborative project between historians, archaeologists, and technologists 
              who shared a passion for making history more engaging and accessible to everyone. We recognized that 
              while museums and historical sites offer invaluable experiences, not everyone has the opportunity to 
              visit these locations in person.
            </p>
            <p className="text-heritage-300 mb-4">
              By leveraging augmented reality technology, we've created a platform that brings historical sites 
              and artifacts directly to users, regardless of their location. Our team works closely with historians 
              and cultural institutions to ensure that our digital reconstructions are accurate and respectful of 
              the cultural significance of each site.
            </p>
            <p className="text-heritage-300">
              Today, HeritageAR is used by educators, students, tourists, and history enthusiasts around the world. 
              We continue to expand our library of historical sites and improve our technology to provide the most 
              immersive and educational experience possible.
            </p>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default About;
